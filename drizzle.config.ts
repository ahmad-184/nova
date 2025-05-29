import { defineConfig } from "drizzle-kit";
import { env } from "@/env";

const DATABASE_URL = env.SUPABASE_DATABASE_URL.replace(
  "[YOUR-PASSWORD]",
  env.SUPABASE_DATABASE_PASSWORD
);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
  tablesFilter: ["nv_*"],
});
