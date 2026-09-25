import "server-only";

import { randomUUID } from "node:crypto";

import { eq, sql } from "drizzle-orm";

import { db } from "@admin/lib/db";
import { demoSites } from "@admin/lib/db/schema";
import { isDemoId } from "./url";

/**
 * Published demo pages, kept in Postgres rather than on disk.
 *
 * The site runs on Vercel, where the filesystem is neither shared nor kept, so a
 * page written to disk by one invocation would be invisible to the next. In the
 * database a page generated on a laptop is live on demo.bezikee.com the moment
 * the build finishes, with no commit and no redeploy. Each page is a single
 * self-contained HTML file of 20–40KB, which is what makes this reasonable.
 */

/**
 * Publish a page for a business, returning its public id.
 *
 * One demo per business, and the id survives rebuilds: a link already sent to
 * an owner keeps working and shows the latest version rather than going dead.
 */
export async function publishDemo(
  businessId: number,
  buildId: number | null,
  html: string,
): Promise<string> {
  const [row] = await db
    .insert(demoSites)
    .values({ id: randomUUID(), businessId, buildId, html })
    .onConflictDoUpdate({
      target: demoSites.businessId,
      set: { html, buildId, updatedAt: sql`now()` },
    })
    .returning({ id: demoSites.id });

  return row.id;
}

/** The page for a public id, or null. Malformed ids never reach the database. */
export async function findDemoHtml(id: string): Promise<string | null> {
  if (!isDemoId(id)) return null;

  const [row] = await db
    .select({ html: demoSites.html })
    .from(demoSites)
    .where(eq(demoSites.id, id))
    .limit(1);

  return row?.html ?? null;
}

/** The public id of a business's demo, if it has one. */
export async function demoIdFor(businessId: number): Promise<string | null> {
  const [row] = await db
    .select({ id: demoSites.id })
    .from(demoSites)
    .where(eq(demoSites.businessId, businessId))
    .limit(1);

  return row?.id ?? null;
}
