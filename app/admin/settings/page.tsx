import { and, eq, inArray, sql } from "drizzle-orm";

import { SettingsForm } from "@admin/components/settings-form";
import { PageHeader } from "@admin/components/ui";
import { db } from "@admin/lib/db";
import { businesses } from "@admin/lib/db/schema";
import { hasApiKey } from "@admin/lib/places/client";
import { getSettings } from "@admin/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const keyPresent = hasApiKey();

  const [settings, [uncheckedRow]] = await Promise.all([
    getSettings(),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(businesses)
      .where(
        and(
          inArray(businesses.websiteClass, ["has_website", "builder_subdomain"]),
          eq(businesses.websiteStatus, "unchecked"),
        ),
      ),
  ]);
  const uncheckedCount = uncheckedRow?.count ?? 0;

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Your details, the messages you send, and how a website gets judged."
      />

      <div className="mb-5 rounded-xl border border-line bg-card p-5">
        <h2 className="text-sm font-semibold tracking-tight">Google Places API key</h2>
        {keyPresent ? (
          <p className="mt-1 text-xs text-ink-secondary">
            <span className="font-medium text-good">Configured.</span> Read from{" "}
            <code className="font-mono">GOOGLE_MAPS_API_KEY</code>. The key itself is never
            shown here or sent to the browser.
          </p>
        ) : (
          <p className="mt-1 text-xs text-ink-secondary">
            <span className="font-medium text-serious">Not set.</span> Add{" "}
            <code className="font-mono">GOOGLE_MAPS_API_KEY=…</code> to the Vercel
            project&apos;s environment variables (or{" "}
            <code className="font-mono">.env.local</code> locally) and redeploy.
            docs/ADMIN.md walks through creating one.
          </p>
        )}
      </div>

      <SettingsForm initial={settings} uncheckedCount={uncheckedCount} />
    </>
  );
}
