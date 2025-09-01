import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Options } from "postgres";

import { env } from "@/env";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var cachedDrizzle: PostgresJsDatabase<typeof schema>;
}

export const createDatabase = (db_url: string, db_password: string) => {
  const DATABASE_URL = db_url.replace("[YOUR-PASSWORD]", db_password);

  let database: PostgresJsDatabase<typeof schema>;
  let pg: ReturnType<typeof postgres>;

  const options: Options<any> | undefined = {
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 10000,
    max: 1,
  };

  if (env.NODE_ENV === "production") {
    pg = postgres(DATABASE_URL, options);
    database = drizzle(pg, { schema });
  } else {
    if (!global.cachedDrizzle) {
      pg = postgres(DATABASE_URL, options);
      global.cachedDrizzle = drizzle(pg, { schema });
    }
    database = global.cachedDrizzle;
  }

  return { database };
};

export const { database } = createDatabase(
  env.DATABASE_URL,
  env.SUPABASE_DATABASE_PASSWORD
);
