import "server-only";

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * What the site agent is allowed to touch.
 *
 * The agent reads third-party text — business names, Google reviews — that
 * anyone can write, so it is treated as if a review might tell it to steal
 * something. It gets a shell (to check its own work: contrast maths, listing
 * files) but only inside walls it can't argue its way through:
 *
 *  1. It runs in a scratch directory under the system temp directory, with
 *     nothing of ours nearby.
 *  2. Permission rules stop its file tools reading the project, the home
 *     directory or any `.env`, and stop it editing anything outside the
 *     scratch directory.
 *  3. Claude Code's sandbox confines every shell command at the OS level
 *     (Seatbelt on macOS): writes only in the scratch directory, no reads of
 *     the home directory or the project, no network, and no escape hatch to an
 *     unsandboxed retry.
 *  4. It is started with a scrubbed environment (see `agentEnv` in agent.ts),
 *     because the sandbox guards files, not variables: `echo $DATABASE_URL`
 *     would otherwise print the database password.
 *
 * Each of these was tested by a run that tried to break it, with canary files
 * and variables standing in for the real secrets. Items 3 and 4 were found
 * that way, as was a rule the earlier version relied on that Claude Code never
 * enforced — `Write(path)` deny rules are accepted and ignored; only `Read` and
 * `Edit` rules are checked, and `Edit` covers every file-writing tool.
 */

/** Permission deny rules for the agent's own file tools. */
export function denyRules(projectRoot: string, home: string, sandboxDir: string): string[] {
  // `Read(//abs/path)` — the doubled slash is how Claude Code spells an
  // absolute path in a permission rule.
  const abs = (tool: string, target: string) => `${tool}(//${target.replace(/^\/+/, "")})`;

  const rules = [
    // The project itself: the API key and the database password live here,
    // and the finished page leaves the sandbox by being read out, never by the
    // agent reaching in.
    abs("Read", `${projectRoot}/**`),
    abs("Edit", `${projectRoot}/**`),

    // Any other project's secrets on this machine.
    "Read(//**/.env)",
    "Read(//**/.env.*)",

    // The usual credential stores, named even though the home rule below
    // covers them, so they stay blocked if that rule ever has to go.
    abs("Read", `${home}/.ssh/**`),
    abs("Read", `${home}/.aws/**`),
    abs("Read", `${home}/.gnupg/**`),
    abs("Read", `${home}/.config/**`),
    abs("Read", `${home}/.claude/**`),
    abs("Read", `${home}/.netrc`),
    abs("Read", `${home}/.npmrc`),
  ];

  // Everything the agent needs is in the scratch directory, so the whole home
  // directory can be off limits — unless the scratch directory was configured
  // to live inside it, since a deny rule can't be overridden by an allow.
  if (!isInside(sandboxDir, home)) {
    rules.push(abs("Read", `${home}/**`), abs("Edit", `${home}/**`));
  }

  return rules;
}

/**
 * Language runtimes that live under the home directory. The shell is denied
 * the home directory, so without these `node` (installed through nvm here)
 * could not even start. Missing ones are harmless.
 */
const TOOLCHAIN_DIRS = [".nvm", ".volta", ".fnm", ".asdf", ".pyenv", ".bun"];

/** Claude Code's OS-level sandbox for every shell command the agent runs. */
export function sandboxSettings(projectRoot: string, home: string, sandboxDir: string) {
  return {
    enabled: true,
    // Refuse to run rather than run unconfined if the sandbox can't start.
    failIfUnavailable: true,
    // Otherwise a blocked command may be retried outside the sandbox.
    allowUnsandboxedCommands: false,
    filesystem: {
      // Writes are limited to the working directory by default.
      denyRead: [home, projectRoot],
      allowRead: [sandboxDir, ...TOOLCHAIN_DIRS.map((dir) => path.join(home, dir))],
    },
    // No network at all: the page may not use any, and a shell with network is
    // how something read here would leave the machine.
    network: { strictAllowlist: true, allowedDomains: [] as string[] },
  };
}

function isInside(child: string, parent: string): boolean {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
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

  const home = os.homedir();
  const settings = {
    // The user's claude.ai connectors (mail, calendar, drive) have no place in
    // a build that reads strangers' reviews.
    disableClaudeAiConnectors: true,
    permissions: { deny: denyRules(projectRoot, home, dir) },
    sandbox: sandboxSettings(projectRoot, home, dir),
  };

  await fs.writeFile(settingsPath(dir), JSON.stringify(settings, null, 2), "utf8");
}

/**
 * Where `prepareSandbox` writes the agent's settings: beside the scratch
 * directory, not in it. The agent may write anywhere inside its scratch
 * directory, and the file that confines it must not be one of those places.
 */
export function settingsPath(dir: string): string {
  return `${dir.replace(/[\\/]+$/, "")}.settings.json`;
}
