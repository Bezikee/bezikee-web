import { describe, expect, it } from "vitest";

import { photoSource, rankPhotos } from "@admin/lib/places/details";
import type { PlacePhotoRef } from "@admin/lib/places/details";
import { buildPrompt, photoStudy } from "./agent";
import {
  TYPE_PAIRINGS,
  chooseDirection,
  describeDirection,
  parseStyleReading,
  type Direction,
} from "./direction";

/**
 * The page should look like the real place when its photos show one, and fall
 * back to the chosen palette when they don't.
 */

const photo = (name: string, author: string): PlacePhotoRef =>
  ({ name, authorAttributions: [{ displayName: author }] }) as PlacePhotoRef;

describe("which photos come from the business", () => {
  it("recognises the business's own uploads by its name", () => {
    expect(photoSource(photo("a", "A&F The Barber Madrid"), "A&F The Barber Madrid")).toBe("business");
    // Accents, case and punctuation don't make a different author.
    expect(photoSource(photo("a", "PELUQUERÍA LOLA"), "Peluqueria Lola")).toBe("business");
    // Owners sometimes upload under a shorter form of the name.
    expect(photoSource(photo("a", "Bar Loreto"), "Bar Loreto Chamberí")).toBe("business");
  });

  it("treats everyone else as a customer", () => {
    expect(photoSource(photo("a", "Miguel"), "A&F The Barber Madrid")).toBe("customer");
    expect(photoSource({ name: "a" } as PlacePhotoRef, "Bar Loreto")).toBe("customer");
  });

  it("puts the business's photos first, keeping Google's order within each group", () => {
    const ranked = rankPhotos(
      [photo("1", "Miguel"), photo("2", "Bar Loreto"), photo("3", "Ana"), photo("4", "Bar Loreto")],
      "Bar Loreto",
    );
    expect(ranked.map((p) => p.name)).toEqual(["2", "4", "1", "3"]);
  });
});

describe("the photo study in the prompt", () => {
  const direction = chooseDirection("beauty", [], null, () => 0.3);

  it("lists each photo with who uploaded it", () => {
    const text = photoStudy(
      [
        { file: "photo-1.jpg", source: "business" },
        { file: "photo-2.jpg", source: "customer" },
      ],
      direction,
    );
    expect(text).toContain("./photo-1.jpg — uploaded by the business");
    expect(text).toContain("./photo-2.jpg — uploaded by a customer");
  });

  it("makes the real place decide the palette when it has a clear identity", () => {
    const text = photoStudy([{ file: "photo-1.jpg", source: "business" }], direction);
    expect(text).toMatch(/mode "match"[\s\S]*Take the palette from\s+the real place/);
    expect(text).toMatch(/mode "improvise"[\s\S]*fallback\s+palette/);
    expect(text).toContain("style.json");
  });

  it("improvises from the trade when there are no photos at all", () => {
    const text = photoStudy([], direction);
    expect(text).toContain("no photos");
    expect(text).toContain('"improvise"');
  });

  it("offers only the pairings chosen for this build, by key and name", () => {
    const text = photoStudy([{ file: "photo-1.jpg", source: "business" }], direction);
    for (const key of [direction.type, ...(direction.typeAlternates ?? [])]) {
      const label = TYPE_PAIRINGS.find((t) => t.key === key)!.label;
      expect(text).toContain(`"${key}" (${label})`);
    }
  });

  it("frames the chosen palette as the fallback in the art direction", () => {
    const prompt = buildPrompt("/tmp/business.json", "hallmark", [], direction);
    expect(prompt).toMatch(/Palette:\*\* comes from the photo study/);
    expect(prompt).toMatch(/\*\*Fallback\*\*/);
  });
});

describe("type alternates", () => {
  it("offers two alternates in styles different from the default and each other", () => {
    let seed = 1;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 100; i++) {
      const d = chooseDirection("food", [], null, random);
      const styles = [d.type, ...(d.typeAlternates ?? [])].map(
        (key) => TYPE_PAIRINGS.find((t) => t.key === key)!.style,
      );
      expect(d.typeAlternates).toHaveLength(2);
      expect(new Set(styles).size).toBe(3);
    }
  });
});

describe("parseStyleReading", () => {
  const good = {
    mode: "match",
    identity: "Industrial barbershop: exposed red brick, black leather, black sign with white serif caps.",
    colours: ["#1a1a1a", "#9c4a32", "#f2ede4", "#c9a45c"],
    type: "slab",
    photos: [{ file: "photo-1.jpg", kind: "storefront", useful: true }],
  };

  it("reads what the agent concluded", () => {
    const reading = parseStyleReading(JSON.stringify(good))!;
    expect(reading.mode).toBe("match");
    expect(reading.colours).toEqual(good.colours);
    expect(reading.type).toBe("slab");
    expect(reading.photos[0]).toEqual({ file: "photo-1.jpg", kind: "storefront", useful: true });
  });

  it("drops what it can't trust instead of failing the build", () => {
    expect(parseStyleReading(null)).toBeNull();
    expect(parseStyleReading("{ // comments aren't JSON }")).toBeNull();
    expect(parseStyleReading(JSON.stringify({ ...good, mode: "copy-the-photos" }))).toBeNull();

    const odd = parseStyleReading(
      JSON.stringify({ ...good, type: "Comic Sans", colours: ["#fff", "red", "url(x)"] }),
    )!;
    expect(odd.type).toBe("");
    expect(odd.colours).toEqual(["#fff"]);
  });

  it("caps model-written text before it is stored", () => {
    const long = parseStyleReading(JSON.stringify({ ...good, identity: "x".repeat(5000) }))!;
    expect(long.identity.length).toBeLessThanOrEqual(400);
  });
});

describe("describeDirection with a reading", () => {
  const base: Direction = {
    layout: "letter",
    hero: "H5",
    footer: "Ft6",
    palette: "olive",
    type: "humanist",
    motion: "underline",
    ornament: "rules",
  };

  it("says when the colours came from the business's photos", () => {
    const style = parseStyleReading(
      JSON.stringify({ mode: "match", identity: "", colours: [], type: "slab", photos: [] }),
    )!;
    expect(describeDirection({ ...base, style })).toBe(
      "Letter · Colours from their photos · Clarendon + Charter",
    );
  });

  it("names the fallback palette when it improvised", () => {
    const style = parseStyleReading(
      JSON.stringify({ mode: "improvise", identity: "", colours: [], type: "", photos: [] }),
    )!;
    expect(describeDirection({ ...base, style })).toBe("Letter · Olive & linen · Optima + Seravek");
  });
});
