"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { LEAD_STATUSES, type LeadStatus } from "@admin/lib/db/schema";
import { languageByCode } from "@admin/lib/leads/language";
import { formatQuote, missingVariables, renderTemplate } from "@admin/lib/leads/outreach";

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  qualified: "Qualified",
  demo_built: "Demo built",
  contacted: "Contacted",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
  discarded: "Discarded",
};

export type LeadDetailProps = {
  leadId: number;
  status: LeadStatus;
  quoteAmount: number | null;
  currency: string;
  demoUrl: string | null;
  notes: string | null;
  businessName: string;
  categoryLabel: string;
  areaName: string | null;
  defaultQuote: number;
  email: {
    to: string | null;
    /** Null when no email was written for this business; the fallback is used. */
    subject: string | null;
    body: string | null;
    language: string | null;
    sentAt: string | null;
  };
  /** The default template from Settings, for leads without their own email. */
  fallback: { subject: string; body: string };
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-line-strong"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export function LeadDetail(props: LeadDetailProps) {
  const router = useRouter();

  const [status, setStatus] = useState<LeadStatus>(props.status);
  // Blank means "the price from Settings". Only a number typed here is saved on
  // the lead, so changing the price in Settings reaches every lead that hasn't
  // been given one of its own.
  const [quote, setQuote] = useState<string>(
    props.quoteAmount != null ? String(props.quoteAmount) : "",
  );
  const effectiveQuote = quote === "" ? props.defaultQuote : Number(quote);
  const settingsPrice = formatQuote(props.defaultQuote, props.currency, props.email.language ?? "es");
  const [demoUrl, setDemoUrl] = useState(props.demoUrl ?? "");
  const [notes, setNotes] = useState(props.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tailored = props.email.body != null;
  const language = languageByCode(props.email.language);
  const [to, setTo] = useState(props.email.to ?? "");
  const [subject, setSubject] = useState(props.email.subject ?? props.fallback.subject);
  const [body, setBody] = useState(props.email.body ?? props.fallback.body);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentAt, setSentAt] = useState(props.email.sentAt);
  const [emailNote, setEmailNote] = useState<{ tone: "good" | "bad"; text: string } | null>(null);

  const vars = useMemo(
    () => ({
      business_name: props.businessName,
      category: props.categoryLabel,
      area: props.areaName ?? "",
      demo_url: demoUrl,
      quote: formatQuote(effectiveQuote, props.currency, props.email.language ?? "es"),
    }),
    [props.businessName, props.categoryLabel, props.areaName, props.currency, props.email.language, demoUrl, effectiveQuote],
  );

  const previewSubject = renderTemplate(subject, vars);
  const previewBody = renderTemplate(body, vars);
  const missing = [...new Set([...missingVariables(subject, vars), ...missingVariables(body, vars)])];
  const validTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim());
  const dirty = demoUrl !== (props.demoUrl ?? "") || quote !== String(props.quoteAmount ?? "");
  const blocker = !validTo
    ? "Add the owner's email address."
    : missing.length > 0
      ? `Still empty: ${missing.map((m) => `{{${m}}}`).join(", ")}.`
      : dirty
        ? "Save the deal first, so the email uses the demo URL and quote shown."
        : null;

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${props.leadId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setSaving(false);
    }
  }

  function save() {
    void patch({
      status,
      quoteAmount: quote === "" ? null : Number(quote),
      demoUrl: demoUrl || null,
      notes,
    });
  }

  async function saveDraft() {
    setEmailNote(null);
    const ok = await patch({ contactEmail: to.trim() || null, emailSubject: subject, emailBody: body });
    if (ok) setEmailNote({ tone: "good", text: "Draft saved." });
  }

  async function send() {
    setSending(true);
    setEmailNote(null);
    try {
      const res = await fetch(`/api/admin/leads/${props.leadId}/email/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim(), subject, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not send");
      setSentAt(data.sentAt);
      if (status === "new" || status === "qualified" || status === "demo_built") setStatus("contacted");
      setEmailNote({ tone: "good", text: `Sent to ${to.trim()}.` });
      router.refresh();
    } catch (err) {
      setEmailNote({ tone: "bad", text: err instanceof Error ? err.message : String(err) });
    } finally {
      setSending(false);
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-line bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Deal</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-ink-muted" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
            >
              {LEAD_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-ink-muted" htmlFor="quote">
              Price ({props.currency})
            </label>
            <input
              id="quote"
              type="number"
              min={0}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder={String(props.defaultQuote)}
              className="tnum mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-ink-muted">
              {quote === ""
                ? `The Settings price, ${settingsPrice}.`
                : `Just this lead. Clear it to use ${settingsPrice}.`}
            </p>
          </div>

          <div>
            <label className="block text-xs text-ink-muted" htmlFor="demo">
              Demo site URL
            </label>
            <input
              id="demo"
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://…"
              className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-ink-muted" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Who you spoke to, what they said, when to follow up…"
            className="mt-1 w-full resize-y rounded-lg border border-line bg-card px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved ? <span className="text-xs text-good">Saved</span> : null}
          {error ? <span className="text-xs text-critical">{error}</span> : null}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-card p-5">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight">Pitch email</h2>
          <span className="rounded-full bg-card-muted px-2 py-0.5 text-xs text-ink-secondary">
            {tailored
              ? `Written for this business${language ? ` · ${language.name}` : ""}`
              : "Default template"}
          </span>
        </div>
        <p className="mb-4 text-xs text-ink-muted">
          {tailored
            ? "Written by Claude alongside the demo site. Edit anything before sending."
            : "No email has been written for this business yet. Generating its demo site writes one; until then this is the template from Settings."}{" "}
          Sent as Bezikee, and replies go to wearebezikee@gmail.com.
        </p>

        {sentAt ? (
          <p className="mb-4 rounded-lg bg-card-muted px-3 py-2 text-xs text-good">
            Sent{" "}
            {new Date(sentAt).toLocaleString("es-ES", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {props.email.to ? ` to ${props.email.to}` : ""}.
          </p>
        ) : null}

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-ink-muted" htmlFor="email-to">
              To
            </label>
            <input
              id="email-to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="owner@example.com"
              className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-ink-muted">
              Google doesn&apos;t list owners&apos; emails. Look on their Instagram, Facebook or
              booking page.
            </p>
          </div>

          <div>
            <label className="block text-xs text-ink-muted" htmlFor="email-subject">
              Subject
            </label>
            <input
              id="email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-ink-muted" htmlFor="email-body">
              Body
            </label>
            <textarea
              id="email-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="mt-1 w-full resize-y rounded-lg border border-line bg-card px-3 py-2 font-mono text-xs leading-relaxed"
            />
            <p className="mt-1 text-xs text-ink-muted">
              <code className="font-mono">{"{{demo_url}}"}</code> becomes the demo link and{" "}
              <code className="font-mono">{"{{quote}}"}</code> the price above.
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-ink-secondary">What they&apos;ll receive</span>
              <CopyButton text={`${previewSubject}\n\n${previewBody}`} label="Copy" />
            </div>
            <p className="mb-1 text-xs text-ink-muted">Subject: {previewSubject}</p>
            <pre className="whitespace-pre-wrap rounded-lg bg-card-muted px-3 py-2.5 text-xs leading-relaxed text-ink-secondary">
              {previewBody}
            </pre>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {confirming ? (
            <>
              <button
                type="button"
                onClick={send}
                disabled={sending}
                className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {sending ? "Sending…" : `Send to ${to.trim()}`}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={sending}
                className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium transition-colors hover:border-line-strong"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={blocker !== null}
                title={blocker ?? undefined}
                className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {sentAt ? "Send again" : "Send email"}
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={saving}
                className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium transition-colors hover:border-line-strong disabled:opacity-60"
              >
                Save draft
              </button>
            </>
          )}
          {blocker && !confirming ? <span className="text-xs text-serious">{blocker}</span> : null}
          {emailNote ? (
            <span className={`text-xs ${emailNote.tone === "good" ? "text-good" : "text-critical"}`}>
              {emailNote.text}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
