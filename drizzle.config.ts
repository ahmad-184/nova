import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { env } from "@/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  tablesFilter: ["nv_*"],
});
