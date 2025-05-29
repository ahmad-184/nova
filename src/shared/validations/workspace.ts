import { workspaceInsertSchema } from "@/db/schema";
import { z } from "zod";

export const createWorkspaceSchema = workspaceInsertSchema
  .omit({
    ownerId: true,
  })
  .and(z.object({ name: z.string().nullish() }));
export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const workspaceIdSchema = z.string().min(1);
export type WorkspaceIdSchema = z.infer<typeof workspaceIdSchema>;
