import type { Config } from "drizzle-kit";

export default {
  schema: "./src/admin/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgres://localhost:5432/bezikee_admin",
  },
} satisfies Config;
