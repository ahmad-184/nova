import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";

import * as schema from "./schema";
import { env } from "@/env";

type Database = NeonHttpDatabase<typeof schema> & {
  $client: NeonQueryFunction<false, false>;
};

declare global {
  // eslint-disable-next-line no-var
  var cachedDrizzle: Database;
}

const DATABASE_URL = env.DATABASE_URL;
let database: Database;

if (env.NODE_ENV === "production") {
  const sql = neon(DATABASE_URL);
  database = drizzle(sql, { schema });
} else {
  if (!global.cachedDrizzle) {
    const sql = neon(DATABASE_URL);
    global.cachedDrizzle = drizzle(sql, { schema });
  }
  database = global.cachedDrizzle;
}

export { database };
