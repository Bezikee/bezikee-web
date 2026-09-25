import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { logger } from "@admin/lib/log";
import * as schema from "./schema";

export * from "./schema";

const log = logger("db");

/**
 * Direct Postgres access for the admin panel and its API.
 *
 * In production this is a managed Postgres (Neon) reached from Vercel
 * functions. Use its *pooled* connection string: every function instance opens
 * its own pool, and the pooler is what keeps a burst of them from exhausting the
 * server's connection limit.
 */

export const DATABASE_URL = process.env.DATABASE_URL ?? "";

function createDb() {
  if (!DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Point it at Postgres, e.g. postgres://user:pass@localhost:5432/bezikee_admin",
    );
  }

  const client = postgres(DATABASE_URL, {
    // Per function instance, and there can be many. A scrape runs four
    // searches at once, so this still leaves it headroom.
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idle_timeout: 30,
    connect_timeout: 15,
    // Transaction-mode poolers (Neon's pooled endpoint, PgBouncer) hand each
    // statement to whichever server connection is free, so a statement prepared
    // on one may not exist on the next.
    prepare: false,
    // Managed Postgres usually presents a self-signed certificate. `prefer`
    // encrypts when the server offers it without failing when it doesn't.
    ssl: sslMode(),
    onnotice: () => {},
  });

  log.debug("connected", { host: safeHost(DATABASE_URL) });

  return { db: drizzle(client, { schema }), client };
}

function sslMode(): "require" | "prefer" | false {
  const configured = process.env.DATABASE_SSL;
  if (configured === "require") return "require";
  if (configured === "disable") return false;
  // A local database speaks plaintext; anything else is over a network.
  return isLocalDatabase(DATABASE_URL) ? false : "prefer";
}

/** Is this connection string for a database on this machine? */
export function isLocalDatabase(url: string): boolean {
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Host and database only — never the credentials. */
export function safeHost(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}:${parsed.port || 5432}${parsed.pathname}`;
  } catch {
    return "(unparseable DATABASE_URL)";
  }
}

type Handle = ReturnType<typeof createDb>;
type Db = Handle["db"];

// Next's dev server re-evaluates modules on hot reload; without this the process
// would open a fresh pool on every edit until the server ran out of connections.
const globalForDb = globalThis as unknown as { __bezikeeAdminDb?: Handle };

const handle = (): Handle => (globalForDb.__bezikeeAdminDb ??= createDb());

/**
 * The Drizzle instance, created on first use rather than on import.
 *
 * `next build` imports every route while collecting page data, and this module
 * sits under all the admin ones. Connecting eagerly would make a missing
 * DATABASE_URL fail the build — taking the public site's deploy down with it
 * over a panel only we use. Lazily, the site builds and deploys regardless, and
 * the admin panel reports the missing variable when someone opens it.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, property) {
    const real = handle().db;
    const value = Reflect.get(real, property, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
