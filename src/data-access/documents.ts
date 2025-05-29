import "server-only";

import { database } from "@/db";
import { DocumentInsert, documentInsertSchema, documents } from "@/db/schema";
import { TX } from "./type";

// create a document
export async function createDocument(values: DocumentInsert, tx?: TX) {
  const safevalues = documentInsertSchema.parse(values);

  const [document] = await (tx ?? database)
    .insert(documents)
    .values(safevalues)
    .returning({ id: documents.id });

  if (!document) throw new Error("Failed to create document");

  return document.id;
}
