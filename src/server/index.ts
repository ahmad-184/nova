import "server-only";

import { j } from "./jstack";
import { auth } from "@/lib/auth";

import workspaceRouter from "./routers/workspace.routes";
import pageRouter from "./routers/page.route";

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .on(["POST", "GET"], "/auth/*", c => {
    return auth.handler(c.req.raw);
  })
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(api, {
  workspace: workspaceRouter,
  page: pageRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
