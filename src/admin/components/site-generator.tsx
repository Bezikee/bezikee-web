"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type BuildStatus = "pending" | "fetching" | "generating" | "reviewing" | "completed" | "failed";

type Build = {
  id: number;
  slug: string;
  status: BuildStatus;
  photoCount: number;
  costUsd: number;
  error: string | null;
  finishedAt: string | null;
};

type State = {
  build: Build | null;
  /** https://demo.bezikee.com/<uuid>, once a page has been published. */
  demoUrl: string | null;
  /** The art direction of the latest build, e.g. "Letter · Olive & linen · Optima + Seravek". */
  look: string | null;
  live: boolean;
  available: boolean;
  estimatedCostUsd: number;
};

/** What the user sees while each stage runs. */
const STAGE_LABEL: Record<BuildStatus, string> = {
  pending: "Starting…",
  fetching: "Fetching details and photos from Google…",
  generating: "Claude is designing the page…",
  reviewing: "Claude is checking the page in a browser and polishing it…",
  completed: "Done",
  failed: "Failed",
};

const POLL_MS = 2000;

export function SiteGenerator({ leadId }: { leadId: number }) {
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Survives re-renders without restarting the effect that owns it.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/site/`);
      if (!res.ok) return null;
      const next = (await res.json()) as State;
      setState(next);
      return next;
    } catch {
      // A failed poll is not worth showing; the next one will most likely work.
      return null;
    }
  }, [leadId]);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      const next = await load();
      if (cancelled) return;

      // Keep polling only while there is something to watch.
      const active =
        next?.live || next?.build?.status === "pending" ||
        next?.build?.status === "fetching" || next?.build?.status === "generating" ||
          next?.build?.status === "reviewing";

      if (active) {
        timer.current = setTimeout(tick, POLL_MS);
      } else if (next?.build?.status === "completed") {
        // The build may have filled in the demo URL on the lead.
        router.refresh();
      }
    };

    void tick();

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [load, router]);

  const start = async (refresh: boolean) => {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/site/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error ?? "Could not start the build.");
        return;
      }

      // Show "starting" immediately rather than waiting for the first poll.
      setState((prev) =>
        prev
          ? { ...prev, live: true, build: { ...(prev.build ?? {} as Build), id: body.buildId, slug: body.slug, status: "pending", error: null } }
          : prev,
      );

      const tick = async () => {
        const next = await load();
        const active =
          next?.live || next?.build?.status === "pending" ||
          next?.build?.status === "fetching" || next?.build?.status === "generating" ||
          next?.build?.status === "reviewing";
        if (active) timer.current = setTimeout(tick, POLL_MS);
        else router.refresh();
      };
      timer.current = setTimeout(tick, POLL_MS);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  if (!state) return null;

  const build = state.build;
  const running =
    state.live ||
    build?.status === "pending" ||
    build?.status === "fetching" ||
    build?.status === "generating" ||
    build?.status === "reviewing";
  const done = build?.status === "completed" && !running;

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Demo website</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Pulls everything Google has, then has Claude build a page.
          </p>
        </div>
      </div>

      {!state.available ? (
        <div className="space-y-3">
          {/* Generating needs the CLI; viewing does not. On bezikee.com the
              button is impossible, but the published page is in the shared
              database, and that is the half everyone else needs. */}
          {state.demoUrl ? <DemoLink url={state.demoUrl} /> : null}
          <p className="rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink-muted">
            {state.demoUrl
              ? "Rebuilding needs the claude CLI, so run the admin locally (npm run dev) to do it."
              : "No site yet. Generating needs the claude CLI and a Google Maps API key, so run the admin locally (npm run dev)."}
          </p>
        </div>
      ) : running ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className="size-2 animate-pulse rounded-full bg-accent"
            />
            <span>{STAGE_LABEL[build?.status ?? "pending"]}</span>
          </div>
          {state.look ? (
            <p className="text-xs text-ink-secondary">Look: {state.look}</p>
          ) : null}
          <p className="text-xs text-ink-muted">
            Designing and reviewing usually takes 5–15 minutes. You can leave the page.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {state.demoUrl ? <DemoLink url={state.demoUrl} /> : null}

          {done && build ? (
            <p className="text-xs text-ink-muted">
              {state.look ? <span className="block text-ink-secondary">{state.look}</span> : null}
              {build.photoCount} photo{build.photoCount === 1 ? "" : "s"}
              {build.costUsd > 0
                ? ` · cost $${build.costUsd.toFixed(3)}`
                : " · reused cached details, free"}
            </p>
          ) : null}

          {build?.status === "failed" ? (
            <p className="rounded-md border border-line bg-surface px-3 py-2 text-xs text-critical">
              {build.error ?? "The build failed."}
            </p>
          ) : null}

          <button
            type="button"
            // Never forces a fresh Place Details fetch: that is a paid call, and a
            // new look needs new design choices, not new data from Google.
            onClick={() => start(false)}
            disabled={busy}
            className="w-full rounded-md border border-line px-3 py-2 text-sm font-medium transition-colors hover:border-line-strong disabled:opacity-50"
          >
            {done ? "Rebuild with a new look" : build?.status === "failed" ? "Try again" : "Generate site"}
          </button>

          {!done ? (
            <p className="text-xs text-ink-muted">
              About ${state.estimatedCostUsd.toFixed(3)} in Google API calls the
              first time; rebuilds reuse the details and cost nothing.
            </p>
          ) : null}

          {error ? <p className="text-xs text-critical">{error}</p> : null}
        </div>
      )}
    </div>
  );
}

/** The shareable link: open it, or copy it to paste into a message. */
function DemoLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be refused; the link is still selectable below.
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-md bg-accent px-3 py-2 text-center text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
        >
          Open the site
        </a>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-line px-3 py-2 text-sm font-medium transition-colors hover:border-line-strong"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <p className="select-all break-all font-mono text-[11px] text-ink-muted">{url}</p>
    </div>
  );
}
