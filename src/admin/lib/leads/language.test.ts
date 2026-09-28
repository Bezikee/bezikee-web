import { describe, expect, it } from "vitest";

import { countryOf, languageFor } from "./language";

describe("countryOf", () => {
  it("trusts the ISO code in Place Details first", () => {
    expect(
      countryOf({
        addressComponents: [{ shortText: "MX", types: ["country", "political"] }],
        address: "Calle Falsa 1, Madrid, España",
      }),
    ).toBe("MX");
  });

  it("falls back to the country at the end of the address", () => {
    expect(countryOf({ address: "C. de Fuencarral, 45, 28004 Madrid, España" })).toBe("ES");
    expect(countryOf({ address: "12 High St, London W1, UK" })).toBe("GB");
  });

  it("gives up rather than guessing from an address it can't read", () => {
    expect(countryOf({ address: "Somewhere 5" })).toBeNull();
    expect(countryOf({})).toBeNull();
  });
});

describe("languageFor", () => {
  it("writes in Spanish across Spain and Latin America", () => {
    expect(languageFor("ES").code).toBe("es");
    expect(languageFor("AR").code).toBe("es");
  });

  it("writes in the local language elsewhere, English when unsure of it", () => {
    expect(languageFor("FR").code).toBe("fr");
    expect(languageFor("BR").code).toBe("pt");
    expect(languageFor("GB").code).toBe("en");
    expect(languageFor("JP").code).toBe("en");
  });

  it("assumes Spanish with no country at all, since every area scraped so far is in Spain", () => {
    expect(languageFor(null).code).toBe("es");
  });
});
