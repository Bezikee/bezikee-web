import "server-only";

import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import http from "node:http";
import type { AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";

import { DEMO_PAGE_HEADERS } from "@admin/lib/demo/headers";
import { logger } from "@admin/lib/log";

const log = logger("generate.preview");

/**
 * Screenshots of a generated page, so the agent can see what it built.
 *
 * This runs in our own process, not the agent's. The agent's shell is sandboxed
 * too tightly for Chrome to start — and loosening the sandbox for every command
 * to let one browser run would be the wrong trade. So we take the pictures and
 * hand them over; the agent only ever reads PNGs in its own directory.
 *
 * The page is model-written and was shaped by third-party text, so it is
 * rendered the way demo.bezikee.com serves it and no more generously: from a
 * throwaway local server sending the production headers (CSP: no scripts, no
 * network, no frames), with scripts also disabled in the browser, all other
 * traffic pointed at a dead proxy, and a fresh browser profile. Serving over
 * http rather than opening a file:// URL matters: a file:// page may pull in
 * other local files, and anything that rendered would end up in a screenshot
 * the agent reads.
 */

export type Shot = { file: string; label: string };

export type Preview = {
  shots: Shot[];
  /** Measured problems, phrased for the agent. Empty when none were found. */
  findings: string[];
};

type Viewport = {
  name: string;
  label: string;
  width: number;
  height: number;
  mobile: boolean;
};

const VIEWPORTS: Viewport[] = [
  { name: "phone", label: "phone (390×844)", width: 390, height: 844, mobile: true },
  { name: "laptop", label: "laptop (1440×900)", width: 1440, height: 900, mobile: false },
];

/** Long pages are cut here: past this the image is too tall to read anyway. */
const MAX_FULL_HEIGHT = 7000;

/** Time for entrance animations to land before the first-screen shot. */
const SETTLE_MS = 2500;

const TIMEOUT_MS = 60_000;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

/** A Chrome-family browser to render with, or null — then builds skip review. */
export function findChrome(): string | null {
  return CHROME_CANDIDATES.find((candidate) => candidate && existsSync(candidate)) ?? null;
}

/**
 * Render `html` at phone and laptop sizes into `outDir`: the first screen as
 * a visitor lands (motion on, after it settles) and the whole page (reduced
 * motion, so everything is in its final state). Returns null if no browser is
 * available; throws only on a genuine rendering failure.
 */
export async function capturePreview(html: string, outDir: string): Promise<Preview | null> {
  const chrome = findChrome();
  if (!chrome) {
    log.warn("preview.unavailable", { note: "no Chrome found; set CHROME_PATH to enable visual review" });
    return null;
  }

  await fs.mkdir(outDir, { recursive: true });
  const server = await serve(html);
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), "bezikee-preview-"));
  let browser: ChildProcess | null = null;
  let cdp: Cdp | null = null;

  try {
    browser = spawn(
      chrome,
      [
        "--headless=new",
        `--user-data-dir=${profile}`,
        "--remote-debugging-port=0",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--disable-sync",
        "--disable-background-networking",
        "--disable-component-update",
        "--disable-default-apps",
        "--mute-audio",
        "--hide-scrollbars",
        // Nothing but our loopback server is reachable. Loopback bypasses the
        // proxy by default; everything else goes to a port nothing listens on.
        "--proxy-server=http://127.0.0.1:9",
        "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1",
        "about:blank",
      ],
      { stdio: "ignore" },
    );

    const port = await debuggingPort(profile);
    cdp = await openPage(port);

    await cdp.send("Page.enable");
    await cdp.send("DOM.enable");
    // CSP already blocks scripts; this blocks them even if a page found a way
    // around that, so what is measured is what the markup and CSS alone do.
    await cdp.send("Emulation.setScriptExecutionDisabled", { value: true });

    const shots: Shot[] = [];
    const findings: string[] = [];

    for (const viewport of VIEWPORTS) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });

      // First screen, as a visitor sees it once the entrance has played.
      await load(cdp, server.url, "no-preference");
      await sleep(SETTLE_MS);
      const fold = path.join(outDir, `${viewport.name}-first-screen.png`);
      await screenshot(cdp, fold);
      shots.push({ file: fold, label: `${viewport.label}, first screen` });

      findings.push(...(await measure(cdp, viewport)));
      if (!viewport.mobile) findings.push(...(await auditLayout(cdp, viewport)));

      // The whole page, with motion reduced so nothing is caught mid-reveal.
      await load(cdp, server.url, "reduce");
      await sleep(400);
      const metrics = (await cdp.send("Page.getLayoutMetrics")) as LayoutMetrics;
      const height = Math.min(Math.ceil(metrics.cssContentSize.height), MAX_FULL_HEIGHT);
      const full = path.join(outDir, `${viewport.name}-full-page.png`);
      await screenshot(cdp, full, { x: 0, y: 0, width: viewport.width, height, scale: 1 });
      shots.push({
        file: full,
        label: `${viewport.label}, whole page${
          metrics.cssContentSize.height > MAX_FULL_HEIGHT ? ` (first ${MAX_FULL_HEIGHT}px)` : ""
        }`,
      });
    }

    return { shots, findings: [...new Set(findings)] };
  } finally {
    cdp?.close();
    browser?.kill("SIGKILL");
    server.close();
    await fs.rm(profile, { recursive: true, force: true }).catch(() => {});
  }
}

// ------------------------------------------------------------------ measuring

type LayoutMetrics = {
  cssContentSize: { width: number; height: number };
  cssLayoutViewport: { clientWidth: number; clientHeight: number };
};

/** Things a screenshot can hide but a measurement can't. */
async function measure(cdp: Cdp, viewport: Viewport): Promise<string[]> {
  const findings: string[] = [];
  const metrics = (await cdp.send("Page.getLayoutMetrics")) as LayoutMetrics;

  const contentWidth = Math.ceil(metrics.cssContentSize.width);
  if (contentWidth > viewport.width + 1) {
    findings.push(
      `On a ${viewport.label} the page is ${contentWidth}px wide, so it scrolls sideways. Something is wider than the screen.`,
    );
  }

  const { root } = (await cdp.send("DOM.getDocument", { depth: 0 })) as { root: { nodeId: number } };
  const { nodeId } = (await cdp.send("DOM.querySelector", {
    nodeId: root.nodeId,
    selector: 'a[href^="tel:"]',
  })) as { nodeId: number };

  if (!nodeId) {
    findings.push("There is no working phone link (<a href=\"tel:…\">) anywhere on the page.");
    return findings;
  }

  try {
    const { model } = (await cdp.send("DOM.getBoxModel", { nodeId })) as {
      model: { border: number[] };
    };
    const ys = [model.border[1], model.border[3], model.border[5], model.border[7]];
    const bottom = Math.max(...ys);
    if (bottom > viewport.height) {
      findings.push(
        `On a ${viewport.label} the first phone button ends ${Math.round(bottom)}px down, below the first screen (${viewport.height}px). The hero must show the name, rating and phone button without scrolling.`,
      );
    }
  } catch {
    // No box: the link exists but isn't rendered (display: none).
    findings.push(`On a ${viewport.label} the phone link isn't visible on screen.`);
  }

  return findings;
}

/**
 * Composition problems a model reviewing its own screenshots tends to
 * approve: a section pinned to the left with the right of a laptop screen
 * empty, sections that are nothing but paragraphs, and too many words for a
 * pitch. Measured at laptop width, below the first screen — the hero is often
 * asymmetric on purpose.
 *
 * This runs a script in the page, but it is ours, sent over DevTools, not the
 * page's: the page's own scripts were disabled before it loaded and its CSP
 * forbids them anyway. Script execution is switched back on only for this
 * evaluation and off again straight after.
 */
async function auditLayout(cdp: Cdp, viewport: Viewport): Promise<string[]> {
  await cdp.send("Emulation.setScriptExecutionDisabled", { value: false });
  try {
    const { result, exceptionDetails } = (await cdp.send("Runtime.evaluate", {
      expression: `${LAYOUT_AUDIT_SCRIPT}(${viewport.height})`,
      returnByValue: true,
    })) as { result: { value?: LayoutAudit }; exceptionDetails?: { text?: string; exception?: { description?: string } } };
    if (exceptionDetails) {
      // Not thrown by CDP; it has to be looked for, or a broken audit just
      // reports a perfect page.
      throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text ?? "audit script failed");
    }
    return layoutFindings(result.value, viewport);
  } catch (error) {
    log.warn("audit.failed", { reason: error instanceof Error ? error.message : String(error) });
    return [];
  } finally {
    await cdp.send("Emulation.setScriptExecutionDisabled", { value: true });
  }
}

export type BandAudit = {
  label: string;
  top: number;
  contentLeft: number;
  contentRight: number;
  words: number;
  visuals: number;
};

export type LayoutAudit = { width: number; words: number; bands: BandAudit[] };

/** Most words a pitch page should carry, reviews and hours included. */
export const WORD_BUDGET = 350;

/** A band with more words than this and nothing to look at is a wall of text. */
const TEXT_ONLY_WORDS = 70;

/** Turn raw measurements into findings the agent can act on. Pure, for tests. */
export function layoutFindings(audit: LayoutAudit | undefined, viewport: Viewport): string[] {
  if (!audit) return [];
  const findings: string[] = [];
  const width = audit.width;

  for (const band of audit.bands) {
    const emptyLeft = band.contentLeft;
    const emptyRight = width - band.contentRight;
    const where = band.label ? `the "${band.label}" section` : `the section ${Math.round(band.top)}px down`;

    // Lopsided, not merely narrow: a centred 60rem column is fine; the same
    // column pinned left, with a third of the screen empty beside it, is not.
    if (emptyRight - emptyLeft > width * 0.15 && emptyRight > width * 0.22) {
      findings.push(
        `On a ${viewport.label}, ${where} only uses the left side: its content ends ${Math.round(band.contentRight)}px across, leaving ${Math.round(emptyRight)}px empty on the right. Centre the container (margin-inline: auto) or give the right side something that belongs there.`,
      );
    } else if (emptyLeft - emptyRight > width * 0.15 && emptyLeft > width * 0.22) {
      findings.push(
        `On a ${viewport.label}, ${where} only uses the right side, leaving ${Math.round(emptyLeft)}px empty on the left. Centre it or use that space.`,
      );
    }

    if (band.words > TEXT_ONLY_WORDS && band.visuals === 0) {
      findings.push(
        `${where[0].toUpperCase()}${where.slice(1)} is ${band.words} words of text with nothing to look at. Cut it down and give it a visual — a drawn element, the rating as a big numeral, a pattern from the place, a pull quote set large.`,
      );
    }
  }

  if (audit.words > WORD_BUDGET) {
    findings.push(
      `The page carries ${audit.words} words; a pitch should stay under ${WORD_BUDGET}, reviews and hours included. It reads as a lot of text — cut the prose hardest.`,
    );
  }

  return findings;
}

/**
 * Evaluated inside the page. Plain source rather than a function passed
 * through toString(): bundlers rewrite compiled functions (tsx injects a
 * `__name` helper) and the page would receive code referring to things that
 * only exist on our side. It finds the page's horizontal bands — the innermost
 * elements spanning the viewport — and, for each one below the first screen,
 * where its content actually sits, how many words it holds and how many
 * visuals.
 */
const LAYOUT_AUDIT_SCRIPT = String.raw`(function (foldHeight) {
  var vw = document.documentElement.clientWidth;
  function visible(el) {
    var style = getComputedStyle(el), rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }
  function fullWidth(el) {
    var rect = el.getBoundingClientRect();
    return visible(el) && rect.width >= vw * 0.9 && rect.height >= 120;
  }
  function wordsIn(el) {
    return (el.innerText || "").split(/\s+/).filter(function (w) { return /[\p{L}\p{N}]/u.test(w); }).length;
  }

  var candidates = Array.prototype.filter.call(document.body.querySelectorAll("*"), fullWidth);
  // Innermost: a full-width element with no full-width element inside it.
  var bands = candidates.filter(function (el) {
    return !candidates.some(function (other) { return other !== el && el.contains(other); });
  });

  var out = [];
  bands.forEach(function (band) {
    var box = band.getBoundingClientRect();
    // The hero starts on the first screen and is often asymmetric on purpose;
    // judging by where a band starts, not ends, keeps a tall hero out of it.
    if (box.top + window.scrollY < foldHeight * 0.5) return;

    var left = Infinity, right = -Infinity, visuals = 0;

    var walker = document.createTreeWalker(band, NodeFilter.SHOW_TEXT);
    for (var node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent || !node.textContent.trim()) continue;
      var range = document.createRange();
      range.selectNodeContents(node);
      Array.prototype.forEach.call(range.getClientRects(), function (rect) {
        if (rect.width < 1) return;
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
      });
    }

    Array.prototype.forEach.call(band.querySelectorAll("*"), function (el) {
      if (!visible(el)) return;
      var rect = el.getBoundingClientRect(), area = rect.width * rect.height, style = getComputedStyle(el);
      var graphic =
        (el.tagName.toLowerCase() === "svg" && area > 2500) ||
        (style.backgroundImage !== "none" && area > 10000 && rect.width < vw * 0.9) ||
        (parseFloat(style.fontSize) >= 64 && (el.innerText || "").trim().length <= 6);
      if (graphic) {
        visuals++;
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
      }
    });

    if (right < left) return;
    var heading = band.querySelector("h1, h2, h3");
    out.push({
      label: ((heading && heading.innerText) || "").trim().replace(/\s+/g, " ").slice(0, 60),
      top: box.top + window.scrollY,
      contentLeft: left,
      contentRight: right,
      words: wordsIn(band),
      visuals: visuals
    });
  });

  return { width: vw, words: wordsIn(document.body), bands: out };
})`;

// -------------------------------------------------------------- local server

/** Serve one page on loopback with the production headers, and nothing else. */
async function serve(html: string): Promise<{ url: string; close: () => void }> {
  const server = http.createServer((request, response) => {
    if (request.url === "/" || request.url === "/index.html") {
      response.writeHead(200, DEMO_PAGE_HEADERS);
      response.end(html);
    } else {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("Not found");
    }
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  return { url: `http://127.0.0.1:${port}/`, close: () => server.close() };
}

// ------------------------------------------------------ Chrome DevTools client

/** Chrome writes the port it chose to this file once it is listening. */
async function debuggingPort(profile: string): Promise<number> {
  const file = path.join(profile, "DevToolsActivePort");
  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    const text = await fs.readFile(file, "utf8").catch(() => "");
    const port = Number(text.split("\n")[0]);
    if (port > 0) return port;
    await sleep(100);
  }
  throw new Error("Chrome did not start its debugging endpoint in time.");
}

type Cdp = {
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>;
  once: (event: string) => Promise<void>;
  close: () => void;
};

/** A new tab, driven over the DevTools protocol with Node's built-in WebSocket. */
async function openPage(port: number): Promise<Cdp> {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  const target = (await response.json()) as { webSocketDebuggerUrl: string };

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise<void>((resolve, reject) => {
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener("error", () => reject(new Error("Could not connect to Chrome.")), { once: true });
  });

  let nextId = 1;
  const pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();
  const waiters = new Map<string, Array<() => void>>();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data)) as {
      id?: number;
      method?: string;
      result?: unknown;
      error?: { message: string };
    };
    if (message.id != null) {
      const call = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) call?.reject(new Error(message.error.message));
      else call?.resolve(message.result);
    } else if (message.method) {
      const list = waiters.get(message.method) ?? [];
      waiters.delete(message.method);
      for (const wake of list) wake();
    }
  });

  const withTimeout = <T>(promise: Promise<T>, what: string) =>
    Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Chrome timed out on ${what}.`)), TIMEOUT_MS),
      ),
    ]);

  return {
    send: (method, params = {}) =>
      withTimeout(
        new Promise((resolve, reject) => {
          const id = nextId++;
          pending.set(id, { resolve, reject });
          socket.send(JSON.stringify({ id, method, params }));
        }),
        method,
      ),
    once: (event) =>
      withTimeout(
        new Promise<void>((resolve) => {
          waiters.set(event, [...(waiters.get(event) ?? []), resolve]);
        }),
        event,
      ),
    close: () => socket.close(),
  };
}

async function load(cdp: Cdp, url: string, motion: "reduce" | "no-preference") {
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: motion }],
  });
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await loaded;
}

async function screenshot(
  cdp: Cdp,
  file: string,
  clip?: { x: number; y: number; width: number; height: number; scale: number },
) {
  const { data } = (await cdp.send("Page.captureScreenshot", {
    format: "png",
    ...(clip ? { clip, captureBeyondViewport: true } : {}),
  })) as { data: string };
  await fs.writeFile(file, Buffer.from(data, "base64"));
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
