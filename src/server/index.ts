import { auth } from "@/auth";
import { j } from "./jstack";

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  // better-auth handler
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(api, {});

export type AppRouter = typeof appRouter;

export default appRouter;
