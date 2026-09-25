import { desc, eq } from "drizzle-orm";
import { NextResponse, after } from "next/server";

import { db } from "@admin/lib/db";
import { scrapeJobs } from "@admin/lib/db/schema";
import { logger } from "@admin/lib/log";
import { hasApiKey } from "@admin/lib/places/client";
import {
  SCRAPE_TIME_LIMIT_MS,
  hasRunningJob,
  recoverInterruptedJobs,
  runJob,
} from "@admin/lib/scrape/runner";
import { jobRequestSchema, resolveJob } from "@admin/lib/scrape/params";

const log = logger("api.jobs");

/**
 * The scrape runs in `after()`, so it lives as long as this function may:
 * seconds, and a literal because the build reads it statically. Must match
 * SCRAPE_MAX_DURATION_SECONDS in src/admin/lib/scrape/runner.ts. 300 is the
 * Hobby plan's ceiling; on Pro raise both to 800 for bigger sweeps per run.
 */
export const maxDuration = 300;

export async function GET() {
  await recoverInterruptedJobs();

  const jobs = await db
    .select()
    .from(scrapeJobs)
    .orderBy(desc(scrapeJobs.createdAt))
    .limit(25);

  return NextResponse.json({ jobs });
}

/** Create a scrape job and start it in the background. */
export async function POST(request: Request) {
  if (!hasApiKey()) {
    log.warn("rejected.no_api_key", {
      hint: "GOOGLE_MAPS_API_KEY missing from .env.local, or the server wasn't restarted after adding it",
    });
    return NextResponse.json(
      {
        error:
          "GOOGLE_MAPS_API_KEY is not set. Add it to the Vercel project's environment variables (or .env.local locally) and redeploy.",
      },
      { status: 400 },
    );
  }

  // Jobs share one request budget; running several at once makes both the
  // spend and the progress bar meaningless.
  if (await hasRunningJob()) {
    log.warn("rejected.already_running");
    return NextResponse.json(
      { error: "A scrape is already running. Wait for it to finish or cancel it." },
      { status: 409 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = jobRequestSchema.safeParse(body);
  if (!parsed.success) {
    log.warn("rejected.invalid_request", {
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const resolved = resolveJob(parsed.data);
  if (!resolved.ok) {
    log.warn("rejected.unresolvable", { reason: resolved.error });
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  const { job } = resolved;

  // No pre-scrape pg_dump here, unlike the VPS build: a function has neither
  // the binary nor anywhere lasting to put the file. Point-in-time restore on
  // the managed database covers the same risk — see docs/ADMIN.md.

  const [created] = await db
    .insert(scrapeJobs)
    .values({
      areaName: job.areaLabel,
      params: JSON.stringify(job),
      status: "pending",
    })
    .returning({ id: scrapeJobs.id });

  log.info("job.created", {
    jobId: created.id,
    area: job.areaLabel,
    categories: job.categories.length,
    maxRequests: job.maxRequests,
  });

  // After the response, so the dashboard gets the id at once and polls
  // progress. A plain un-awaited promise would be frozen with the function the
  // moment the response went out; `after` keeps it alive up to `maxDuration`,
  // and the time limit stops the job cleanly just inside that.
  after(async () => {
    try {
      await runJob(created.id, job, { timeLimitMs: SCRAPE_TIME_LIMIT_MS });
    } catch (error) {
      // runJob handles its own failures; reaching here means it threw outside
      // that, which would otherwise leave the row marked running.
      log.error("job.unhandled", { jobId: created.id }, error);
      await db
        .update(scrapeJobs)
        .set({
          status: "failed",
          error: error instanceof Error ? error.message : String(error),
          finishedAt: new Date(),
        })
        .where(eq(scrapeJobs.id, created.id));
    }
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
