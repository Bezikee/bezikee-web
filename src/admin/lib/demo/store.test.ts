import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@admin/lib/db";
import { businesses, demoSites } from "@admin/lib/db/schema";
import { demoIdFor, findDemoHtml, publishDemo } from "./store";
import { isDemoId } from "./url";

async function business(name: string): Promise<number> {
  const [row] = await db
    .insert(businesses)
    .values({ placeId: `place-${name}`, name, websiteClass: "none" })
    .returning({ id: businesses.id });
  return row.id;
}

beforeEach(async () => {
  // Cascades to demo_sites.
  await db.delete(businesses);
});

describe("publishDemo", () => {
  it("issues a random v4 id and serves the page under it", async () => {
    const id = await publishDemo(await business("Bar Loreto"), null, "<h1>Bar Loreto</h1>");

    expect(isDemoId(id)).toBe(true);
    expect(await findDemoHtml(id)).toBe("<h1>Bar Loreto</h1>");
  });

  it("keeps the id across rebuilds, so a link already sent keeps working", async () => {
    const businessId = await business("Bar Loreto");
    const first = await publishDemo(businessId, null, "<h1>v1</h1>");
    const second = await publishDemo(businessId, null, "<h1>v2</h1>");

    expect(second).toBe(first);
    expect(await findDemoHtml(first)).toBe("<h1>v2</h1>");
    expect(await db.select().from(demoSites)).toHaveLength(1);
  });

  it("gives every business its own unrelated id", async () => {
    const a = await publishDemo(await business("A"), null, "a");
    const b = await publishDemo(await business("B"), null, "b");

    expect(a).not.toBe(b);
    expect(await findDemoHtml(a)).toBe("a");
    expect(await findDemoHtml(b)).toBe("b");
  });

  it("goes away with the business", async () => {
    const businessId = await business("Closed Down");
    const id = await publishDemo(businessId, null, "gone");

    await db.delete(businesses);
    expect(await findDemoHtml(id)).toBeNull();
  });
});

describe("findDemoHtml", () => {
  it("returns null for an id nobody issued", async () => {
    expect(await findDemoHtml("3b241101-e2bb-4255-8975-9f2b8bb0b8a0")).toBeNull();
  });

  it("refuses malformed ids before they reach the database", async () => {
    // A string Postgres would reject as a uuid must be a 404, not a 500.
    expect(await findDemoHtml("not-a-uuid")).toBeNull();
    expect(await findDemoHtml("'; drop table demo_sites; --")).toBeNull();
  });
});

describe("demoIdFor", () => {
  it("finds a business's published demo, if any", async () => {
    const withDemo = await business("With");
    const without = await business("Without");
    const id = await publishDemo(withDemo, null, "x");

    expect(await demoIdFor(withDemo)).toBe(id);
    expect(await demoIdFor(without)).toBeNull();
  });
});
