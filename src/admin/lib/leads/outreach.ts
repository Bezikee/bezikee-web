/**
 * The pitch email: templating, and turning it into what Resend sends.
 *
 * Each lead normally gets its own email, written by the site agent alongside
 * the demo (see generate/email.ts). The template below is the fallback for
 * leads whose demo predates that, and is editable from Settings.
 *
 * Emails are plain text with `{{placeholder}}` slots. The demo link and the
 * quote stay as slots until the moment of sending, so a rebuilt demo or a
 * changed price never leaves a stale one in a saved draft.
 */

export const TEMPLATE_VARIABLES = [
  "business_name",
  "category",
  "area",
  "demo_url",
  "quote",
] as const;

export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number];
export type TemplateVars = Partial<Record<TemplateVariable, string>>;

export const DEFAULT_EMAIL_SUBJECT = "Una web para {{business_name}}";

export const DEFAULT_EMAIL_TEMPLATE = `Hola,

Os escribimos desde Bezikee. Buscando negocios de la zona en Google Maps dimos con {{business_name}} y vimos que no tenéis web propia, así que quien os busca solo encuentra la ficha.

Nos hemos tomado la libertad de prepararos una, para que veáis cómo quedaría:
{{demo_url}}

Si os gusta, la dejamos publicada con vuestro propio dominio por {{quote}}. Cualquier cambio que queráis hacerle lo vemos juntos.

¿Le echáis un vistazo y nos decís qué os parece?

Un saludo,
Bezikee
bezikee.com`;

/** Replace `{{var}}` slots. Unknown or unset variables are left visible so you can spot gaps before sending. */
export function renderTemplate(template: string, vars: TemplateVars): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => {
    const value = vars[name as TemplateVariable];
    return value != null && value !== "" ? value : match;
  });
}

/** Which placeholders are still unfilled, so the UI can warn before you send. */
export function missingVariables(template: string, vars: TemplateVars): string[] {
  const found = new Set<string>();
  for (const match of template.matchAll(/\{\{\s*(\w+)\s*\}\}/g)) {
    const name = match[1] as TemplateVariable;
    if (!vars[name]) found.add(name);
  }
  return [...found];
}

/**
 * Digits only, with a country code. Spanish nine-digit numbers get the 34
 * country code added; anything already carrying a country code is left alone.
 */
export function normalizePhone(
  phone: string | null | undefined,
  defaultCountryCode = "34",
): string | null {
  if (!phone) return null;

  const hadPlus = phone.trim().startsWith("+");
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  if (hadPlus) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  // Spanish national numbers are nine digits and never start with a zero.
  if (digits.length === 9) return `${defaultCountryCode}${digits}`;

  return digits;
}

/** Number formatting per pitch language, so "500 €" reads right in Spanish and "€500" in English. */
const QUOTE_LOCALE: Record<string, string> = {
  es: "es-ES",
  en: "en-GB",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
  de: "de-DE",
  nl: "nl-NL",
};

export function formatQuote(
  amount: number | null | undefined,
  currency = "EUR",
  language = "es",
): string {
  if (amount == null) return "";
  try {
    return new Intl.NumberFormat(QUOTE_LOCALE[language] ?? "es-ES", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * The HTML part of the email: the plain text, paragraph for paragraph, with
 * links made clickable. Deliberately unstyled. A designed newsletter template
 * is exactly what makes a one-to-one email read as marketing; this should look
 * like something typed into Gmail.
 */
export function emailHtml(text: string): string {
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const html = escapeHtml(block)
        .replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)]/g, (url) => `<a href="${url}">${url}</a>`)
        .replace(/\n/g, "<br>");
      return `<p style="margin:0 0 1em">${html}</p>`;
    })
    .join("\n");

  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#222">\n${paragraphs}\n</div>`;
}
