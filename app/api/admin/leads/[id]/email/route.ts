import { createHash } from "node:crypto";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { getCategory } from "@admin/config/categories";
import { db } from "@admin/lib/db";
import { leadEvents, leads } from "@admin/lib/db/schema";
import { emailHtml, formatQuote, missingVariables, renderTemplate } from "@admin/lib/leads/outreach";
import { getLead } from "@admin/lib/leads/query";
import { logger } from "@admin/lib/log";
import { getSettings } from "@admin/lib/settings";

const log = logger("api.leads.email");

/**
 * Send a lead's pitch email through Resend.
 *
 * It goes out from the bezikee.com domain, which is verified in Resend, with
 * replies directed to the Gmail inbox. It can't be sent *from* the Gmail
 * address: Resend only sends from domains you can verify, and gmail.com isn't
 * one; forging it would also fail Gmail's DMARC policy and land in spam. A copy
 * is BCC'd to the same inbox so every pitch sits in Gmail beside its replies.
 */
const FROM = process.env.OUTREACH_FROM_EMAIL ?? "Bezikee <hello@bezikee.com>";
const REPLY_TO = process.env.OUTREACH_REPLY_TO ?? "wearebezikee@gmail.com";
/** Set OUTREACH_BCC to an empty string to stop the copies. */
const BCC = process.env.OUTREACH_BCC ?? REPLY_TO;

const sendSchema = z.object({
  to: z.email().max(200),
  subject: z.string().trim().min(1).max(300),
  /** The template form, with {{demo_url}} still a slot. Saved as the lead's draft. */
  body: z.string().trim().min(1).max(10_000),
});

export async function POST(request: Request, ctx: RouteContext<"/api/admin/leads/[id]/email">) {
  const { id } = await ctx.params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) {
    return NextResponse.json({ error: "Invalid lead id" }, { status: 400 });
  }

  const parsed = sendSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.path[0] === "to" ? "That email address doesn't look right." : (issue?.message ?? "Invalid request") },
      { status: 400 },
    );
  }
  const { to, subject, body } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set, so email can't be sent." }, { status: 500 });
  }

  const [lead, settings] = await Promise.all([getLead(leadId), getSettings()]);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const [extra] = await db
    .select({ emailLanguage: leads.emailLanguage })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

  if (!lead.demoUrl) {
    return NextResponse.json(
      { error: "This lead has no demo URL yet. The email is nothing without the link." },
      { status: 400 },
    );
  }

  const vars = {
    business_name: lead.name,
    category: getCategory(lead.category ?? "")?.label ?? lead.category ?? "",
    area: lead.areaName ?? "",
    demo_url: lead.demoUrl,
    quote: formatQuote(
      lead.quoteAmount ?? settings.defaultQuote,
      lead.currency || settings.currency,
      extra?.emailLanguage ?? "es",
    ),
  };

  // Never send a visible {{slot}} to a customer.
  const missing = [...new Set([...missingVariables(subject, vars), ...missingVariables(body, vars)])];
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Fill in or remove before sending: ${missing.map((m) => `{{${m}}}`).join(", ")}` },
      { status: 400 },
    );
  }

  const text = renderTemplate(body, vars);
  const finalSubject = renderTemplate(subject, vars);

  // A double click, or a retry after a timeout that actually went through,
  // must not email the owner twice. Resend drops repeats of the same key.
  const idempotencyKey = `pitch-${leadId}-${createHash("sha256")
    .update(`${to}\n${finalSubject}\n${text}`)
    .digest("hex")
    .slice(0, 32)}`;

  try {
    const { data, error } = await new Resend(apiKey).emails.send(
      {
        from: FROM,
        to: [to],
        replyTo: REPLY_TO,
        ...(BCC ? { bcc: [BCC] } : {}),
        subject: finalSubject,
        text,
        html: emailHtml(text),
        // Lets the recipient opt out from their mail client, and mail
        // providers trust senders who offer it.
        headers: { "List-Unsubscribe": `<mailto:${REPLY_TO}?subject=unsubscribe>` },
      },
      { idempotencyKey },
    );

    if (error) {
      log.error("send.rejected", { leadId, error: error.message });
      return NextResponse.json({ error: `Resend refused the email: ${error.message}` }, { status: 502 });
    }

    const sentAt = new Date();
    const advance = lead.status === "new" || lead.status === "qualified" || lead.status === "demo_built";

    await db
      .update(leads)
      .set({
        contactEmail: to,
        emailSubject: subject,
        emailBody: body,
        emailSentAt: sentAt,
        contactedAt: sentAt,
        ...(advance ? { status: "contacted" as const } : {}),
        updatedAt: sentAt,
      })
      .where(eq(leads.id, leadId));

    await db.insert(leadEvents).values([
      ...(advance
        ? [{ leadId, type: "status_change", message: `${lead.status} → contacted` }]
        : []),
      { leadId, type: "outreach_sent", message: `Email sent to ${to}: "${finalSubject}"` },
    ]);

    log.info("send.ok", { leadId, resendId: data?.id });
    return NextResponse.json({ ok: true, sentAt: sentAt.toISOString() });
  } catch (err) {
    log.error("send.threw", { leadId }, err);
    return NextResponse.json({ error: "Could not reach Resend. Nothing was sent." }, { status: 502 });
  }
}
