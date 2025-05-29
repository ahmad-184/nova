import "server-only";

import {
  createWorkspaceUseCase,
  getUserWorkspacesUseCase,
} from "@/use-cases/workspaces";
import { createWorkspaceSchema } from "@/shared/validations/workspace";
import { j, protectedProcedure } from "../jstack";

const workspaceRouter = j.router({
  create: protectedProcedure
    .input(createWorkspaceSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      const workspace = await createWorkspaceUseCase({
        ...input,
        name: !!input.name ? input.name.trim() : `${user.name}'s workspace`,
        ownerId: user.id,
      });
      return c.superjson({
        id: workspace.id,
      });
    }),
  getUserWorkspaces: protectedProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;
    const workspaces = await getUserWorkspacesUseCase(user.id);
    return c.superjson(workspaces);
  }),
});

export default workspaceRouter;
