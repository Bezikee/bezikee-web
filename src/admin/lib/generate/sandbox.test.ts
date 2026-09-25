import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { WORK_ROOT } from "./paths";
import { denyRules, prepareSandbox, sandboxSettings, settingsPath } from "./sandbox";

/**
 * The site agent reads third-party text and has a shell. Its working directory
 * does not confine it — given an absolute path it opens whatever the user can.
 * That was demonstrated, not theorised: a build running inside the repository
 * read `.env.local`, which holds the Google API key and the database password.
 *
 * These rules, and the OS sandbox beside them, are what stop it.
 */

const PROJECT = "/Users/someone/Development/bezikee/bezikee-web";
const HOME = "/Users/someone";
const SANDBOX = "/var/folders/xy/T/bezikee-site-builds/bar-loreto-1959";

describe("denyRules", () => {
  const rules = denyRules(PROJECT, HOME, SANDBOX);

  it("blocks reading anything in the project, .env.local above all", () => {
    expect(rules).toContain(`Read(//${PROJECT.slice(1)}/**)`);
  });

  it("blocks writing back into the project", () => {
    // The page crosses out by being read out, never by the agent reaching in.
    expect(rules).toContain(`Edit(//${PROJECT.slice(1)}/**)`);
  });

  it("uses no Write rules, which Claude Code accepts and silently ignores", () => {
    // Only Read and Edit rules are consulted; Edit covers every writing tool.
    // The previous version relied on Write rules and the CLI said so on every run.
    expect(rules.filter((rule) => rule.startsWith("Write("))).toEqual([]);
  });

  it("puts the whole home directory off limits when the sandbox is outside it", () => {
    expect(rules).toContain(`Read(//${HOME.slice(1)}/**)`);
    expect(rules).toContain(`Edit(//${HOME.slice(1)}/**)`);
  });

  it("doesn't lock the agent out of a sandbox that was configured inside home", () => {
    // A deny rule can't be overridden by an allow, so the home-wide rule is
    // dropped rather than blocking the agent's own working directory.
    const inHome = denyRules(PROJECT, HOME, `${HOME}/builds/bar-1`);
    expect(inHome).not.toContain(`Read(//${HOME.slice(1)}/**)`);
    expect(inHome).toContain(`Read(//${HOME.slice(1)}/.ssh/**)`);
  });

  it("blocks env files belonging to any other project on the machine", () => {
    expect(rules).toContain("Read(//**/.env)");
    expect(rules).toContain("Read(//**/.env.*)");
  });

  it("blocks the usual credential stores", () => {
    for (const secret of [".ssh/**", ".aws/**", ".gnupg/**", ".config/**", ".claude/**"]) {
      expect(rules).toContain(`Read(//${HOME.slice(1)}/${secret})`);
    }
  });

  it("writes absolute rules with the doubled slash Claude Code expects", () => {
    // Read(/Users/…) matches nothing; Read(//Users/…) is the absolute form.
    for (const rule of rules) {
      expect(rule).toMatch(/^(Read|Edit)\(\/\/[^/]/);
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

  it("writes settings the CLI can consume: deny list, OS sandbox, no connectors", async () => {
    await prepareSandbox(dir, skill, PROJECT);
    const settings = JSON.parse(await fs.readFile(settingsPath(dir), "utf8"));

    expect(settings.permissions.deny).toEqual(denyRules(PROJECT, os.homedir(), dir));
    expect(settings.sandbox).toEqual(sandboxSettings(PROJECT, os.homedir(), dir));
    expect(settings.disableClaudeAiConnectors).toBe(true);
  });

  it("keeps the settings file out of the directory the agent can write to", async () => {
    // Otherwise the agent could loosen its own rules.
    const file = settingsPath(dir);
    expect(path.dirname(file)).not.toBe(dir);
    expect(file.startsWith(dir + path.sep)).toBe(false);
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

describe("sandboxSettings", () => {
  const sandbox = sandboxSettings(PROJECT, HOME, SANDBOX);

  it("can't be skipped or escaped", () => {
    expect(sandbox.enabled).toBe(true);
    // Without these, a sandbox that fails to start — or a command it blocks —
    // would run unconfined instead.
    expect(sandbox.failIfUnavailable).toBe(true);
    expect(sandbox.allowUnsandboxedCommands).toBe(false);
  });

  it("denies the shell the home directory and the project", () => {
    expect(sandbox.filesystem.denyRead).toEqual(expect.arrayContaining([HOME, PROJECT]));
  });

  it("re-allows only the sandbox itself and language runtimes", () => {
    // node lives under ~/.nvm here; without it the shell can't run node at all.
    expect(sandbox.filesystem.allowRead).toContain(SANDBOX);
    expect(sandbox.filesystem.allowRead).toContain(`${HOME}/.nvm`);
    for (const allowed of sandbox.filesystem.allowRead) {
      expect(allowed.includes("Development") || allowed.includes(".ssh")).toBe(false);
    }
  });

  it("gives the shell no network", () => {
    expect(sandbox.network.strictAllowlist).toBe(true);
    expect(sandbox.network.allowedDomains).toEqual([]);
  });
});
