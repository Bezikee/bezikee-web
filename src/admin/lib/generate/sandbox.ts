import "server-only";

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * What the site agent is allowed to touch.
 *
 * The agent runs with `Read` and a permission mode that never prompts for
 * reads, which means its working directory is **not** a boundary: given an
 * absolute path it will happily open anything the user can. That was verified,
 * not assumed — an earlier version of this build ran inside the repository and
 * could read `.env.local`, which holds the Google API key and the database
 * password. Any of the third-party review text it processes could have asked it
 * to.
 *
 * Two things fix it, and both are needed:
 *
 *  1. The build runs in a sandbox under the system temp directory, so there is
 *     nothing of ours nearby to reach for by accident.
 *  2. This deny list, passed via `--settings`, which is the only thing that
 *     actually stops a deliberate absolute path.
 */

/** Paths the agent must never read, whatever a poisoned review tells it. */
export function denyRules(projectRoot: string, home: string): string[] {
  // `Read(//abs/path)` — the doubled slash is how Claude Code spells an
  // absolute path in a permission rule.
  const abs = (tool: string, target: string) => `${tool}(//${target.replace(/^\/+/, "")})`;

  return [
    // The project itself. The sandbox is given everything it needs, so there is
    // no legitimate reason to read back into the repo — and this is where the
    // API key and the Postgres password live.
    abs("Read", `${projectRoot}/**`),
    abs("Write", `${projectRoot}/**`),
    abs("Edit", `${projectRoot}/**`),

    // Any other project's secrets on this machine.
    "Read(//**/.env)",
    "Read(//**/.env.*)",

    // The usual credential stores.
    abs("Read", `${home}/.ssh/**`),
    abs("Read", `${home}/.aws/**`),
    abs("Read", `${home}/.gnupg/**`),
    abs("Read", `${home}/.config/gh/**`),
    abs("Read", `${home}/.netrc`),
    abs("Read", `${home}/.npmrc`),
  ];
}

/**
 * Prepare a build sandbox: a directory outside the repository holding the
 * settings that constrain the agent and a copy of the design skill.
 *
 * The skill is copied rather than referenced in place for the same reason the
 * rest of this exists — pointing the agent at `.claude/skills` inside the repo
 * would put everything else in the repo one directory up from it, and would let
 * a single poisoned review rewrite the skill for every later build.
 */
export async function prepareSandbox(
  dir: string,
  skillSource: string,
  projectRoot: string = process.cwd(),
): Promise<void> {
  const skills = path.join(dir, ".claude", "skills");
  await fs.mkdir(skills, { recursive: true });

  // cp -R. The skill is a directory tree — SKILL.md plus a references/ library
  // it loads from progressively — so the whole shape has to come across.
  await fs.cp(skillSource, path.join(skills, path.basename(skillSource)), {
    recursive: true,
  });

  const settings = {
    permissions: { deny: denyRules(projectRoot, os.homedir()) },
  };

  await fs.writeFile(
    path.join(dir, "settings.json"),
    JSON.stringify(settings, null, 2),
    "utf8",
  );
}

/** Path to the settings file `prepareSandbox` wrote. */
export function settingsPath(dir: string): string {
  return path.join(dir, "settings.json");
}
