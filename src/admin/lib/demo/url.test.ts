import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";

import { demoBaseUrl, demoHost, demoUrl, isDemoId } from "./url";

/**
 * The UUID is the only thing keeping a demo private, and these ids arrive from
 * the URL, so the question here is always "what gets refused".
 */

afterEach(() => {
  delete process.env.DEMO_BASE_URL;
});

describe("isDemoId", () => {
  it("accepts the random v4 UUIDs we issue", () => {
    for (let i = 0; i < 50; i++) expect(isDemoId(randomUUID())).toBe(true);
  });

  it("refuses anything that isn't one", () => {
    for (const bad of [
      "",
      "not-a-uuid",
      "bar-loreto-1959",
      // Right shape, wrong version: time-based ids are guessable.
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      // Right version, wrong variant.
      "3b241101-e2bb-4255-c975-9f2b8bb0b8a0",
      // Uppercase is normalised before this is called, never after.
      "3B241101-E2BB-4255-8975-9F2B8BB0B8A0",
      "3b241101-e2bb-4255-8975-9f2b8bb0b8a0/",
      "3b241101-e2bb-4255-8975-9f2b8bb0b8a0' or '1'='1",
      "../3b241101-e2bb-4255-8975-9f2b8bb0b8a0",
    ]) {
      expect(isDemoId(bad), bad).toBe(false);
    }
  });
});

describe("demo links", () => {
  it("default to demo.bezikee.com", () => {
    expect(demoBaseUrl()).toBe("https://demo.bezikee.com");
    expect(demoHost()).toBe("demo.bezikee.com");
    expect(demoUrl("3b241101-e2bb-4255-8975-9f2b8bb0b8a0")).toBe(
      "https://demo.bezikee.com/3b241101-e2bb-4255-8975-9f2b8bb0b8a0",
    );
  });

  it("follow DEMO_BASE_URL, port included, trailing slash tolerated", () => {
    process.env.DEMO_BASE_URL = "http://demo.localhost:3000/";
    expect(demoHost()).toBe("demo.localhost:3000");
    expect(demoUrl("3b241101-e2bb-4255-8975-9f2b8bb0b8a0")).toBe(
      "http://demo.localhost:3000/3b241101-e2bb-4255-8975-9f2b8bb0b8a0",
    );
  });
});
