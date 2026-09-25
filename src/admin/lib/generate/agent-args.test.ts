import { describe, expect, it } from "vitest";

import { agentArgs, agentEnv } from "./agent";

/** How the build agent is launched: nobody is there to approve anything. */

describe("agentArgs", () => {
  const args = agentArgs("prompt", "/tmp/x.settings.json");
  const value = (flag: string) => args[args.indexOf(flag) + 1];

  it("denies anything not pre-approved instead of prompting", () => {
    expect(value("--permission-mode")).toBe("dontAsk");
  });

  it("confines file edits to the scratch directory", () => {
    const allowed = value("--allowedTools").split(",");
    // A bare Write allow let the Write tool create files anywhere (tested).
    expect(allowed).not.toContain("Write");
    expect(allowed).not.toContain("Edit");
    expect(allowed).toContain("Edit(./**)");
  });

  it("allows the shell, which the OS sandbox confines", () => {
    expect(value("--allowedTools").split(",")).toContain("Bash");
  });

  it("loads no web tools and no MCP servers or connectors", () => {
    expect(value("--disallowedTools")).toContain("WebFetch");
    expect(value("--disallowedTools")).toContain("WebSearch");
    expect(args).toContain("--strict-mcp-config");
    expect(JSON.parse(value("--mcp-config"))).toEqual({ mcpServers: {} });
  });

  it("points at the settings file that carries the sandbox", () => {
    expect(value("--settings")).toBe("/tmp/x.settings.json");
  });
});

describe("agentEnv", () => {
  it("passes nothing secret to a process that has a shell", () => {
    const env = agentEnv({
      NODE_ENV: "development",
      HOME: "/Users/someone",
      PATH: "/usr/bin",
      DATABASE_URL: "postgres://user:hunter2@db/x",
      GOOGLE_MAPS_API_KEY: "AIza-secret",
      ADMIN_PASSWORD: "pw",
      RESEND_API_KEY: "re_secret",
      ANYTHING_ELSE: "x",
    });

    expect(env).toEqual({ HOME: "/Users/someone", PATH: "/usr/bin" });
    expect(JSON.stringify(env)).not.toMatch(/hunter2|AIza|pw|re_secret/);
  });
});
