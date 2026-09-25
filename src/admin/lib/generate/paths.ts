import os from "node:os";
import path from "node:path";

/**
 * Where a site build does its work, and the only names allowed there.
 *
 * The agent is given write access to one of these directories, so a slug that
 * escaped the root would be a way to write anywhere on the machine. Slugs are
 * built here and validated here, and nothing else constructs one.
 *
 * Only the build lives on disk. The finished page is published to the database
 * (see src/admin/lib/demo), because the site that serves it runs on Vercel.
 */

/**
 * Scratch space for a build: the real Google photos, the JSON the agent reads,
 * and the directory it actually runs in.
 *
 * Outside the repository, and outside the home directory's project tree, on
 * purpose. The agent is given `Read` and a permission mode that does not prompt
 * for reads, so "which directory is it in" is not a boundary — only an explicit
 * deny list is (see `agent.ts`). Putting the sandbox somewhere with nothing
 * sensitive near it means the deny list is a second line rather than the only
 * one.
 *
 * Both are Google's data. The photos carry Places licensing and attribution
 * terms and the JSON carries customers' reviews verbatim; neither is ours to
 * publish. Only `index.html` leaves this directory, and it is checked first.
 */
export const WORK_ROOT =
  process.env.SITE_WORK_DIR ?? path.join(os.tmpdir(), "bezikee-site-builds");

/** Anything outside this set is stripped, so a slug is always path-safe. */
const SLUG_SAFE = /[^a-z0-9]+/g;

/**
 * `Peluquería Sin Web` + 823 → `peluqueria-sin-web-823`.
 *
 * The id suffix is not decoration: two businesses on the same street can share
 * a name, and without it the second would silently overwrite the first's site.
 */
export function siteSlug(name: string, businessId: number): string {
  const base = name
    .normalize("NFD")
    // Strip accents rather than dropping the letters they sit on, so
    // "Peluquería" becomes "peluqueria" and not "peluquera". NFD splits an
    // accented letter into base + combining mark; this removes the marks.
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(SLUG_SAFE, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");

  // A name of nothing but punctuation or non-Latin script leaves base empty;
  // the id alone is still a valid, unique directory name.
  return base ? `${base}-${businessId}` : `business-${businessId}`;
}

/** Exactly what `siteSlug` produces, and nothing else. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}

/**
 * Build scratch space for one business, or null if the slug is not one we made.
 *
 * The shape check alone would be enough — `..` cannot survive it — but the
 * containment check is what this function actually promises, so it is asserted
 * rather than reasoned about.
 */
export function workDir(slug: string): string | null {
  if (!isValidSlug(slug)) return null;

  // `WORK_ROOT` is configurable, so the build's file tracer can't tell where
  // this resolves and would defensively pull the whole project into the
  // server bundle. These are runtime paths, never build inputs.
  const root = path.resolve(/*turbopackIgnore: true*/ WORK_ROOT);
  const resolved = path.resolve(/*turbopackIgnore: true*/ WORK_ROOT, slug);
  if (resolved !== path.join(/*turbopackIgnore: true*/ root, slug)) return null;
  if (!resolved.startsWith(root + path.sep)) return null;

  return resolved;
}

/** The page itself. Every build writes this one file. */
export const INDEX_FILE = "index.html";
