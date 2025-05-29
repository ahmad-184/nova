import { pageUpdateSchema } from "@/db/schema";
import { z } from "zod";

export const updatePageSchema = pageUpdateSchema.and(
  z.object({
    id: z.string().min(1),
  })
);

export const updateManyPagesSchema = z.array(
  pageUpdateSchema.and(
    z.object({
      id: z.string().min(1),
    })
  )
);

export type UpdateManyPagesSchema = z.infer<typeof updateManyPagesSchema>;
export type UpdatePageSchema = z.infer<typeof updatePageSchema>;
