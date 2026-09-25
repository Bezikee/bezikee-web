import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildPrompt } from "./agent";
import {
  FOOTERS,
  HEROES,
  LAYOUTS,
  MOTIONS,
  ORNAMENTS,
  PALETTES,
  TYPE_PAIRINGS,
  chooseDirection,
  describeDirection,
  directionBrief,
  parseDirection,
  type Direction,
} from "./direction";

/**
 * The point of art direction is that consecutive pages don't look alike. These
 * tests run the picker the way production does — each build seeing the ones
 * before it — and check that the output actually varies.
 */

/** Small deterministic RNG, so a failure reproduces. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

/** Build `count` pages in a row, each steering away from the ones before. */
function sequence(count: number, group: Parameters<typeof chooseDirection>[0], seed = 1) {
  const random = seeded(seed);
  const built: Direction[] = [];
  for (let i = 0; i < count; i++) {
    built.unshift(chooseDirection(group, built, null, random));
  }
  return built.reverse();
}

const SKILL = path.join(process.cwd(), "src", "admin", "skills", "hallmark", "references");

describe("the catalogues", () => {
  it("only name layouts the design skill actually has", () => {
    for (const layout of LAYOUTS) {
      expect(fs.existsSync(path.join(SKILL, "macrostructures", layout.macrostructure)), layout.macrostructure).toBe(true);
    }
  });

  it("only pair a layout with heroes that exist", () => {
    for (const layout of LAYOUTS) {
      for (const hero of layout.heroes) expect(HEROES[hero], `${layout.key} → ${hero}`).toBeDefined();
    }
  });

  it("give every type pairing a real fallback at the end of each stack", () => {
    // A phone without Didot must still get a serif, not the browser default.
    for (const pairing of TYPE_PAIRINGS) {
      for (const stack of [pairing.display, pairing.body]) {
        expect(stack, pairing.key).toMatch(/(serif|sans-serif|monospace)$/);
      }
    }
  });

  it("have unique keys, so stored directions stay unambiguous", () => {
    for (const list of [LAYOUTS, FOOTERS, PALETTES, TYPE_PAIRINGS, MOTIONS, ORNAMENTS]) {
      const keys = list.map((item) => item.key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});

describe("chooseDirection", () => {
  it("always returns a coherent direction", () => {
    for (const direction of sequence(50, "food")) {
      const layout = LAYOUTS.find((l) => l.key === direction.layout)!;
      expect(layout.heroes).toContain(direction.hero);
      expect(PALETTES.map((p) => p.key)).toContain(direction.palette);
      expect(TYPE_PAIRINGS.map((t) => t.key)).toContain(direction.type);
      expect(FOOTERS.map((f) => f.key)).toContain(direction.footer);
    }
  });

  it("never repeats a recent layout, palette or type pairing", () => {
    const built = sequence(40, "food");
    for (let i = 1; i < built.length; i++) {
      const earlier = built.slice(Math.max(0, i - 4), i);
      const current = built[i];
      expect(earlier.map((d) => d.layout), `build ${i}`).not.toContain(current.layout);
      expect(earlier.map((d) => d.type), `build ${i}`).not.toContain(current.type);
      expect(built.slice(Math.max(0, i - 5), i).map((d) => d.palette), `build ${i}`).not.toContain(
        current.palette,
      );
    }
  });

  it("works through most of the catalogue rather than circling a favourite", () => {
    const built = sequence(30, "beauty", 7);
    expect(new Set(built.map((d) => d.layout)).size).toBeGreaterThanOrEqual(8);
    expect(new Set(built.map((d) => d.palette)).size).toBeGreaterThanOrEqual(9);
    expect(new Set(built.map((d) => d.type)).size).toBeGreaterThanOrEqual(8);
  });

  it("gives a rebuild a different look from the page it replaces", () => {
    const random = seeded(3);
    for (let i = 0; i < 40; i++) {
      const previous = chooseDirection("food", [], null, random);
      const rebuild = chooseDirection("food", [], previous, random);
      expect(rebuild.layout).not.toBe(previous.layout);
      expect(rebuild.palette).not.toBe(previous.palette);
      expect(rebuild.type).not.toBe(previous.type);
      expect(rebuild.ornament).not.toBe(previous.ornament);
    }
  });

  it("leans toward looks that suit the trade", () => {
    // Without history, so affinity is the only thing steering.
    const random = seeded(11);
    const tally = (group: "trades" | "beauty", key: string) => {
      let hits = 0;
      for (let i = 0; i < 2000; i++) {
        if (chooseDirection(group, [], null, random).palette === key) hits++;
      }
      return hits;
    };
    expect(tally("trades", "graphite")).toBeGreaterThan(tally("beauty", "graphite") * 2);
    expect(tally("beauty", "plum")).toBeGreaterThan(tally("trades", "plum") * 2);
  });

  it("still picks when history has used everything", () => {
    // Every palette recently used: rotation relaxes rather than failing.
    const recent = PALETTES.map((p) => ({ ...sequence(1, "food")[0], palette: p.key }));
    expect(() => chooseDirection("food", recent, null, seeded(5))).not.toThrow();
  });
});

describe("parseDirection", () => {
  it("round-trips a stored direction", () => {
    const direction = sequence(1, "trades")[0];
    expect(parseDirection(JSON.stringify(direction))).toEqual(direction);
  });

  it("treats old or damaged rows as having no direction", () => {
    expect(parseDirection(null)).toBeNull();
    expect(parseDirection("")).toBeNull();
    expect(parseDirection("not json")).toBeNull();
    expect(parseDirection(JSON.stringify({ layout: "letter" }))).toBeNull();
  });
});

describe("the prompt", () => {
  const direction: Direction = {
    layout: "letter",
    hero: "H5",
    footer: "Ft6",
    palette: "olive",
    type: "humanist",
    motion: "underline",
    ornament: "rules",
  };

  it("hands the agent the chosen direction, fonts included", () => {
    const prompt = buildPrompt("/tmp/business.json", "hallmark", [], direction);
    expect(prompt).toContain("12-letter.md");
    expect(prompt).toContain("Olive & linen");
    expect(prompt).toContain(TYPE_PAIRINGS.find((t) => t.key === "humanist")!.display);
    expect(prompt).toContain("Ft6 Letter close");
  });

  it("no longer imposes one house style on every page", () => {
    // These were fixed for every build and made the pages converge.
    const prompt = buildPrompt("/tmp/business.json", "hallmark", [], direction);
    expect(prompt).not.toMatch(/a sheen that crosses/);
    expect(prompt).not.toMatch(/drawn\s+monogram or emblem in inline SVG, one element/);
    expect(prompt).not.toMatch(/Iowan Old Style, Palatino, Baskerville, Didot/);
    expect(prompt).not.toMatch(/Chamberí/);
  });

  it("describes a direction briefly for the admin panel", () => {
    expect(describeDirection(direction)).toBe("Letter · Olive & linen · Optima + Seravek");
    expect(directionBrief(direction)).toContain("Stamp the top of the stylesheet");
  });
});
