import { describe, expect, it } from "vitest";

import { parsePitchEmail } from "./email";

/**
 * Whatever the agent writes here is one click from a business owner's inbox,
 * so these are the drafts that must be sent back rather than kept.
 */

const draft = (fields: { subject?: string; body?: string }) =>
  JSON.stringify({
    subject: "una web para bar pepe",
    body: "Hola,\n\nOs escribimos desde Bezikee.\n\n{{demo_url}}\n\nPor {{quote}} la dejamos publicada.\n\nUn saludo,\nBezikee\nbezikee.com",
    ...fields,
  });

describe("parsePitchEmail", () => {
  it("keeps a good draft, trimmed", () => {
    const result = parsePitchEmail(draft({ subject: "  una web para bar pepe " }), { hasQuote: true });
    expect(result).toMatchObject({ ok: true, email: { subject: "una web para bar pepe" } });
  });

  it("needs the demo link exactly once", () => {
    expect(parsePitchEmail(draft({ body: "Hola, mirad la web." }), { hasQuote: true }).ok).toBe(false);
    expect(
      parsePitchEmail(draft({ body: "{{demo_url}}\n\n{{demo_url}}" }), { hasQuote: true }).ok,
    ).toBe(false);
  });

  it("refuses a URL it made up in place of the placeholder", () => {
    const result = parsePitchEmail(
      draft({ body: "Mirad: https://demo.bezikee.com/abc y también {{demo_url}}" }),
      { hasQuote: true },
    );
    expect(result.ok).toBe(false);
  });

  it("refuses placeholders we never fill, so no {{slot}} reaches a customer", () => {
    expect(parsePitchEmail(draft({ body: "Hola {{owner_name}}, {{demo_url}}" }), { hasQuote: true }).ok).toBe(false);
    expect(parsePitchEmail(draft({}), { hasQuote: false }).ok).toBe(false);
  });

  it("refuses em and en dashes, the giveaway of generated text", () => {
    expect(parsePitchEmail(draft({ body: "Hola — {{demo_url}}" }), { hasQuote: true }).ok).toBe(false);
    expect(parsePitchEmail(draft({ subject: "bar pepe – una web" }), { hasQuote: true }).ok).toBe(false);
  });

  it("explains a missing or broken file rather than throwing", () => {
    expect(parsePitchEmail(null, { hasQuote: true })).toMatchObject({ ok: false });
    expect(parsePitchEmail("{not json", { hasQuote: true })).toMatchObject({ ok: false });
    expect(parsePitchEmail(JSON.stringify({ subject: "x" }), { hasQuote: true })).toMatchObject({ ok: false });
  });
});
