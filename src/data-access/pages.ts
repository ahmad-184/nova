import "server-only";

import { and, eq, inArray, isNull, sql } from "drizzle-orm";

import {
  Page,
  PageCollaboratorInsert,
  pageCollaborators,
  PageInsert,
  pageInsertSchema,
  pages,
  workspaceMembers,
} from "@/db/schema";
import { database } from "@/db";
import { createDocument } from "./documents";
import { getWorkspaceMembers } from "./workspaces";
import { PageType, PageUpdate } from "@/shared/type";
import { TX } from "./type";
import {
  updateManyPagesSchema,
  updatePageSchema,
} from "@/shared/validations/page";

// create a page and create a page collaborator for the workspace members
export async function createPage(values: PageInsert) {
  const safeValues = pageInsertSchema.parse(values);

  return await database.transaction(async tx => {
    const [page] = await tx
      .insert(pages)
      .values({
        id: safeValues.id,
        name: safeValues.name,
        icon: safeValues.icon,
        workspaceId: safeValues.workspaceId,
        parentPageId: safeValues.parentPageId || null,
      })
      .returning({
        id: pages.id,
      });

    if (!page) throw new Error("Failed to create page");

    let parentPage: Page | undefined = undefined;
    if (safeValues.parentPageId) {
      parentPage = await getPageById(safeValues.parentPageId, tx);
    }

    const workspaceMembers = await getWorkspaceMembers(
      safeValues.workspaceId,
      tx
    );
    if (!workspaceMembers) throw new Error("Failed to get workspace members");

    let collaborators: string[] = [];
    if (!parentPage) {
      collaborators = workspaceMembers
        .filter(e => e.role !== "GUEST_ACCESS")
        .map(e => e.userId);
    } else {
      collaborators = workspaceMembers.map(e => e.userId);
    }

    const data: PageCollaboratorInsert[] = collaborators.map(userId => ({
      userId,
      pageId: page.id,
      workspaceId: safeValues.workspaceId,
      role: "FULL_ACCESS",
    }));

    await tx.insert(pageCollaborators).values(data);

    await createDocument(
      {
        workspaceId: safeValues.workspaceId,
        pageId: page.id,
      },
      tx
    );

    return page;
  });
}

// get a page by id
export async function getPageById(pageId: string, tx?: TX) {
  return (tx ?? database).query.pages.findFirst({
    where: eq(pages.id, pageId),
  });
}

// get a page collaborator by workspace id and user id
export async function getPageCollaboratorByWorkspaceIdUserId(
  workspaceId: string,
  userId: string
) {
  return database.query.pageCollaborators.findFirst({
    where: and(
      eq(pageCollaborators.workspaceId, workspaceId),
      eq(pageCollaborators.userId, userId)
    ),
  });
}

// get a page collaborator by page id and user id
export async function getPageCollaboratorByPageIdUserId(
  pageId: string,
  userId: string
) {
  return database.query.pageCollaborators.findFirst({
    where: and(
      eq(pageCollaborators.pageId, pageId),
      eq(pageCollaborators.userId, userId)
    ),
  });
}

// get a page collaborator by user id
export async function getPageCollaboratorByUserId(userId: string) {
  return database.query.pageCollaborators.findFirst({
    where: eq(pageCollaborators.userId, userId),
  });
}

// update a page
export async function updatePage(values: PageUpdate, tx?: TX) {
  const safeValues = updatePageSchema.parse(values);

  const [res] = await (tx ?? database)
    .update(pages)
    .set(safeValues)
    .where(eq(pages.id, safeValues.id))
    .returning({ id: pages.id });

  return res;
}

// update many pages
export async function updateManyPages(values: PageUpdate[], tx?: TX) {
  const safeValues = updateManyPagesSchema.parse(values);

  const [res] = await Promise.all(
    safeValues.map(value => {
      return (tx ?? database)
        .update(pages)
        .set(value)
        .where(eq(pages.id, value.id))
        .returning({ id: pages.id });
    })
  );

  return res;
}

// move a page
export async function movePage({
  pageId,
  newParentPageId,
}: {
  pageId: string;
  newParentPageId: string | null | undefined;
}) {
  return await database.transaction(async tx => {
    const res = await updatePage(
      {
        id: pageId,
        parentPageId: newParentPageId,
      },
      tx
    );

    if (!res) throw new Error("Failed to update page");

    return res;
  });
}

export async function getPagesForWorkspace(
  userId: string,
  workspaceId: string
) {
  const roots = await database
    .select({
      id: pages.id,
    })
    .from(pages)
    .innerJoin(
      workspaceMembers,
      and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.workspaceId, workspaceId)
      )
    )
    .innerJoin(
      pageCollaborators,
      and(
        eq(pageCollaborators.pageId, pages.id),
        eq(pageCollaborators.userId, userId),
        eq(pageCollaborators.workspaceId, workspaceId)
      )
    )
    .where(and(isNull(pages.parentPageId), eq(pages.workspaceId, workspaceId)));

  const rootPageIds = roots.map(r => r.id);
  if (rootPageIds.length === 0) return [];

  const rows = await database.execute(sql`
    WITH RECURSIVE subtree AS (
      SELECT
        p.id,
        p.name,
        p.icon,
        p.parent_page_id AS "parentPageId",
        p.workspace_id   AS "workspaceId",
        p.in_trash       AS "inTrash",
        p.is_shared      AS "isShared",
        p.is_published   AS "isPublished",
        p.created_at     AS "createdAt",
        p.updated_at     AS "updatedAt"
      FROM ${pages} p
      WHERE p.id IN (${sql.join(
        rootPageIds.map(id => sql`${id}`),
        sql`,`
      )})

      UNION ALL

      SELECT 
        c.id,
        c.name,
        c.icon,
        c.parent_page_id AS "parentPageId",
        c.workspace_id   AS "workspaceId",
        c.in_trash       AS "inTrash",
        c.is_shared      AS "isShared",
        c.is_published   AS "isPublished",
        c.created_at     AS "createdAt",
        c.updated_at     AS "updatedAt"
      FROM ${pages} c
      JOIN subtree s
        ON c.parent_page_id = s.id
    )
    SELECT
      s.*,
      pc.id   AS "collaboratorId",
      pc.role AS "collaboratorRole"
    FROM subtree s
    LEFT JOIN ${pageCollaborators} pc
      ON pc.page_id     = s.id
    AND pc.workspace_id = ${workspaceId}
    AND pc.user_id      = ${userId}
  `);

  return rows as any as PageType[];
}

export async function deletePage(pageId: string) {
  await database.delete(pages).where(eq(pages.id, pageId));
  return pageId;
}

export async function deleteManyPages(pageIds: string[]) {
  await database.delete(pages).where(inArray(pages.id, pageIds));
  return pageIds;
}

export async function getPageChildrenIds(pageId: string) {
  return database
    .select({
      id: pages.id,
    })
    .from(pages)
    .where(eq(pages.parentPageId, pageId));
}

export async function updateManyPagesParentPageId(
  pageIds: string[],
  parentPageId: string | null
) {
  await database
    .update(pages)
    .set({
      parentPageId,
    })
    .where(inArray(pages.id, pageIds));
}
