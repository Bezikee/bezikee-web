import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@admin/lib/db";
import { settings } from "@admin/lib/db/schema";
import { DEFAULT_EMAIL_SUBJECT, DEFAULT_EMAIL_TEMPLATE } from "@admin/lib/leads/outreach";

export type AppSettings = {
  defaultQuote: number;
  currency: string;
  /** The fallback pitch email, for leads without one written for them. */
  emailSubject: string;
  emailTemplate: string;
  /** Extra domains to treat as "not a real website", one per line. */
  extraAggregatorDomains: string;
  /**
   * How long a cell × category search counts as already covered. Re-running an
   * area inside this window skips those searches instead of paying for them
   * again. 0 disables the cache and always sweeps everything.
   */
  coverageTtlDays: number;
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultQuote: 500,
  currency: "EUR",
  emailSubject: DEFAULT_EMAIL_SUBJECT,
  emailTemplate: DEFAULT_EMAIL_TEMPLATE,
  extraAggregatorDomains: "",
  coverageTtlDays: 30,
};

/**
 * A saved template from before outreach went out as Bezikee still signs with
 * {{my_name}} / {{my_phone}}, which no longer exist: it would go out with the
 * slots showing. Treat it as unset so the Bezikee default takes over.
 */
function current(template: string | undefined): string | undefined {
  return template && !/\{\{\s*my_(name|phone)\s*\}\}/.test(template) ? template : undefined;
}

export async function getSettings(): Promise<AppSettings> {
  const rows = await db.select().from(settings);
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    defaultQuote: stored.defaultQuote
      ? Number(stored.defaultQuote)
      : DEFAULT_SETTINGS.defaultQuote,
    currency: stored.currency ?? DEFAULT_SETTINGS.currency,
    emailSubject: current(stored.emailSubject) ?? DEFAULT_SETTINGS.emailSubject,
    emailTemplate: current(stored.emailTemplate) ?? DEFAULT_SETTINGS.emailTemplate,
    extraAggregatorDomains:
      stored.extraAggregatorDomains ?? DEFAULT_SETTINGS.extraAggregatorDomains,
    coverageTtlDays: stored.coverageTtlDays
      ? Number(stored.coverageTtlDays)
      : DEFAULT_SETTINGS.coverageTtlDays,
  };
}

/**
 * Searches swept on or after this instant count as already covered. `null` when
 * the cache is switched off, which means sweep everything.
 */
export async function coverageCutoff(): Promise<Date | null> {
  const { coverageTtlDays: days } = await getSettings();
  if (!Number.isFinite(days) || days <= 0) return null;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function saveSettings(
  values: Partial<Record<keyof AppSettings, string>>,
): Promise<void> {
  for (const [key, value] of Object.entries(values)) {
    if (value == null) continue;
    await db
      .insert(settings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() },
      });
  }
}

/** User-added domains, merged into the classifier's aggregator list. */
export async function extraDomains(): Promise<string[]> {
  const { extraAggregatorDomains } = await getSettings();
  return extraAggregatorDomains
    .split(/[\s,]+/)
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export async function clearSetting(key: keyof AppSettings): Promise<void> {
  await db.delete(settings).where(eq(settings.key, key));
}
