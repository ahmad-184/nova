import "server-only";

import {
  createPage,
  deleteManyPages,
  deletePage,
  getPageChildrenIds,
  getPageCollaboratorByPageIdUserId,
  getPageCollaboratorByUserId,
  getPageCollaboratorByWorkspaceIdUserId,
  getPagesForWorkspace,
  movePage,
  updateManyPages,
  updateManyPagesParentPageId,
  updatePage,
} from "../data-access/pages";
import { PageInsert } from "@/db/schema";
import { PageUpdate } from "@/shared/type";

export async function createPageUseCase(values: PageInsert) {
  return createPage(values);
}

export async function getPageCollaboratorByWorkspaceIdUserIdUseCase(
  workspaceId: string,
  userId: string
) {
  return getPageCollaboratorByWorkspaceIdUserId(workspaceId, userId);
}

export async function getPageCollaboratorByPageIdUserIdUseCase(
  pageId: string,
  userId: string
) {
  return getPageCollaboratorByPageIdUserId(pageId, userId);
}

type GetUserWorkspacePagesUseCaseProps = {
  workspaceId: string;
  userId: string;
};

export async function getPagesForWorkspaceUseCase({
  userId,
  workspaceId,
}: GetUserWorkspacePagesUseCaseProps) {
  return await getPagesForWorkspace(userId, workspaceId);
}

export async function getPageCollaboratorByUserIdUseCase(userId: string) {
  return getPageCollaboratorByUserId(userId);
}

export async function updatePageUseCase(values: PageUpdate) {
  return updatePage(values);
}

export async function updateManyPagesUseCase(values: PageUpdate[]) {
  return updateManyPages(values);
}

export async function deletePageUseCase(pageId: string) {
  return deletePage(pageId);
}

export async function deleteManyPagesUseCase(pageIds: string[]) {
  return deleteManyPages(pageIds);
}

export async function getPageChildrenIdsUseCase(pageId: string) {
  return getPageChildrenIds(pageId);
}

export async function updateManyPagesParentPageIdUseCase(
  pageIds: string[],
  parentPageId: string | null
) {
  return updateManyPagesParentPageId(pageIds, parentPageId);
}
