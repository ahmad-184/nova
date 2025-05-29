import "server-only";

import { z } from "zod";

import { workspaceIdSchema } from "@/shared/validations/workspace";
import { j, protectedProcedure } from "../jstack";
import {
  createPageUseCase,
  deleteManyPagesUseCase,
  deletePageUseCase,
  getPageChildrenIdsUseCase,
  getPagesForWorkspaceUseCase,
  updateManyPagesParentPageIdUseCase,
  updateManyPagesUseCase,
  updatePageUseCase,
} from "@/use-cases/pages";
import { pageInsertSchema, pageUpdateSchema } from "@/db/schema";
import {
  updateManyPagesSchema,
  updatePageSchema,
} from "@/shared/validations/page";

const getWorkspacePagesInputSchema = z.object({
  workspaceId: workspaceIdSchema,
});

const pageRouter = j.router({
  getWorkspacePages: protectedProcedure
    .input(getWorkspacePagesInputSchema)
    .query(async ({ c, ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workspaceId } = input;

      const pages = await getPagesForWorkspaceUseCase({
        userId,
        workspaceId,
      });

      return c.superjson(pages);
    }),
  create: protectedProcedure
    .input(pageInsertSchema)
    .outgoing(z.object({ id: z.string().min(1) }))
    .mutation(async ({ c, input }) => {
      const values = input;

      const page = await createPageUseCase({
        ...values,
      });

      return c.superjson(page);
    }),
  update: protectedProcedure
    .input(updatePageSchema)
    .mutation(async ({ c, input }) => {
      const values = input;

      const res = await updatePageUseCase({
        ...values,
      });

      return c.superjson(res);
    }),
  updateMany: protectedProcedure
    .input(
      z.object({
        values: updateManyPagesSchema,
      })
    )
    .mutation(async ({ c, input }) => {
      const values = input.values;

      const res = await updateManyPagesUseCase(values);

      return c.superjson(res);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ c, input }) => {
      const { id } = input;

      const res = await deletePageUseCase(id);

      const childrenIds = await getPageChildrenIdsUseCase(id);

      await updateManyPagesParentPageIdUseCase(
        childrenIds.map(e => e.id),
        null
      );

      return c.superjson({
        id: res,
      });
    }),
  deleteMany: protectedProcedure
    .input(z.object({ pageIds: z.array(z.string().min(1)) }))
    .mutation(async ({ c, input }) => {
      const { pageIds } = input;

      const res = await deleteManyPagesUseCase(pageIds);

      await Promise.all(
        res.map(async id => {
          const childrenIds = await getPageChildrenIdsUseCase(id);
          await updateManyPagesParentPageIdUseCase(
            childrenIds.map(e => e.id),
            null
          );
        })
      );

      return c.superjson({
        ids: res,
      });
    }),
});

export default pageRouter;
