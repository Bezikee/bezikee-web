import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { describe, expect, it } from "vitest";

import { APPROVAL, pageProblems, reviewPrompt } from "./agent";
import type { Direction } from "./direction";
import {
  WORD_BUDGET,
  capturePreview,
  findChrome,
  layoutFindings,
  type BandAudit,
} from "./preview";

const DIRECTION: Direction = {
  layout: "letter",
  hero: "H5",
  footer: "Ft6",
  palette: "olive",
  type: "humanist",
  motion: "underline",
  ornament: "rules",
};

const PAGE = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;font-family:Optima,sans-serif}header{min-height:100svh;display:grid;place-content:center}</style>
</head><body><header><h1>Bar Loreto</h1><p>4,6 · 816 reseñas</p><a href="tel:+34914472522">Llamar</a></header>
<section><p>Un clásico del barrio, de los de siempre.</p></section></body></html>`;

describe("pageProblems", () => {
  const source = JSON.stringify({ reviews: ["Abierto desde 1983"] });

  it("passes a page that follows the rules", () => {
    expect(pageProblems(PAGE, source)).toEqual([]);
  });

  it("names every broken rule so the agent can fix it rather than fail", () => {
    const bad = PAGE.replace(
      "</section>",
      `<p>Desde 1965</p><img src="photo.jpg"><script>1</script></section>`,
    );
    const problems = pageProblems(bad, source);
    expect(problems.join("\n")).toMatch(/1965/);
    expect(problems.join("\n")).toMatch(/image/);
    expect(problems.join("\n")).toMatch(/script/);
    expect(problems).toHaveLength(3);
  });

  it("allows a year the data actually states", () => {
    expect(pageProblems(PAGE.replace("siempre", "siempre, desde 1983"), source)).toEqual([]);
  });

  it("flags an empty page", () => {
    expect(pageProblems("<html></html>", source)[0]).toMatch(/empty/);
  });
});

describe("reviewPrompt", () => {
  const sandbox = "/tmp/build/bar-loreto-1959";
  const preview = {
    shots: [
      { file: `${sandbox}/review/round-1/phone-first-screen.png`, label: "phone (390×844), first screen" },
      { file: `${sandbox}/review/round-1/laptop-full-page.png`, label: "laptop (1440×900), whole page" },
    ],
    findings: ["On a phone (390×844) the page is 612px wide, so it scrolls sideways."],
  };

  it("points the agent at its screenshots by paths inside its sandbox", () => {
    const prompt = reviewPrompt({ review: 1, lastReview: false, preview, problems: [], direction: DIRECTION, sandbox });
    expect(prompt).toContain("./review/round-1/phone-first-screen.png");
    expect(prompt).not.toContain("/tmp/build");
  });

  it("puts measured findings and broken rules under must-fix", () => {
    const prompt = reviewPrompt({
      review: 1,
      lastReview: false,
      preview,
      problems: ["The page states the year 1965"],
      direction: DIRECTION,
      sandbox,
    });
    expect(prompt).toMatch(/Must fix[\s\S]*1965[\s\S]*scrolls sideways/);
  });

  it("reminds it of the art direction and the skill's slop test", () => {
    const prompt = reviewPrompt({ review: 1, lastReview: false, preview, problems: [], direction: DIRECTION, sandbox });
    expect(prompt).toContain("Letter · Olive & linen · Optima + Seravek");
    expect(prompt).toContain("slop test");
  });

  it("asks for an explicit sign-off only while there are reviews left", () => {
    const early = reviewPrompt({ review: 1, lastReview: false, preview, problems: [], direction: DIRECTION, sandbox });
    const last = reviewPrompt({ review: 2, lastReview: true, preview, problems: [], direction: DIRECTION, sandbox });
    expect(early).toContain(APPROVAL);
    expect(last).not.toContain(APPROVAL);
    expect(last).toContain("final review");
  });

  it("still reviews when no browser is available", () => {
    const prompt = reviewPrompt({ review: 1, lastReview: false, preview: null, problems: [], direction: DIRECTION, sandbox });
    expect(prompt).toContain("no browser available");
  });
});

// Real Chrome, when this machine has one: the checks a picture can't make.
describe.skipIf(!findChrome())("capturePreview", () => {
  const render = async (html: string) => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "preview-test-"));
    try {
      const preview = (await capturePreview(html, dir))!;
      const sizes = await Promise.all(preview.shots.map((s) => fs.stat(s.file).then((st) => st.size)));
      return { preview, sizes };
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  };

  it("screenshots the first screen and the whole page at phone and laptop sizes", async () => {
    const { preview, sizes } = await render(PAGE);
    expect(preview.shots.map((s) => s.label)).toEqual([
      "phone (390×844), first screen",
      "phone (390×844), whole page",
      "laptop (1440×900), first screen",
      "laptop (1440×900), whole page",
    ]);
    for (const size of sizes) expect(size).toBeGreaterThan(1000);
    expect(preview.findings).toEqual([]);
  }, 60_000);

  it("measures sideways scroll and a call button below the fold", async () => {
    const broken = PAGE.replace(
      "<header>",
      `<div style="width:900px;height:10px"></div><div style="height:1400px"></div><header>`,
    );
    const { preview } = await render(broken);
    expect(preview.findings.join("\n")).toMatch(/390×844\) the page is 900px wide/);
    expect(preview.findings.join("\n")).toMatch(/below the first screen/);
  }, 60_000);

  it("renders like production: no scripts run", async () => {
    // A script adding the phone link would hide the "no phone link" finding.
    const scripted = PAGE.replace(/<a href="tel:[^"]+">Llamar<\/a>/, "").replace(
      "</body>",
      `<script>document.body.insertAdjacentHTML('beforeend','<a href="tel:1">x</a>')</script></body>`,
    );
    const { preview } = await render(scripted);
    expect(preview.findings.join("\n")).toMatch(/no working phone link/);
  }, 60_000);
});

describe("layoutFindings", () => {
  const laptop = { name: "laptop", label: "laptop (1440×900)", width: 1440, height: 900, mobile: false };
  const band = (over: Partial<BandAudit>): BandAudit => ({
    label: "Pásate por el 72.",
    top: 1200,
    contentLeft: 200,
    contentRight: 1240,
    words: 40,
    visuals: 1,
    ...over,
  });

  it("passes a composed page", () => {
    expect(layoutFindings({ width: 1440, words: 260, bands: [band({})] }, laptop)).toEqual([]);
  });

  it("flags content pinned to one side with the rest of the screen empty", () => {
    // The reported page: a 64rem column with no margin-inline: auto.
    const [finding] = layoutFindings(
      { width: 1440, words: 260, bands: [band({ contentLeft: 72, contentRight: 1096 })] },
      laptop,
    );
    expect(finding).toMatch(/"Pásate por el 72\." section only uses the left side/);
    expect(finding).toMatch(/344px empty on the right/);
    expect(finding).toMatch(/margin-inline: auto/);
  });

  it("doesn't flag a column that is narrow but centred", () => {
    expect(
      layoutFindings({ width: 1440, words: 260, bands: [band({ contentLeft: 420, contentRight: 1020 })] }, laptop),
    ).toEqual([]);
  });

  it("flags a section that is only paragraphs", () => {
    const findings = layoutFindings(
      { width: 1440, words: 300, bands: [band({ label: "Aquí se viene durante años.", words: 257, visuals: 0 })] },
      laptop,
    );
    expect(findings.join("\n")).toMatch(/257 words of text with nothing to look at/);
  });

  it("flags a page over the word budget", () => {
    const findings = layoutFindings({ width: 1440, words: WORD_BUDGET + 116, bands: [] }, laptop);
    expect(findings.join("\n")).toMatch(new RegExp(`${WORD_BUDGET + 116} words`));
  });

  it("stays quiet when there is nothing to audit", () => {
    expect(layoutFindings(undefined, laptop)).toEqual([]);
  });
});

// The audit itself, in a real browser, on the shape of the page that was reported.
describe.skipIf(!findChrome())("layout audit in Chrome", () => {
  const section = (css: string) => `<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;font-family:Georgia,serif} header{height:100svh} .wrap{padding:3rem 72px} .col{${css}}</style>
</head><body><header><h1>Teste Matte</h1><a href="tel:622123961">Llamar</a></header>
<section class="wrap"><div class="col"><h2>Pásate por el 72.</h2><p>${"Lunes a sábado en pleno Arganzuela. ".repeat(4)}</p></div></section>
</body></html>`;

  const findingsFor = async (html: string) => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "audit-test-"));
    try {
      return (await capturePreview(html, dir))!.findings.join("\n");
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  };

  it("catches a column pinned left, and clears once it is centred", async () => {
    expect(await findingsFor(section("max-width:64rem"))).toMatch(/only uses the left side/);
    expect(await findingsFor(section("max-width:64rem;margin-inline:auto"))).not.toMatch(/only uses/);
  }, 90_000);
});
