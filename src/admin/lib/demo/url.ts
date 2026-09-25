/**
 * Where demo sites are published: https://demo.bezikee.com/<uuid>.
 *
 * The UUID is the whole of the access control. Anyone holding the link can see
 * the page and nobody can find it without one, which is what makes it safe to
 * paste into a WhatsApp message to a business owner. That only holds while ids
 * are random v4 UUIDs — 122 bits nobody can guess or enumerate — so this module
 * accepts nothing else.
 *
 * Pure and dependency-free: `proxy.ts` imports it to route the demo host.
 */

/** No trailing slash. `http://demo.localhost:3000` in development. */
export function demoBaseUrl(): string {
  return (process.env.DEMO_BASE_URL?.trim() || "https://demo.bezikee.com").replace(/\/+$/, "");
}

/** `demo.bezikee.com`, or `demo.localhost:3000` locally — the Host header to route on. */
export function demoHost(): string {
  return new URL(demoBaseUrl()).host.toLowerCase();
}

/** Canonical, lowercase v4 UUID. The version and variant nibbles are checked too. */
const DEMO_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isDemoId(value: string): boolean {
  return DEMO_ID.test(value);
}

/** The shareable link for one demo. */
export function demoUrl(id: string): string {
  return `${demoBaseUrl()}/${id}`;
}
