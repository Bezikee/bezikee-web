/**
 * Bring the admin database schema up to date.
 *
 *   npm run db:migrate
 *
 * Also runs as the first step of `vercel-build`, so a deploy applies its own
 * migrations before the new code serves a request. On the VPS this happened at
 * container start; on Vercel there is no "start" — every cold start would pay
 * for it, and the marketing pages would be the ones paying — so it moved to the
 * build, which runs exactly once per deploy.
 *
 * With no DATABASE_URL it skips rather than failing, so the public site can
 * still deploy before the admin database exists. The admin panel then reports
 * the missing database itself.
 */
import "./load-env.mjs";

import path from "node:path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

/**
 * Postgres advisory lock, held while migrating. Two deploys building at once
 * (a push landing while another is still building) would otherwise both run
 * Drizzle's migrator, and the loser fails on "relation already exists". The
 * number is arbitrary but must be stable; it is the lock's identity.
 */
const MIGRATION_LOCK_ID = 4_713_002;

/** Is this connection string for a database on this machine? */
function isLocal(url: string): boolean {
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

const url = process.env.DATABASE_URL;

if (!url) {
  console.warn("[db:migrate] DATABASE_URL is not set — skipping migrations. The admin panel needs it.");
  process.exit(0);
}

const client = postgres(url, {
  max: 1,
  onnotice: () => {},
  ssl: isLocal(url) ? false : "require",
});

const startedAt = Date.now();

try {
  await client`select pg_advisory_lock(${MIGRATION_LOCK_ID})`;
  await migrate(drizzle(client), {
    migrationsFolder: path.join(import.meta.dirname, "..", "drizzle"),
  });
  console.log(`[db:migrate] Up to date (${Date.now() - startedAt}ms).`);
} catch (error) {
  // Failing the build keeps the previous deployment serving, which is far better
  // than new code running against a schema it does not understand.
  console.error("[db:migrate] Migrations failed.", error);
  process.exitCode = 1;
} finally {
  await client`select pg_advisory_unlock(${MIGRATION_LOCK_ID})`.catch(() => {});
  await client.end();
}
