import { j } from "./jstack";

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(api, {});

export type AppRouter = typeof appRouter;

export default appRouter;
