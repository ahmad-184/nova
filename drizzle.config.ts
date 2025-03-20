import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
