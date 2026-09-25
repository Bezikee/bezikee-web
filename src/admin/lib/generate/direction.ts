import type { Category } from "@admin/config/categories";

/**
 * Art direction for one demo site, chosen before the agent runs.
 *
 * Left to itself the agent converges: the design skill (Hallmark) is built to
 * rotate its choices using a log of previous builds, but every build here runs
 * in a fresh sandbox with no log, so every build is its "first" — and a model
 * making the first pick makes the same pick every time. The pages came out as
 * one house style in different colours.
 *
 * So the choices that give a page its identity are made here, in code, where
 * there is memory: layout, hero, footer, palette, type, motion and ornament,
 * each drawn from a catalogue curated for this job and steered away from what
 * recent builds used. The agent still does all the designing — it is handed a
 * brief instead of a blank page.
 *
 * Every option has to survive the page's hard limits: no images, no network
 * (so no web fonts — system faces only), no JavaScript, content kept spare.
 * Several Hallmark shapes (product mockups, sign-up forms, photo folds,
 * newsletter footers) can't, and are left out.
 */

type Group = Category["group"];

/** How much an option suits a kind of business. Missing groups count as 1. */
type Affinity = Partial<Record<Group, number>>;

type Option = {
  /** Stable key, stored with the build and used for rotation. */
  key: string;
  /** Short human label, shown in the admin panel. */
  label: string;
  /** What the agent is told. */
  brief: string;
  affinity?: Affinity;
};

type Layout = Option & {
  /** Hallmark macrostructure file, so the skill can load its full spec. */
  macrostructure: string;
  heroes: string[];
  /** Type styles that read well in this shape; others are down-weighted. */
  prefersType?: TypeStyle[];
};

type TypeStyle = "serif" | "didone" | "slab" | "sans" | "condensed" | "typewriter";

type TypePairing = Option & { style: TypeStyle; display: string; body: string };

type Palette = Option & { band: "light" | "mid" | "dark" };

// ---------------------------------------------------------------- catalogues

export const LAYOUTS: Layout[] = [
  {
    key: "marquee",
    label: "Marquee hero",
    macrostructure: "03-marquee-hero.md",
    heroes: ["H1", "H9"],
    brief:
      "The name owns the whole first screen as one bold typographic statement; below the fold the page changes gear into a calm list of reviews, hours and address.",
    prefersType: ["condensed", "slab", "didone", "sans"],
  },
  {
    key: "quote-led",
    label: "Quote-led",
    macrostructure: "09-quote-led.md",
    heroes: ["H3"],
    brief:
      "Open on the single best real review, set large, with the reviewer's name — borrowed credibility first. The business name arrives just under it, then the rest of the page earns the quote.",
    affinity: { food: 1.3, beauty: 1.2, health: 1.2 },
  },
  {
    key: "letter",
    label: "Letter",
    macrostructure: "12-letter.md",
    heroes: ["H5"],
    brief:
      "The page is a short letter to a neighbour who hasn't visited yet — first person plural, warm, written. Reviews appear as quoted replies; hours and address close it like a signature block.",
    prefersType: ["serif", "typewriter"],
    affinity: { food: 1.3, retail: 1.2, trades: 0.8 },
  },
  {
    key: "long-document",
    label: "Long document",
    macrostructure: "02-long-document.md",
    heroes: ["H1", "H5"],
    brief:
      "Reads like a short magazine profile of the place: a headline, a standfirst, continuous prose with inline section heads, reviews as pull quotes in the margin.",
    prefersType: ["serif", "didone"],
    affinity: { food: 1.2, retail: 1.2 },
  },
  {
    key: "split",
    label: "Split studio",
    macrostructure: "15-split-studio.md",
    heroes: ["H2"],
    brief:
      "A diptych: every block splits the screen, words on one side and proof (rating, a review, the hours) on the other, alternating sides down the page. The hero's other half is a drawn illustration, not a photo.",
    affinity: { beauty: 1.3, health: 1.2, services: 1.2 },
  },
  {
    key: "manifesto",
    label: "Manifesto",
    macrostructure: "07-manifesto.md",
    heroes: ["H1"],
    brief:
      "Poster energy: a few big declarative lines about what the place stands for (built only from what the data supports), then the practical details set small and tight.",
    prefersType: ["condensed", "slab", "sans"],
    affinity: { trades: 1.3, beauty: 1.1, health: 0.6 },
  },
  {
    key: "stat-led",
    label: "Stat-led",
    macrostructure: "04-stat-led.md",
    heroes: ["H4"],
    brief:
      "The hero is the real Google rating as a giant number with the review count as its qualifier; everything after supports it — the reviews behind the number, then how to get there.",
    affinity: { trades: 1.3, services: 1.3, health: 1.2 },
  },
  {
    key: "specimen",
    label: "Specimen",
    macrostructure: "10-specimen.md",
    heroes: ["H1", "H9"],
    brief:
      "Editorial specimen: numbered left-margin labels (01 — La casa, 02 — Lo que dicen…), huge display type, hairline rules, asymmetric spans, a typographic call to action.",
    prefersType: ["didone", "serif"],
    affinity: { retail: 1.2, beauty: 1.2 },
  },
  {
    key: "faq",
    label: "Conversational FAQ",
    macrostructure: "06-conversational-faq.md",
    heroes: ["H1", "H2"],
    brief:
      "After a short hero, the page is the questions a first-time customer actually has — ¿Dónde estáis? ¿Cuándo abrís? ¿Qué dicen los clientes? — each answered briefly from the data, set as bold questions with short answers.",
    affinity: { trades: 1.4, health: 1.3, services: 1.3, food: 0.8 },
  },
  {
    key: "bento",
    label: "Bento grid",
    macrostructure: "01-bento-grid.md",
    heroes: ["H1", "H4"],
    brief:
      "After the hero, an irregular grid of tiles of different sizes — the rating, a review, the hours, the address, a line about the place — rhythm from size variation, never a row of equal cards.",
    prefersType: ["sans", "condensed", "slab"],
    affinity: { services: 1.2, trades: 1.1, beauty: 1.1 },
  },
];

export const HEROES: Record<string, string> = {
  H1: "H1 Marquee — one statement fills the fold",
  H2: "H2 Split diptych — headline one side, a drawn SVG illustration the other",
  H3: "H3 Quote-led — a real review is the headline",
  H4: "H4 Stat-led — the rating as a giant number",
  H5: "H5 Letter hero — a first-person opening line",
  H9: "H9 Illustration centrepiece — one hand-built SVG of something from this trade",
};

export const FOOTERS: Option[] = [
  { key: "Ft1", label: "Masthead footer", brief: "Ft1 Mast-headed — wordmark and a line anchor one band; phone and address beside." },
  { key: "Ft2", label: "Single-line footer", brief: "Ft2 Inline rule — one hairline, then a single line of address, phone and hours." },
  { key: "Ft4", label: "Colophon footer", brief: "Ft4 Dense typographic — a small justified block of address, hours and credits, colophon style." },
  { key: "Ft5", label: "Statement footer", brief: "Ft5 Statement — one large closing sentence, details small beneath." },
  { key: "Ft6", label: "Letter-close footer", brief: "Ft6 Letter close — signs off like a letter, with a short postscript.", affinity: { food: 1.2, retail: 1.2 } },
  { key: "Ft8", label: "Marquee footer", brief: "Ft8 Marquee scroll — the name and street running as a slow ribbon (CSS only, paused under reduced motion).", affinity: { food: 1.1, beauty: 1.2 } },
];

export const PALETTES: Palette[] = [
  { key: "terracotta", label: "Terracotta & bone", band: "light", brief: "Warm bone paper, terracotta and baked-clay tones, a deep brown ink.", affinity: { food: 1.4, retail: 1.1 } },
  { key: "oxblood", label: "Ink & oxblood", band: "dark", brief: "Near-black warm ink ground, oxblood and wine accents, candle-cream text.", affinity: { food: 1.3, beauty: 1.1, health: 0.5 } },
  { key: "forest", label: "Forest & brass", band: "dark", brief: "Deep forest green ground, brushed-brass accent, parchment text.", affinity: { food: 1.1, beauty: 1.2, retail: 1.1 } },
  { key: "seaglass", label: "Sea glass", band: "light", brief: "Pale sea-glass paper, soft teal and slate, one crisp coral accent.", affinity: { health: 1.4, beauty: 1.2, food: 0.8 } },
  { key: "nightblue", label: "Night blue & amber", band: "dark", brief: "Midnight-blue ground, amber lamplight accent, warm off-white text.", affinity: { food: 1.2, services: 1.1 } },
  { key: "saffron", label: "Saffron & charcoal", band: "mid", brief: "Saffron and mustard fields against charcoal type, a hot tomato accent.", affinity: { food: 1.3, trades: 1.2 } },
  { key: "olive", label: "Olive & linen", band: "light", brief: "Linen paper, olive and sage tones, a dark olive-black ink.", affinity: { food: 1.2, health: 1.2, retail: 1.2 } },
  { key: "plum", label: "Plum & blush", band: "mid", brief: "Blush and powder tones with deep plum type and a single plum accent.", affinity: { beauty: 1.5, food: 0.8, trades: 0.3 } },
  { key: "signal", label: "Paper & signal red", band: "light", brief: "Newsprint white and true black, one signal-red accent used sparingly.", affinity: { trades: 1.4, services: 1.3 } },
  { key: "azulejo", label: "Azulejo blue", band: "light", brief: "Chalk white with azulejo cobalt and a pale sky tint, like Spanish tile.", affinity: { food: 1.2, health: 1.2, retail: 1.1 } },
  { key: "cocoa", label: "Cocoa & cream", band: "mid", brief: "Cream and caramel with cocoa-brown type and a rich chocolate ground for one section.", affinity: { food: 1.4, beauty: 1.1 } },
  { key: "graphite", label: "Graphite & safety", band: "dark", brief: "Graphite and concrete greys, a safety-yellow accent, crisp white type.", affinity: { trades: 1.5, services: 1.1, beauty: 0.4, food: 0.3 } },
];

/** System faces only: the page may not load fonts. Every stack falls back sanely. */
export const TYPE_PAIRINGS: TypePairing[] = [
  {
    key: "fashion", label: "Didot + Avenir", style: "didone",
    display: `Didot, "Bodoni 72", "Bodoni MT", "Playfair Display", serif`,
    body: `"Avenir Next", Avenir, "Segoe UI", sans-serif`,
    brief: "High-contrast Didone display with a clean geometric-humanist body — fashion-magazine poise.",
    affinity: { beauty: 1.5, retail: 1.2, trades: 0.3 },
  },
  {
    key: "slab", label: "Clarendon + Charter", style: "slab",
    display: `Superclarendon, Rockwell, "Roboto Slab", Georgia, serif`,
    body: `Charter, "Bitstream Charter", Georgia, serif`,
    brief: "A sturdy slab like a painted shop sign, over a sensible reading serif.",
    affinity: { trades: 1.4, food: 1.2 },
  },
  {
    key: "poster", label: "Futura + Iowan", style: "sans",
    display: `Futura, "Century Gothic", "Trebuchet MS", sans-serif`,
    body: `"Iowan Old Style", Palatino, "Book Antiqua", Georgia, serif`,
    brief: "Geometric poster sans, set bold and tracked, against a warm old-style body serif.",
    affinity: { services: 1.2, food: 1.1 },
  },
  {
    key: "book", label: "Big Caslon + Hoefler", style: "serif",
    display: `"Big Caslon", "Hoefler Text", Baskerville, Georgia, serif`,
    body: `"Hoefler Text", Baskerville, Georgia, serif`,
    brief: "Old-world bookish serifs — a family business that has been there a while (without claiming a year).",
    affinity: { food: 1.3, retail: 1.3 },
  },
  {
    key: "signage", label: "DIN Condensed + Avenir", style: "condensed",
    display: `"DIN Condensed", "Avenir Next Condensed", "Arial Narrow", sans-serif`,
    body: `"Avenir Next", Avenir, "Segoe UI", sans-serif`,
    brief: "Civic signage: condensed DIN capitals for display, plain and legible body.",
    affinity: { trades: 1.5, health: 1.2, services: 1.3 },
  },
  {
    key: "engraved", label: "Copperplate + Baskerville", style: "serif",
    display: `Copperplate, "Copperplate Gothic Light", "Palatino Linotype", serif`,
    body: `Baskerville, "Baskerville Old Face", Georgia, serif`,
    brief: "Engraved small capitals like a letterhead or a shop's brass plate, with a classic Baskerville body.",
    affinity: { beauty: 1.2, retail: 1.2, services: 1.2 },
  },
  {
    key: "humanist", label: "Optima + Seravek", style: "sans",
    display: `Optima, Candara, "Segoe UI", sans-serif`,
    body: `Seravek, "Gill Sans", Calibri, "Segoe UI", sans-serif`,
    brief: "Calm humanist sans throughout, flared display and gentle body — clinical without being cold.",
    affinity: { health: 1.5, beauty: 1.3 },
  },
  {
    key: "typewriter", label: "American Typewriter + Georgia", style: "typewriter",
    display: `"American Typewriter", "Courier Prime", "Courier New", monospace`,
    body: `Georgia, "Iowan Old Style", serif`,
    brief: "Typewritten display and labels over a readable serif — a handwritten-note, neighbourhood feel.",
    affinity: { food: 1.3, retail: 1.1 },
  },
  {
    key: "railway", label: "Gill Sans + Palatino", style: "sans",
    display: `"Gill Sans", "Gill Sans MT", Seravek, Calibri, sans-serif`,
    body: `Palatino, "Palatino Linotype", "Book Antiqua", serif`,
    brief: "Classic Gill Sans headings in caps, Palatino body — timeless and trustworthy.",
    affinity: { services: 1.2, health: 1.1, trades: 1.1 },
  },
  {
    key: "market", label: "Avenir Condensed Heavy + Iowan", style: "condensed",
    display: `"Avenir Next Condensed", "DIN Condensed", "Arial Narrow", sans-serif`,
    body: `"Iowan Old Style", Palatino, Georgia, serif`,
    brief: "Heavy condensed display like a market-stall board, softened by a warm serif body.",
    affinity: { food: 1.3, trades: 1.2 },
  },
];

export const MOTIONS: Option[] = [
  { key: "stagger", label: "Staggered entrance", brief: "A quiet, orchestrated entrance only: wordmark, line, rating, button, staggered. Nothing moves after that." },
  { key: "ribbon", label: "Running ribbon", brief: "One slow horizontal ribbon of text (the name, the street, the hours) crossing a band of the page." },
  { key: "drift", label: "Drifting ground", brief: "A slow drifting gradient or grain in one section's background, felt more than seen." },
  { key: "reveal", label: "Scroll reveals", brief: "Sections and quotes reveal as they arrive, using animation-timeline: view() inside @supports." },
  { key: "underline", label: "Drawn rules", brief: "Hairline rules and heading underlines draw themselves in as they enter view." },
  { key: "seal", label: "Turning seal", brief: "A circular seal carrying the rating turns very slowly, like a stamp on the page." },
];

export const ORNAMENTS: Option[] = [
  { key: "monogram", label: "Monogram", brief: "A drawn monogram or emblem of the initials in inline SVG." },
  { key: "stamp", label: "Rubber stamp", brief: "The rating as a slightly rotated rubber-stamp or wax-seal mark in inline SVG." },
  { key: "rules", label: "Rule system", brief: "No emblem: a disciplined system of hairline rules, section numerals and small caps does the decorating." },
  { key: "pattern", label: "Pattern band", brief: "One band of repeating pattern drawn from the trade or the neighbourhood (tile, brick, scallop, stripe) as an SVG data URI." },
  { key: "numeral", label: "Oversized numerals", brief: "Oversized numerals — the rating, the opening hour, the street number — used as graphic shapes." },
  { key: "illustration", label: "Line illustration", brief: "One simple line illustration in inline SVG of an object from this trade (a cup, scissors, a wrench, a loaf)." },
  { key: "typographic", label: "Type only", brief: "Nothing drawn at all: the wordmark and the type do every bit of the work." },
];

// ------------------------------------------------------------------ choosing

export type Direction = {
  layout: string;
  hero: string;
  footer: string;
  /** Fallback palette: used only when the photos show no clear identity. */
  palette: string;
  /** Default type pairing. */
  type: string;
  /**
   * Other pairings the agent may pick instead, when the business's signage or
   * character clearly suits one better. Still from the catalogue, so they are
   * faces the page can actually use.
   */
  typeAlternates?: string[];
  motion: string;
  ornament: string;
  /** What the agent read from the photos, recorded after the build. */
  style?: StyleReading;
};

/**
 * The agent's reading of the photos, written to style.json in its sandbox.
 * `match` means the page takes its colours from the real place; `improvise`
 * means the photos showed no clear identity and the fallback palette was used.
 */
export type StyleReading = {
  mode: "match" | "improvise";
  identity: string;
  colours: string[];
  type: string;
  photos: { file: string; kind: string; useful: boolean }[];
};

/** The choices that rotate between builds. */
type Dimension = "layout" | "hero" | "footer" | "palette" | "type" | "motion" | "ornament";

/**
 * How many recent builds each choice must avoid. Just under half of each
 * catalogue, so rotation is real but the pick is never forced to one option.
 */
const AVOID_RECENT: Record<Dimension, number> = {
  layout: 4,
  hero: 2,
  footer: 2,
  palette: 5,
  type: 4,
  motion: 2,
  ornament: 3,
};

function weighted<T>(items: { item: T; weight: number }[], random: () => number): T {
  const total = items.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = random() * total;
  for (const entry of items) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return items[items.length - 1].item;
}

/**
 * Pick from `options`, preferring what suits the business and avoiding what
 * recent builds used. If avoidance would leave nothing, it relaxes rather than
 * fails — variety is a preference, a page is a requirement.
 */
/**
 * Below this an option is a poor fit for the business — graphite and safety
 * yellow for a bar — and is left out rather than merely made unlikely. Rare
 * mismatches still happen when every draw is rolled; for a page shown to an
 * owner, one is too many.
 */
const POOR_FIT = 0.5;

function choose<T extends { key: string }>(
  options: T[],
  avoid: Set<string>,
  weight: (option: T) => number,
  random: () => number,
): T {
  const suitable = options.filter((option) => weight(option) >= POOR_FIT);
  const candidates = suitable.length > 0 ? suitable : options;
  const fresh = candidates.filter((option) => !avoid.has(option.key));
  const pool = fresh.length > 0 ? fresh : candidates;
  return weighted(
    pool.map((item) => ({ item, weight: Math.max(weight(item), 0.01) })),
    random,
  );
}

/**
 * Choose the art direction for a new build.
 *
 * @param recent directions of recent builds, newest first, across all
 *   businesses — so two leads pitched the same week don't get twin pages.
 * @param previous this business's last direction, if it had one. A rebuild
 *   differs from it on every axis the catalogues allow.
 */
export function chooseDirection(
  group: Group | undefined,
  recent: Direction[],
  previous: Direction | null,
  random: () => number = Math.random,
): Direction {
  const avoid = (dimension: Dimension): Set<string> => {
    const keys = recent.slice(0, AVOID_RECENT[dimension]).map((d) => d[dimension]);
    if (previous) keys.push(previous[dimension]);
    return new Set(keys);
  };
  const suits = (affinity?: Affinity) => (group ? affinity?.[group] ?? 1 : 1);

  const layout = choose(LAYOUTS, avoid("layout"), (o) => suits(o.affinity), random);

  const heroAvoid = avoid("hero");
  const heroOptions = layout.heroes.map((key) => ({ key }));
  const hero = choose(heroOptions, heroAvoid, () => 1, random);

  const typeWeight = (o: TypePairing) =>
    suits(o.affinity) * (layout.prefersType?.includes(o.style) ? 1.6 : 1);
  const type = choose(TYPE_PAIRINGS, avoid("type"), typeWeight, random);

  // Two alternates in other styles, so matching a shop's lettering is a real
  // choice (a slab, a didone, a condensed sans) rather than three of a kind.
  const alternates: TypePairing[] = [];
  for (let i = 0; i < 2; i++) {
    const taken = new Set([type.style, ...alternates.map((a) => a.style)]);
    const pool = TYPE_PAIRINGS.filter((o) => o.key !== type.key && !taken.has(o.style));
    if (pool.length === 0) break;
    alternates.push(choose(pool, avoid("type"), typeWeight, random));
  }

  // A dark page following a dark page reads as the same page, whatever the hue.
  const lastBand = PALETTES.find((p) => p.key === (previous ?? recent[0])?.palette)?.band;
  const palette = choose(
    PALETTES,
    avoid("palette"),
    (o) => suits(o.affinity) * (o.band === lastBand ? 0.4 : 1),
    random,
  );

  const footer = choose(FOOTERS, avoid("footer"), (o) => suits(o.affinity), random);
  const motion = choose(MOTIONS, avoid("motion"), () => 1, random);
  const ornament = choose(ORNAMENTS, avoid("ornament"), () => 1, random);

  return {
    layout: layout.key,
    hero: hero.key,
    footer: footer.key,
    palette: palette.key,
    type: type.key,
    typeAlternates: alternates.map((a) => a.key),
    motion: motion.key,
    ornament: ornament.key,
  };
}

const MODES = new Set(["match", "improvise"]);

/**
 * Parse the agent's style.json. It is model output, so anything malformed is
 * dropped rather than trusted: the build still stands, just without a reading.
 */
export function parseStyleReading(raw: string | null | undefined): StyleReading | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (!value || typeof value !== "object" || !MODES.has(value.mode as string)) return null;
    const text = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
    return {
      mode: value.mode as StyleReading["mode"],
      identity: text(value.identity, 400),
      colours: Array.isArray(value.colours)
        ? value.colours
            .filter((c): c is string => typeof c === "string" && /^#[0-9a-f]{3,8}$/i.test(c))
            .slice(0, 8)
        : [],
      type: TYPE_PAIRINGS.some((t) => t.key === value.type) ? (value.type as string) : "",
      photos: Array.isArray(value.photos)
        ? value.photos.slice(0, 12).map((photo) => {
            const p = (photo ?? {}) as Record<string, unknown>;
            return { file: text(p.file, 60), kind: text(p.kind, 30), useful: Boolean(p.useful) };
          })
        : [],
    };
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------- describing

const byKey = <T extends { key: string }>(options: T[], key: string) =>
  options.find((option) => option.key === key);

/** Parse a stored direction, or null for builds made before directions existed. */
export function parseDirection(raw: string | null | undefined): Direction | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Direction>;
    const complete = (["layout", "hero", "footer", "palette", "type", "motion", "ornament"] as const)
      .every((key) => typeof value[key] === "string");
    return complete ? (value as Direction) : null;
  } catch {
    return null;
  }
}

/**
 * "Letter · Terracotta & bone · Didot + Avenir" for the admin panel, or
 * "Letter · Colours from their photos · …" when the page matched the place.
 */
export function describeDirection(direction: Direction): string {
  const style = direction.style;
  return [
    byKey(LAYOUTS, direction.layout)?.label,
    style?.mode === "match" ? "Colours from their photos" : byKey(PALETTES, direction.palette)?.label,
    byKey(TYPE_PAIRINGS, style?.type || direction.type)?.label,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** The art-direction section of the agent's prompt. */
export function directionBrief(direction: Direction): string {
  const layout = byKey(LAYOUTS, direction.layout)!;
  const type = byKey(TYPE_PAIRINGS, direction.type)!;
  const palette = byKey(PALETTES, direction.palette)!;
  const alternates = (direction.typeAlternates ?? [])
    .map((key) => byKey(TYPE_PAIRINGS, key))
    .filter((alt): alt is TypePairing => Boolean(alt));

  return `## Art direction for THIS page — already decided, follow it

Other demo pages are being made for other businesses, and they must not look
alike. These choices were made for this page so that it differs from the recent
ones. They override the skill's own macrostructure, theme, nav/footer and
rotation picks — do not re-pick them, and skip the skill's questions and project
log; there is no one to ask. Everything else about designing well is still yours.

- **Layout:** ${layout.label} (Hallmark macrostructure \`${layout.macrostructure}\`). ${layout.brief}
- **Hero:** ${HEROES[direction.hero]}.
- **Footer:** ${byKey(FOOTERS, direction.footer)!.brief}
- **Palette:** comes from the photo study below. **Fallback**, used only if the
  photos show no clear identity: ${palette.label} — ${palette.brief} Either way,
  build a full token set (surfaces, ink, one accent, tonal steps).
- **Type:** ${type.label} — ${type.brief}
  - display: \`font-family: ${type.display}\`
  - body: \`font-family: ${type.body}\`${alternates
    .map(
      (alt) => `
  - *or, only if the photos' signage or character clearly calls for it:* ${alt.label} — ${alt.brief}
    display \`${alt.display}\` · body \`${alt.body}\``,
    )
    .join("")}
- **Signature motion:** ${byKey(MOTIONS, direction.motion)!.brief}
- **Ornament:** ${byKey(ORNAMENTS, direction.ornament)!.brief}

Stamp the top of the stylesheet with
\`/* Hallmark · macrostructure: ${layout.label} · hero: ${direction.hero} · footer: ${direction.footer} · palette: <from photos, or ${palette.label}> · type: <the pairing you used> */\`.`;
}
