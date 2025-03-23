import { createClient } from "jstack";

import type { AppRouter } from "@/server";
import { env } from "@/env";

export const client = createClient<AppRouter>({
  baseUrl: `${env.NEXT_PUBLIC_URL}/api`,
});
