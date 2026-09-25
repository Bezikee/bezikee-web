import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@admin/lib/db";
import { demoIdFor } from "@admin/lib/demo/store";
import { demoUrl } from "@admin/lib/demo/url";
import { leads, siteBuilds } from "@admin/lib/db/schema";
import { isAgentAvailable } from "@admin/lib/generate/agent";
import { isBuildRunning, startSiteBuild } from "@admin/lib/generate/runner";
import { logger } from "@admin/lib/log";
import { hasApiKey } from "@admin/lib/places/client";
import { siteBuildCostUsd } from "@admin/lib/places/pricing";

const log = logger("api.site");

/** The lead's business, or null if the id isn't one. */
async function businessFor(leadId: number) {
  const [row] = await db
    .select({ businessId: leads.businessId })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);
  return row?.businessId ?? null;
}

/** Latest build for a business, for polling and for showing an existing site. */
async function latestBuild(businessId: number) {
  const [row] = await db
    .select({
      id: siteBuilds.id,
      slug: siteBuilds.slug,
      status: siteBuilds.status,
      photoCount: siteBuilds.photoCount,
      costUsd: siteBuilds.costUsd,
      error: siteBuilds.error,
      createdAt: siteBuilds.createdAt,
      finishedAt: siteBuilds.finishedAt,
    })
    .from(siteBuilds)
    .where(eq(siteBuilds.businessId, businessId))
    .orderBy(desc(siteBuilds.createdAt))
    .limit(1);
  return row ?? null;
}

/** Polled by the lead page while a build runs. */
export async function GET(_request: Request, ctx: RouteContext<"/api/admin/leads/[id]/site">) {
  const { id } = await ctx.params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) {
    return NextResponse.json({ error: "Invalid lead id" }, { status: 400 });
  }

  const businessId = await businessFor(leadId);
  if (businessId == null) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const build = await latestBuild(businessId);
  const demoId = await demoIdFor(businessId);

  return NextResponse.json({
    build,
    // The published page, which outlives any one build: a failed rebuild leaves
    // the previous version up at the same address.
    demoUrl: demoId ? demoUrl(demoId) : null,
    live: isBuildRunning(businessId),
    // Drives whether the button is offered at all. The CLI is on a laptop, not
    // in a Vercel function, so the same page has to render both ways.
    available: (await isAgentAvailable()) && hasApiKey(),
    estimatedCostUsd: siteBuildCostUsd(),
  });
}

/** Start a build. */
export async function POST(request: Request, ctx: RouteContext<"/api/admin/leads/[id]/site">) {
  const { id } = await ctx.params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) {
    return NextResponse.json({ error: "Invalid lead id" }, { status: 400 });
  }

  if (!hasApiKey()) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is not set, so Place Details cannot be fetched." },
      { status: 400 },
    );
  }

  if (!(await isAgentAvailable())) {
    return NextResponse.json(
      {
        error:
          "The `claude` CLI is not available here. Generate sites from `npm run dev` on a machine with Claude Code installed.",
      },
      { status: 400 },
    );
  }

  const businessId = await businessFor(leadId);
  if (businessId == null) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const refresh = body?.refresh === true;

  const started = await startSiteBuild(businessId, { refresh });
  if (!started.ok) {
    return NextResponse.json({ error: started.error }, { status: started.status });
  }

  log.info("build.started", { leadId, businessId, buildId: started.buildId, refresh });

  return NextResponse.json(
    { buildId: started.buildId, slug: started.slug },
    { status: 202 },
  );
}
