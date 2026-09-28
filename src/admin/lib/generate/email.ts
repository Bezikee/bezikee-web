import type { WebsiteClass } from "@admin/lib/db/schema";
import type { PitchLanguage } from "@admin/lib/leads/language";

/**
 * The pitch email, written by the same agent session that just built the
 * demo page.
 *
 * Same session on purpose: by now it has read the business's reviews, looked
 * at its photos and designed its page, so it can write to this owner about
 * this place instead of filling in a form letter. It writes to a file in the
 * sandbox like everything else, and nothing it writes is sent without a person
 * reading it on the lead page first.
 */

export const EMAIL_FILE = "email.json";

export type PitchEmail = { subject: string; body: string };

/** How the business shows up online today, in the words the email can use. */
const SITUATION: Record<WebsiteClass, string> = {
  none: "They have no website at all. Anyone who looks them up only finds the Google listing.",
  google_site:
    "Their Google listing points at a Google Business Profile site. Google shut those down, so the link goes nowhere.",
  social_only:
    "Their only 'website' is a social media or link-in-bio page. Nothing they own, and nothing that shows up properly on Google.",
  aggregator_only:
    "They only appear on a marketplace or booking platform that takes a commission. No site of their own.",
  builder_subdomain:
    "Their site lives on a free website-builder subdomain. It works, but it isn't theirs and it ranks poorly.",
  dead: "They have a domain, but the site didn't load when we checked it.",
  has_website: "They already have a working website. Pitch the demo as a fresher, better version.",
};

export function emailPrompt(input: {
  language: PitchLanguage;
  websiteClass: WebsiteClass;
  hasQuote: boolean;
}): string {
  const { language } = input;

  return `## One more job: the email that sells this page

The page is done. Now write the email that goes to the owner with the link to
it. It is the first thing they will read from us, so it decides whether the
page gets seen at all.

**Who is writing.** Bezikee, a small web studio. Write as the team, in the
first person plural ("we"). Never use a personal name, never sign as an
individual. Sign off as Bezikee, followed by bezikee.com on its own line.

**Language.** Write the subject and the body in ${language.name}, the language
spoken where this business is. Use the form of address a local would use
writing to a small business like this one. In Spain, for a neighbourhood
business, the informal plural (vosotros) is what people actually write; in
Latin America, use ustedes.

**Their situation.** ${SITUATION[input.websiteClass]}

**What to write.** A short, friendly, plain email from people who actually
looked at their business:

- Open with something specific and true about THIS place that you picked up
  from the data: what customers keep mentioning in the reviews, something about
  the place itself. One sentence, said simply. It shows we looked, and it must
  not read like flattery.
- Say briefly why we're writing: their situation above, framed as what they are
  missing out on, not as a flaw.
- Say we went ahead and built them a page, and give the link as the literal
  placeholder {{demo_url}} on its own line. Use it exactly once. Never invent a
  URL.
- ${
    input.hasQuote
      ? "The offer: if they like it, we publish it with their own domain for {{quote}} (write the placeholder exactly, it becomes the price). Changes are talked through together."
      : "The offer: if they like it, we publish it with their own domain, and changes are talked through together. Don't mention a price."
  } Promise nothing else: no discounts, no deadlines, no SEO results, no
  "free trial".
- End with one easy question that invites a reply, nothing pushy.

**Make it sound like a person wrote it, because a person will send it.**

- 80 to 140 words in the body. Three to five short paragraphs.
- Plain text only. No markdown, no bullet points, no bold, no emojis, no
  headings. At most one exclamation mark in the whole email.
- Vary sentence length. Contractions are fine where the language uses them.
- No em dashes or en dashes at all. Use a comma, a full stop or brackets.
- None of the phrases that give generated email away, in any language: "I hope
  this email finds you well", "I came across your business", "take your business
  to the next level", "online presence", "digital presence", "elevate",
  "transform", "boost", "seamless", "stunning", "in today's digital world",
  "we'd love to", "don't hesitate", "game-changer", "unlock", or their
  equivalents. No lists of three adjectives.
- Don't over-praise. One genuine observation beats three compliments.
- Never claim to be a customer, to have visited, to live nearby or to know
  anyone there. We found them on Google Maps; say so plainly if it comes up.
- Never mention AI, automation, or how the page or the email was made.
- Read it back once as the owner would. If a word or connector repeats ("so…
  so…", "así que… así que…"), or a sentence sounds like it came from a
  template, rewrite it.
- The subject line: 3 to 7 words, lowercase except for names, no colon, no
  exclamation, the way someone types a subject to a person. It may use the
  business name.

**Write it to \`./${EMAIL_FILE}\`**, exactly this shape, valid JSON:

\`\`\`
{ "subject": "…", "body": "…" }
\`\`\`

Newlines in the body as \\n, a blank line (\\n\\n) between paragraphs. Write
only that file; don't touch the page.`;
}

/**
 * Parse and check what the agent wrote. Returns the problem as a sentence the
 * agent can act on, so a bad draft gets one chance to be fixed.
 */
export function parsePitchEmail(
  raw: string | null,
  options: { hasQuote: boolean },
): { ok: true; email: PitchEmail } | { ok: false; problem: string } {
  if (!raw) return { ok: false, problem: `You did not write ./${EMAIL_FILE}.` };

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, problem: `./${EMAIL_FILE} is not valid JSON.` };
  }

  const subject = typeof (data as PitchEmail)?.subject === "string" ? (data as PitchEmail).subject.trim() : "";
  const body = typeof (data as PitchEmail)?.body === "string" ? (data as PitchEmail).body.trim() : "";

  if (!subject || !body) {
    return { ok: false, problem: `./${EMAIL_FILE} needs a non-empty "subject" and "body".` };
  }
  if (subject.length > 120) return { ok: false, problem: "The subject is too long; keep it to a few words." };

  const links = body.match(/\{\{\s*demo_url\s*\}\}/g)?.length ?? 0;
  if (links !== 1) {
    return {
      ok: false,
      problem: `The body must contain the placeholder {{demo_url}} exactly once (it has ${links}).`,
    };
  }

  const allowed = new Set(["demo_url", ...(options.hasQuote ? ["quote"] : [])]);
  for (const match of `${subject}\n${body}`.matchAll(/\{\{\s*(\w+)\s*\}\}/g)) {
    if (!allowed.has(match[1])) {
      return { ok: false, problem: `{{${match[1]}}} is not a placeholder we fill in. Write the text itself.` };
    }
  }

  // bezikee.com in the sign-off is plain text; any full URL is one it made up.
  if (/https?:\/\//i.test(body)) {
    return { ok: false, problem: "The body contains a URL. The only link should be {{demo_url}}." };
  }

  // The single most reliable tell of generated text, and trivially avoidable.
  if (/[—–]/.test(`${subject}${body}`)) {
    return { ok: false, problem: "Remove every em dash and en dash; use a comma, full stop or brackets." };
  }

  const words = body.replace(/\{\{\s*\w+\s*\}\}/g, "x").split(/\s+/).filter(Boolean).length;
  if (words > 200) {
    return { ok: false, problem: `The body is ${words} words. Cut it to under 140.` };
  }

  return { ok: true, email: { subject, body } };
}
