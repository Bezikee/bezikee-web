import "server-only";

import { and, eq, inArray, lt, sql } from "drizzle-orm";

import { getCategory } from "@admin/config/categories";
import { db } from "@admin/lib/db";
import { businesses, leadEvents, leads, scrapeJobs } from "@admin/lib/db/schema";
import {
  DEFAULT_DOMAIN_LISTS,
  classifyWebsite,
  isLead,
  scoreLead,
  type DomainLists,
} from "@admin/lib/leads/classify";
import { logger } from "@admin/lib/log";
import { coverageCutoff, extraDomains } from "@admin/lib/settings";
import {
  billedThisProcess,
  COST_PER_REQUEST_USD,
  PlacesApiError,
  searchTextAllPages,
} from "@admin/lib/places/client";
import type { Place } from "@admin/lib/places/types";
import { cellKey, recordSweep, sweptSince } from "./coverage";
import { generateGrid, subdivide, type Cell } from "./grid";

export type JobParams = {
  areaSlug: string;
  areaLabel: string;
  lat: number;
  lng: number;
  radius: number;
  categories: string[];
  cellRadius: number;
  maxDepth: number;
  maxRequests: number;
  /** Ignore the coverage cache and re-search everything, at full price. */
  force?: boolean;
};

export type RunOptions = {
  /**
   * Stop starting new searches after this many milliseconds, keeping what was
   * found. Set from the route's `maxDuration` so a job finishes on its own
   * terms rather than being killed by the platform mid-write.
   */
  timeLimitMs?: number;
};

type WorkItem = { cell: Cell; categorySlug: string };

/** How many Places calls are in flight at once. */
const CONCURRENCY = 4;

const log = logger("scrape");

/**
 * How long the function running a scrape may live, in seconds. Kept in step by
 * hand with `maxDuration` in app/api/admin/jobs/route.ts, which must be a
 * literal there. 300 is the most Vercel's Hobby plan allows; on Pro it can go
 * to 800 — raise both together.
 */
export const SCRAPE_MAX_DURATION_SECONDS = 300;

/**
 * When a job stops starting new searches: the platform limit less a margin for
 * the searches already in flight to land and the final counters to be written.
 */
export const SCRAPE_TIME_LIMIT_MS = (SCRAPE_MAX_DURATION_SECONDS - 30) * 1000;

/**
 * A job can't outlive the function running it, so one still `pending` or
 * `running` well past that limit belongs to a function that was killed.
 */
const STALE_AFTER_MS = (SCRAPE_MAX_DURATION_SECONDS + 60) * 1000;

/**
 * Jobs started by *this* instance, so a cancel that lands here can also abort
 * searches in flight. It is only a shortcut: on Vercel the cancel request may
 * reach a different instance, so the `cancelRequested` column is what every
 * job actually obeys, and anything asking "is a job running?" asks the
 * database. Held on `globalThis` so dev-server hot reloads don't lose it.
 */
type Registry = Map<number, { controller: AbortController }>;
const globalForJobs = globalThis as unknown as { __bezikeeAdminJobs?: Registry };
const running: Registry = (globalForJobs.__bezikeeAdminJobs ??= new Map());

export function cancelJob(jobId: number): boolean {
  const entry = running.get(jobId);
  if (!entry) return false;
  entry.controller.abort();
  return true;
}

/** Still in progress, as far as the database knows. */
export function isActive(status: string): boolean {
  return status === "pending" || status === "running";
}

/**
 * Mark jobs whose function has died as `interrupted`.
 *
 * On a server this ran once at boot. Serverless has no boot — and a cold start
 * here says nothing about jobs running on other instances — so it runs lazily
 * wherever job state is read, and judges by age instead: nothing can still be
 * running past the platform's time limit.
 */
export async function recoverInterruptedJobs(): Promise<number> {
  const cutoff = new Date(Date.now() - STALE_AFTER_MS);

  const recovered = await db
    .update(scrapeJobs)
    .set({
      status: "interrupted",
      finishedAt: new Date(),
      error: "The function running this job stopped before it finished.",
    })
    .where(
      and(inArray(scrapeJobs.status, ["pending", "running"]), lt(scrapeJobs.createdAt, cutoff)),
    )
    .returning({ id: scrapeJobs.id, requestsMade: scrapeJobs.requestsMade });

  if (recovered.length > 0) {
    log.warn("job.interrupted_recovered", {
      jobs: recovered.map((job) => job.id),
      requestsAlreadySpent: recovered.reduce((sum, job) => sum + job.requestsMade, 0),
      note: "still marked running past the time limit; the function was killed",
    });
  }

  return recovered.length;
}

/** Is any scrape in progress? One at a time keeps the budget and progress bar meaningful. */
export async function hasRunningJob(): Promise<boolean> {
  await recoverInterruptedJobs();

  const [row] = await db
    .select({ id: scrapeJobs.id })
    .from(scrapeJobs)
    .where(inArray(scrapeJobs.status, ["pending", "running"]))
    .limit(1);

  return Boolean(row);
}

function toBusinessRow(
  place: Place,
  categorySlug: string,
  areaLabel: string,
  lists: DomainLists,
) {
  const phone = place.nationalPhoneNumber ?? null;
  const { websiteClass, host } = classifyWebsite(place.websiteUri, lists);
  const rating = place.rating ?? null;
  const userRatingCount = place.userRatingCount ?? null;
  const businessStatus = place.businessStatus ?? null;

  return {
    placeId: place.id,
    name: place.displayName?.text ?? "(sin nombre)",
    address: place.formattedAddress ?? null,
    lat: place.location?.latitude ?? null,
    lng: place.location?.longitude ?? null,
    types: place.types ? JSON.stringify(place.types) : null,
    primaryCategory: categorySlug,
    phone,
    websiteUri: place.websiteUri ?? null,
    websiteHost: host,
    rating,
    userRatingCount,
    businessStatus,
    websiteClass,
    leadScore: scoreLead({
      websiteClass,
      rating,
      userRatingCount,
      phone,
      businessStatus,
    }),
    areaName: areaLabel,
    lastSeenAt: new Date(),
  };
}

/**
 * Insert or refresh a whole page of places at once, creating leads for the ones
 * without a real website.
 *
 * This used to run three to five statements per business. That was free against
 * a local file, but the database now lives on a VPS: at ~40ms a round trip, the
 * 2,012 businesses of a real sweep would have spent well over an hour just
 * waiting on the network. The same work is now four statements per page,
 * whatever the page size.
 *
 * `xmax = 0` is how Postgres tells you which rows an upsert actually inserted
 * rather than updated — it is zero only for a freshly inserted tuple.
 */
async function upsertPlaces(
  places: Place[],
  categorySlug: string,
  areaLabel: string,
  lists: DomainLists,
): Promise<{ newBusinesses: number; leadsCreated: number }> {
  if (places.length === 0) return { newBusinesses: 0, leadsCreated: 0 };

  const rows = places.map((place) =>
    toBusinessRow(place, categorySlug, areaLabel, lists),
  );

  // Google can return the same place twice inside one page; the upsert would
  // then hit the same row twice in a single statement, which Postgres refuses.
  const byPlaceId = new Map(rows.map((row) => [row.placeId, row]));
  const unique = [...byPlaceId.values()];

  const upserted = await db
    .insert(businesses)
    .values(unique.map((row) => ({ ...row, firstSeenAt: new Date() })))
    .onConflictDoUpdate({
      target: businesses.placeId,
      // Everything Google can tell us is refreshed. Deliberately absent:
      // `primaryCategory`, so a later sweep doesn't relabel a business you have
      // been working, and the `websiteStatus` columns, which belong to the
      // dead-site probe rather than to the scraper.
      set: {
        name: sql`excluded.name`,
        address: sql`excluded.address`,
        lat: sql`excluded.lat`,
        lng: sql`excluded.lng`,
        types: sql`excluded.types`,
        phone: sql`excluded.phone`,
        websiteUri: sql`excluded.website_uri`,
        websiteHost: sql`excluded.website_host`,
        rating: sql`excluded.rating`,
        userRatingCount: sql`excluded.user_rating_count`,
        businessStatus: sql`excluded.business_status`,
        websiteClass: sql`excluded.website_class`,
        leadScore: sql`excluded.lead_score`,
        areaName: sql`excluded.area_name`,
        lastSeenAt: sql`excluded.last_seen_at`,
      },
    })
    .returning({
      id: businesses.id,
      placeId: businesses.placeId,
      isNew: sql<boolean>`(xmax = 0)`,
    });

  const newBusinesses = upserted.filter((row) => row.isNew).length;

  // Only the ones that qualify as a lead are candidates.
  const sellable = new Set(
    unique.filter((row) => isLead(row.websiteClass)).map((row) => row.placeId),
  );
  const candidates = upserted.filter((row) => sellable.has(row.placeId));
  if (candidates.length === 0) return { newBusinesses, leadsCreated: 0 };

  const alreadyLeads = new Set(
    (
      await db
        .select({ businessId: leads.businessId })
        .from(leads)
        .where(
          inArray(
            leads.businessId,
            candidates.map((row) => row.id),
          ),
        )
    ).map((row) => row.businessId),
  );

  const toCreate = candidates.filter((row) => !alreadyLeads.has(row.id));
  if (toCreate.length === 0) return { newBusinesses, leadsCreated: 0 };

  const created = await db
    .insert(leads)
    .values(toCreate.map((row) => ({ businessId: row.id, status: "new" as const })))
    .returning({ id: leads.id });

  await db.insert(leadEvents).values(
    created.map((lead) => ({
      leadId: lead.id,
      type: "created",
      message: `Found in ${areaLabel} while searching "${categorySlug}".`,
    })),
  );

  return { newBusinesses, leadsCreated: created.length };
}

/**
 * Sweep an area: tile it, query each cell for each category, subdivide the
 * cells that come back full, and stop cleanly when cancelled or when the
 * request budget runs out.
 */
export async function runJob(
  jobId: number,
  params: JobParams,
  options: RunOptions = {},
): Promise<void> {
  const controller = new AbortController();
  running.set(jobId, { controller });

  const deadline =
    options.timeLimitMs == null ? null : Date.now() + options.timeLimitMs;
  const pastDeadline = () => deadline != null && Date.now() >= deadline;

  const jobLog = log.child({ jobId });
  jobLog.info("job.start", {
    area: params.areaLabel,
    areaSlug: params.areaSlug,
    lat: params.lat,
    lng: params.lng,
    radius: params.radius,
    categories: params.categories,
    categoryCount: params.categories.length,
    cellRadius: params.cellRadius,
    maxDepth: params.maxDepth,
    maxRequests: params.maxRequests,
    maxCostUsd: Math.round(params.maxRequests * COST_PER_REQUEST_USD * 1000) / 1000,
    force: Boolean(params.force),
  });

  // Read the user's extra directory domains once, so every place in this job is
  // judged against the same rules.
  const domainLists: DomainLists = {
    ...DEFAULT_DOMAIN_LISTS,
    aggregator: [...DEFAULT_DOMAIN_LISTS.aggregator, ...(await extraDomains())],
  };

  const counters = {
    requests: 0,
    results: 0,
    businesses: 0,
    newBusinesses: 0,
    leads: 0,
    cellsDone: 0,
    saturated: 0,
    skipped: 0,
    // Searches the budget cap or the time limit cut short — abandoned before
    // their first request, or stopped part-way through paging. Not persisted;
    // it exists so the run can tell "spent exactly its budget and finished"
    // from "spent exactly its budget and gave up on the rest".
    budgetTruncated: 0,
  };

  // Cells overlap and a business can match several categories, so the same place
  // comes back more than once. Counting distinct ids keeps "businesses found"
  // meaning businesses rather than result rows.
  const seenPlaceIds = new Set<string>();

  // Warn about types Google rejects once, then fall back to plain text search.
  const droppedTypes = new Set<string>();

  // Searches already paid for inside the coverage window. Skipping them is the
  // only way to make a repeat sweep cheaper — Google bills per request whether
  // or not the places coming back are ones we already have.
  const cutoff = params.force ? null : await coverageCutoff();

  const initialCells = generateGrid(
    { lat: params.lat, lng: params.lng, radius: params.radius },
    params.cellRadius,
  );

  const alreadySwept =
    cutoff == null
      ? new Set<string>()
      : await sweptSince(
          initialCells.flatMap((cell) =>
            params.categories.map((slug) => cellKey(cell, slug)),
          ),
          cutoff,
        );

  const queue: WorkItem[] = [];
  for (const cell of initialCells) {
    for (const categorySlug of params.categories) {
      if (alreadySwept.has(cellKey(cell, categorySlug))) {
        counters.skipped++;
        continue;
      }
      queue.push({ cell, categorySlug });
    }
  }

  let cellsTotal = queue.length;
  let stoppedReason: string | null = null;

  jobLog.info("job.planned", {
    cells: initialCells.length,
    searches: initialCells.length * params.categories.length,
    skippedAsCovered: counters.skipped,
    queued: queue.length,
    coverageWindowUntil: cutoff?.toISOString() ?? null,
    savedUsd:
      Math.round(counters.skipped * COST_PER_REQUEST_USD * 1000) / 1000,
  });

  if (queue.length === 0) {
    jobLog.info("job.nothing_to_do", {
      reason: "every search was already covered inside the coverage window",
    });
  }

  const syncProgress = async () => {
    await db
      .update(scrapeJobs)
      .set({
        cellsTotal,
        cellsDone: counters.cellsDone,
        requestsMade: counters.requests,
        estimatedCostUsd:
          Math.round(counters.requests * COST_PER_REQUEST_USD * 1000) / 1000,
        resultsSeen: counters.results,
        businessesFound: counters.businesses,
        newBusinesses: counters.newBusinesses,
        leadsCreated: counters.leads,
        saturatedCells: counters.saturated,
        cellsSkipped: counters.skipped,
      })
      .where(eq(scrapeJobs.id, jobId));
  };

  await db
    .update(scrapeJobs)
    .set({ status: "running", startedAt: new Date(), cellsTotal })
    .where(eq(scrapeJobs.id, jobId));

  const budgetReached = () => counters.requests >= params.maxRequests;

  const cancelledByUser = async () => {
    const [row] = await db
      .select({ cancelRequested: scrapeJobs.cancelRequested })
      .from(scrapeJobs)
      .where(eq(scrapeJobs.id, jobId))
      .limit(1);
    return Boolean(row?.cancelRequested);
  };

  async function processItem(item: WorkItem): Promise<void> {
    const category = getCategory(item.categorySlug);
    if (!category) {
      // Shouldn't happen — resolveJob filters unknown slugs — but silently
      // dropping a cell would look like coverage we never actually bought.
      jobLog.warn("cell.unknown_category", { categorySlug: item.categorySlug });
      return;
    }

    const cellLog = jobLog.child({
      category: item.categorySlug,
      lat: Number(item.cell.lat.toFixed(5)),
      lng: Number(item.cell.lng.toFixed(5)),
      radius: Math.round(item.cell.radius),
      depth: item.cell.depth,
    });

    const useType =
      category.includedType && !droppedTypes.has(category.includedType)
        ? category.includedType
        : undefined;

    const request = {
      textQuery: category.textQuery,
      includedType: useType,
      circle: { lat: item.cell.lat, lng: item.cell.lng, radius: item.cell.radius },
    };

    // Paging is the other place requests get spent, so the cap is checked
    // between pages too — not only between cells.
    const pageOptions = {
      signal: controller.signal,
      onRequest: () => {
        counters.requests++;
      },
      shouldContinue: () => !budgetReached() && !pastDeadline(),
    };

    let result;
    try {
      result = await searchTextAllPages(request, pageOptions);
    } catch (error) {
      // An `includedType` Google doesn't recognise fails the call with a 400.
      // Retry the same cell as a plain text search instead of losing it.
      if (error instanceof PlacesApiError && error.isInvalidArgument && useType) {
        droppedTypes.add(useType);
        cellLog.warn("cell.type_rejected", {
          includedType: useType,
          note: "Google rejected the type; retrying as a plain text search and dropping it for the rest of the job",
        });
        result = await searchTextAllPages(
          { ...request, includedType: undefined },
          pageOptions,
        );
      } else {
        cellLog.error(
          "cell.failed",
          { requestsSoFar: counters.requests, ...billedThisProcess() },
          error,
        );
        throw error;
      }
    }

    const found = result.places ?? [];
    for (const place of found) {
      counters.results++;
      if (!seenPlaceIds.has(place.id)) {
        seenPlaceIds.add(place.id);
        counters.businesses++;
      }
    }

    const written = await upsertPlaces(
      found,
      item.categorySlug,
      params.areaLabel,
      domainLists,
    );
    counters.newBusinesses += written.newBusinesses;
    counters.leads += written.leadsCreated;

    // This search is now paid for; remember it so a re-run inside the coverage
    // window doesn't buy it again.
    //
    // Two kinds of search are deliberately *not* recorded, both for the same
    // reason: we know their coverage is incomplete, and marking incomplete
    // ground as covered would hide it until the window expired.
    //
    //   - cut short by the budget cap or time limit: pages we never fetched
    //   - saturated with no depth left: results Google truncated at 60
    //
    // The second matters for re-runs. Recording it would mean "re-run deeper"
    // skips the very cells that needed going deeper, and nothing would change.
    const incompleteAtMaxDepth = result.saturated && item.cell.depth >= params.maxDepth;

    if (!result.stopped && !incompleteAtMaxDepth) {
      await recordSweep(item.cell, item.categorySlug, {
        placesFound: result.places?.length ?? 0,
        saturated: result.saturated,
      });
    } else {
      if (result.stopped) counters.budgetTruncated++;
      cellLog.warn("cell.not_covered", {
        reason: result.stopped
          ? "budget cap or time limit cut it short"
          : "truncated at 60 with no depth left",
        note: "not recorded as covered, so a later run can still reach it",
      });
    }

    cellLog.debug("cell.done", {
      requests: result.requests,
      places: result.places?.length ?? 0,
      saturated: result.saturated,
      requestsSoFar: counters.requests,
      costSoFarUsd:
        Math.round(counters.requests * COST_PER_REQUEST_USD * 1000) / 1000,
    });

    // A full result set means Google truncated the answer: split the cell and
    // look again at higher resolution.
    if (result.saturated) {
      if (item.cell.depth < params.maxDepth) {
        const children = subdivide(item.cell);
        // Children are new cells, so they need their own coverage check — a
        // previous run at the same depth will already have swept them.
        const childrenSwept =
          cutoff == null
            ? new Set<string>()
            : await sweptSince(
                children.map((child) => cellKey(child, item.categorySlug)),
                cutoff,
              );

        for (const child of children) {
          if (childrenSwept.has(cellKey(child, item.categorySlug))) {
            counters.skipped++;
            continue;
          }
          queue.push({ cell: child, categorySlug: item.categorySlug });
          cellsTotal++;
        }
        cellLog.debug("cell.subdivided", {
          queued: children.length - childrenSwept.size,
          skippedAsCovered: childrenSwept.size,
        });
      } else {
        counters.saturated++;
        cellLog.warn("cell.saturated_at_max_depth", {
          maxDepth: params.maxDepth,
          note: "hit the 60-result cap with no depth left; coverage here is incomplete",
        });
      }
    }

    counters.cellsDone++;
  }

  try {
    // Workers pull from a queue that grows as cells subdivide.
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      for (;;) {
        if (controller.signal.aborted) return;

        if (budgetReached()) {
          // Two ways the cap can leave ground unsearched, and both have to be
          // reported. Cells still queued is the obvious one. The subtler one:
          // workers claim their cell before any request returns, so a cell can
          // be claimed and then abandoned mid-search — the queue is empty, yet
          // the area was never covered. Only landing on the cap with nothing
          // queued *and* nothing truncated is a genuinely clean finish.
          if ((queue.length > 0 || counters.budgetTruncated > 0) && !stoppedReason) {
            stoppedReason = `Stopped at the ${params.maxRequests}-request budget cap.`;
            jobLog.warn("job.budget_reached", {
              maxRequests: params.maxRequests,
              requestsMade: counters.requests,
              // Several workers can be mid-flight, so the cap can be crossed by
              // a few requests. Logged so the overshoot is visible, not a
              // mystery on the bill.
              overshoot: counters.requests - params.maxRequests,
              queueRemaining: queue.length,
              costUsd:
                Math.round(counters.requests * COST_PER_REQUEST_USD * 1000) / 1000,
            });
          }
          // Deliberately *not* aborting: requests already in flight have been
          // billed whether or not we read the answer, so let them land and keep
          // what they found. `shouldContinue` stops them fetching more pages,
          // and this loop stops starting new searches.
          return;
        }

        if (pastDeadline()) {
          // Same shape as the budget stop: in-flight searches land and are
          // kept, nothing new starts. Unfinished searches were never recorded
          // as covered, so a re-run picks up exactly what is left.
          if (!stoppedReason) {
            stoppedReason = `Stopped at the ${Math.round(
              (options.timeLimitMs ?? 0) / 60_000,
            )}-minute time limit.`;
            jobLog.warn("job.time_limit_reached", {
              timeLimitMs: options.timeLimitMs,
              requestsMade: counters.requests,
              queueRemaining: queue.length,
            });
          }
          return;
        }

        if (await cancelledByUser()) {
          if (!stoppedReason) {
            stoppedReason = "Cancelled.";
            jobLog.info("job.cancelled", {
              requestsMade: counters.requests,
              queueRemaining: queue.length,
            });
          }
          controller.abort();
          return;
        }

        const item = queue.shift();
        if (!item) return;

        await processItem(item);
        await syncProgress();
      }
    });

    await Promise.all(workers);
    await finish();
  } catch (error) {
    // An abort we asked for is not a failure: the job did what it was told and
    // kept everything it found. Only an unexpected error is a failure — calling
    // a budget stop "failed" sends the user hunting for a bug that isn't there.
    if (controller.signal.aborted && stoppedReason) {
      await finish();
      return;
    }

    await syncProgress();
    await db
      .update(scrapeJobs)
      .set({
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
        finishedAt: new Date(),
      })
      .where(eq(scrapeJobs.id, jobId));

    // Spend is reported on failure too — a job that dies halfway has still been
    // billed for everything it sent, and that is the number worth knowing.
    jobLog.error(
      "job.failed",
      {
        ms: jobLog.since(),
        requests: counters.requests,
        costUsd: Math.round(counters.requests * COST_PER_REQUEST_USD * 1000) / 1000,
        searchesDone: counters.cellsDone,
        queueRemaining: queue.length,
        businesses: counters.businesses,
        leads: counters.leads,
      },
      error,
    );
  } finally {
    running.delete(jobId);
  }

  async function finish() {
    const cancelled = stoppedReason === "Cancelled.";
    await syncProgress();
    await db
      .update(scrapeJobs)
      .set({
        status: cancelled ? "cancelled" : "completed",
        stoppedReason,
        finishedAt: new Date(),
      })
      .where(eq(scrapeJobs.id, jobId));

    // The line to read first when asking "what did that scrape actually do?".
    jobLog.info("job.finished", {
      status: cancelled ? "cancelled" : "completed",
      stoppedReason,
      ms: jobLog.since(),
      requests: counters.requests,
      costUsd: Math.round(counters.requests * COST_PER_REQUEST_USD * 1000) / 1000,
      searchesDone: counters.cellsDone,
      searchesSkipped: counters.skipped,
      results: counters.results,
      businesses: counters.businesses,
      newBusinesses: counters.newBusinesses,
      leads: counters.leads,
      saturatedAtMaxDepth: counters.saturated,
      resultsPerRequest:
        counters.requests > 0
          ? Math.round((counters.results / counters.requests) * 10) / 10
          : 0,
      droppedTypes: [...droppedTypes],
    });
  }
}
