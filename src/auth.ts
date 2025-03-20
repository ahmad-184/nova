import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "./env";
import { database } from "./server/db";
import {
  SESSION_MAX_DURATION_MS,
  SESSION_REFRESH_INTERVAL_MS,
} from "./app-confige";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseUrl: env.BETTER_AUTH_URL,
  session: {
    expiresIn: SESSION_MAX_DURATION_MS,
    updateAge: SESSION_REFRESH_INTERVAL_MS,
  },
});
