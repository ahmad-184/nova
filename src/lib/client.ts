import type { AppRouter } from "@/server";
import { createClient } from "jstack";

export const client = createClient<AppRouter>({
  baseUrl: "http://localhost:8080/api",
});
