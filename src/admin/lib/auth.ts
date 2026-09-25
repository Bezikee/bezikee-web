/**
 * A shared-password gate for the admin panel at /admin.
 *
 * There are no user accounts here and there shouldn't be — this is a tool for
 * a small team. One password, held in `ADMIN_PASSWORD`, unlocks the panel and
 * its API. What this protects against is the open internet: bezikee.com is
 * public, and without this the lead database would be too.
 *
 * Deliberately dependency-free and Web Crypto only, so the same code runs in
 * `proxy.ts` (edge runtime) and in a route handler (node).
 */

/**
 * Cookie holding a signed session. HttpOnly, so page scripts can't read it.
 *
 * Host-only (no `Domain` attribute), so it is sent to bezikee.com and never to
 * demo.bezikee.com, where model-written pages are served.
 */
export const SESSION_COOKIE = "bezikee_admin_session";

/** Long enough not to be a nuisance, short enough that a stolen laptop ages out. */
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * The configured password, or null when the panel is unprotected.
 *
 * May be absent in local development: `npm run dev` should not ask you to log
 * in. In production the proxy refuses to serve /admin at all if this is
 * missing, so "unprotected" can never happen by accident on a public URL.
 */
export function accessPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : null;
}

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64url(new Uint8Array(signature));
}

/**
 * Compare without leaking, through timing, how much of the value was right.
 *
 * Length is compared first and separately: it is not secret (the signature is a
 * fixed width), and a mismatch there means there is nothing to compare.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Mint a session token: an expiry, plus a signature over that expiry.
 *
 * Nothing secret is stored in the cookie — only a timestamp the server signed.
 * Because the key is the password itself, changing the password invalidates
 * every outstanding session, which is exactly what you want when someone leaves
 * or the password leaks.
 */
export async function createSessionToken(secret: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [version, expiresAt, signature] = parts;
  if (version !== "v1") return false;

  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  // The signature is checked even for an expired token above only after the
  // cheap checks — an unsigned token can never pass here regardless.
  return timingSafeEqual(await sign(`${version}.${expiresAt}`, secret), signature);
}

/** Direct password check, for the login form and the `x-api-key` header. */
export function passwordMatches(candidate: string | null | undefined): boolean {
  const secret = accessPassword();
  if (!secret || !candidate) return false;
  return timingSafeEqual(candidate, secret);
}

/**
 * Whether the session cookie should be marked `Secure`.
 *
 * On by default in production, because Vercel serves the site over HTTPS. The
 * escape hatch exists for the one failure it would otherwise cause: reaching a
 * deployment over plain HTTP — a raw IP, or a domain before its certificate is
 * issued — where the browser accepts the cookie and then refuses to send it
 * back, so every login bounces straight back to the login page with no error.
 */
function secureCookies(): boolean {
  if (process.env.COOKIE_SECURE === "false") return false;
  if (process.env.COOKIE_SECURE === "true") return true;
  return process.env.NODE_ENV === "production";
}

/** Cookie attributes for a freshly minted session. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: secureCookies(),
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/** Where signing in lands when there is nowhere better to go. */
export const ADMIN_HOME = "/admin/";

/**
 * Where to send the browser after signing in: the requested page if it is in
 * the admin panel, otherwise its home.
 *
 * `next` arrives from the login form, so it is attacker-controllable: a link to
 * /admin/login?next=https://evil.example would otherwise turn our own login
 * page into a credible-looking redirect off-site. Anything outside /admin is
 * refused too — there is no reason to sign in and land on the public site, and
 * a narrow rule is easier to trust than a clever one. `/admin` followed by
 * anything but `/`, `?` or the end (`/adminx`) is not the panel, and a doubled
 * or back slash is how a path gets read as another host.
 */
export function safeNext(value: unknown): string {
  if (typeof value !== "string") return ADMIN_HOME;
  if (!/^\/admin(?:[/?]|$)/.test(value)) return ADMIN_HOME;
  if (value.includes("\\") || value.includes("//")) return ADMIN_HOME;
  return value;
}
