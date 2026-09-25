import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { WORK_ROOT } from "./paths";
import { denyRules, prepareSandbox, settingsPath } from "./sandbox";

/**
 * The site agent runs with `Read` and a permission mode that never prompts for
 * reads, so its working directory does not confine it — given an absolute path
 * it opens whatever the user can. That was demonstrated, not theorised: a build
 * running inside the repository read `.env.local`, which holds the Google API
 * key and the database password, and every one of those builds processes
 * third-party review text that could have asked it to.
 *
 * These rules are the only thing that stops it.
 */

const PROJECT = "/Users/someone/Development/bezikee/bezikee-web";
const HOME = "/Users/someone";

describe("denyRules", () => {
  const rules = denyRules(PROJECT, HOME);

  it("blocks reading anything in the project, .env.local above all", () => {
    expect(rules).toContain(`Read(//${PROJECT.slice(1)}/**)`);
  });

  it("blocks writing back into the project", () => {
    // The page crosses out by being copied, never by the agent reaching in.
    expect(rules).toContain(`Write(//${PROJECT.slice(1)}/**)`);
    expect(rules).toContain(`Edit(//${PROJECT.slice(1)}/**)`);
  });

  it("blocks env files belonging to any other project on the machine", () => {
    expect(rules).toContain("Read(//**/.env)");
    expect(rules).toContain("Read(//**/.env.*)");
  });

  it("blocks the usual credential stores", () => {
    for (const secret of [".ssh/**", ".aws/**", ".gnupg/**", ".config/gh/**"]) {
      expect(rules).toContain(`Read(//${HOME.slice(1)}/${secret})`);
    }
  });

  it("writes absolute rules with the doubled slash Claude Code expects", () => {
    // Read(/Users/…) matches nothing; Read(//Users/…) is the absolute form.
    for (const rule of rules) {
      expect(rule).toMatch(/^(Read|Write|Edit)\(\/\/[^/]/);
    }
  });
});

describe("prepareSandbox", () => {
  let dir: string;
  let skill: string;

  beforeAll(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "sandbox-test-"));
    skill = await fs.mkdtemp(path.join(os.tmpdir(), "skill-src-"));
    await fs.mkdir(path.join(skill, "references"), { recursive: true });
    await fs.writeFile(path.join(skill, "SKILL.md"), "---\nname: probe\n---\nbody");
    await fs.writeFile(path.join(skill, "references", "color.md"), "colour notes");
  });

  afterAll(async () => {
    await fs.rm(dir, { recursive: true, force: true });
    await fs.rm(skill, { recursive: true, force: true });
  });

  it("copies the whole skill tree, not just SKILL.md", async () => {
    await prepareSandbox(dir, skill, PROJECT);
    const name = path.basename(skill);

    // The skill loads its reference library progressively, so a flat copy of
    // the top-level file would leave it reading files that are not there.
    expect(
      await fs.readFile(path.join(dir, ".claude", "skills", name, "SKILL.md"), "utf8"),
    ).toContain("name: probe");
    expect(
      await fs.readFile(
        path.join(dir, ".claude", "skills", name, "references", "color.md"),
        "utf8",
      ),
    ).toBe("colour notes");
  });

  it("writes settings the CLI can consume, carrying the deny list", async () => {
    await prepareSandbox(dir, skill, PROJECT);
    const settings = JSON.parse(await fs.readFile(settingsPath(dir), "utf8"));

    expect(settings.permissions.deny).toEqual(denyRules(PROJECT, os.homedir()));
    expect(settings.permissions.deny.length).toBeGreaterThan(5);
  });
});

describe("WORK_ROOT", () => {
  it("sits outside the repository", () => {
    // If a build ever runs inside the project again, the deny list becomes the
    // only thing between a poisoned review and the API key.
    expect(WORK_ROOT.startsWith(process.cwd())).toBe(false);
    expect(WORK_ROOT).toContain(os.tmpdir());
  });
});
