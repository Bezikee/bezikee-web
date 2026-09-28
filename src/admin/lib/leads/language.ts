import { SPANISH_SPEAKING_COUNTRIES } from "../../../i18n/config";

/**
 * Which language to pitch a business in: the one spoken where it is.
 *
 * Decided by country, because that is what Google gives us reliably — Place
 * Details carries the ISO code in `addressComponents`, and the formatted
 * address ends with the country's name. Regional languages (Catalan, Basque…)
 * are left aside on purpose: every business in Spain reads Spanish, and a
 * guess at the regional one that lands wrong is worse than not trying.
 */

export type PitchLanguage = {
  /** ISO 639-1, stored on the lead. */
  code: string;
  /** In English, for the agent's instructions. */
  name: string;
};

const LANGUAGES: Record<string, PitchLanguage> = {
  es: { code: "es", name: "Spanish" },
  en: { code: "en", name: "English" },
  fr: { code: "fr", name: "French" },
  it: { code: "it", name: "Italian" },
  pt: { code: "pt", name: "Portuguese" },
  de: { code: "de", name: "German" },
  nl: { code: "nl", name: "Dutch" },
};

/** Countries whose main language isn't Spanish or English. Everything unlisted gets English. */
const COUNTRY_LANGUAGE: Record<string, string> = {
  FR: "fr", MC: "fr",
  IT: "it", SM: "it", VA: "it",
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt",
  DE: "de", AT: "de", LI: "de",
  NL: "nl",
};

/** Country names as they end a Google formatted address, in the languages we query in. */
const COUNTRY_NAMES: Record<string, string> = {
  "españa": "ES", spain: "ES",
  "méxico": "MX", mexico: "MX",
  argentina: "AR", colombia: "CO", chile: "CL", "perú": "PE", peru: "PE",
  "reino unido": "GB", "united kingdom": "GB", uk: "GB",
  irlanda: "IE", ireland: "IE",
  "estados unidos": "US", "ee. uu.": "US", usa: "US", "united states": "US",
  francia: "FR", france: "FR",
  italia: "IT", italy: "IT",
  portugal: "PT",
  alemania: "DE", germany: "DE", deutschland: "DE",
  austria: "AT", "österreich": "AT",
  "países bajos": "NL", netherlands: "NL",
  andorra: "AD",
};

/** ISO 3166-1 alpha-2 from Place Details, or from the end of the address. */
export function countryOf(input: {
  addressComponents?: { shortText?: string; types?: string[] }[] | null;
  address?: string | null;
}): string | null {
  const component = input.addressComponents?.find((c) => c.types?.includes("country"));
  if (component?.shortText && /^[A-Z]{2}$/i.test(component.shortText)) {
    return component.shortText.toUpperCase();
  }

  const last = input.address?.split(",").pop()?.trim().toLowerCase();
  return last ? (COUNTRY_NAMES[last] ?? null) : null;
}

/**
 * The language for a business in `country`. Unknown country: Spanish, because
 * every area this tool scrapes today is in Spain, and a wrong guess towards the
 * market we actually work is the cheaper mistake.
 */
export function languageFor(country: string | null): PitchLanguage {
  if (!country) return LANGUAGES.es;
  const upper = country.toUpperCase();
  if (SPANISH_SPEAKING_COUNTRIES.has(upper)) return LANGUAGES.es;
  // Andorra's official language is Catalan, but Spanish is read by everyone there.
  if (upper === "AD") return LANGUAGES.es;
  return LANGUAGES[COUNTRY_LANGUAGE[upper] ?? "en"];
}

export function languageByCode(code: string | null | undefined): PitchLanguage | null {
  return code ? (LANGUAGES[code] ?? null) : null;
}
