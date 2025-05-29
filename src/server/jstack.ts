import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "hono/adapter";
import { jstack } from "jstack";

import { validateRequest } from "@/lib/auth";
import { HTTPException } from "hono/http-exception";
import { createDatabase } from "@/db";

interface Env {
  Bindings: {
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    SUPABASE_DATABASE_URL: string;
    SUPABASE_DATABASE_PASSWORD: string;
  };
}

export const j = jstack.init<Env>();

/**
 * Type-safely injects database into all procedures
 *
 * @see https://jstack.app/docs/backend/middleware
 */
const databaseMiddleware = j.middleware(async ({ c, next }) => {
  const { SUPABASE_DATABASE_URL, SUPABASE_DATABASE_PASSWORD } = env(c);

  const { database } = createDatabase(
    SUPABASE_DATABASE_URL,
    SUPABASE_DATABASE_PASSWORD
  );

  return await next({ db: database });
});

export const authMiddleware = j.middleware(async ({ next }) => {
  const session = await validateRequest();

  if (!session) {
    throw new HTTPException(401, {
      message: "Unauthorized, sign in to continue.",
    });
  }

  if (!session.user.emailVerified) {
    throw new HTTPException(401, {
      message: "Unauthorized, verify your email to continue.",
    });
  }

  return await next({ ...session });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware);
export const protectedProcedure = j.procedure
  .use(databaseMiddleware)
  .use(authMiddleware);
