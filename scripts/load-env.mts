/**
 * Load .env.local, then .env, the way `next dev` does — tsx scripts don't get
 * that for free. Variables already set in the environment win, so on Vercel
 * (no files, real variables) this does nothing, and `DATABASE_URL=… npm run x`
 * still overrides the file.
 *
 * Import it first: `import "./load-env.mjs";` (.mjs resolves to this file).
 */
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Missing file: nothing to load.
  }
}

export {};
