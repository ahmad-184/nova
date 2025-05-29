import "server-only";

import { WorkspaceInsert, WorkspaceMemberInsert } from "@/db/schema";
import {
  createWorkspace,
  createWorkspaceMember,
  getUserWorkspaces,
  getWorkspaceMemberByUserIdWorkspaceId,
  getWorkspaceMemberByUserId,
} from "@/data-access/workspaces";
import { createPageUseCase } from "./pages";

export async function createWorkspaceUseCase(values: WorkspaceInsert) {
  const workspace = await createWorkspace(values);

  if (!workspace) throw new Error("Workspace not created");

  await createWorkspaceMemberUseCase({
    workspaceId: workspace.id,
    userId: values.ownerId,
    role: "FULL_ACCESS",
  });

  await createPageUseCase({
    name: "Getting Started",
    workspaceId: workspace.id,
  });

  return workspace;
}

export async function createWorkspaceMemberUseCase(
  values: WorkspaceMemberInsert
) {
  return createWorkspaceMember(values);
}

export async function getUserWorkspacesUseCase(userId: string) {
  return getUserWorkspaces(userId);
}

export async function getWorkspaceMemberByUserIdWorkspaceIdUseCase(
  userId: string,
  workspaceId: string
) {
  return await getWorkspaceMemberByUserIdWorkspaceId(userId, workspaceId);
}

export async function getWorkspaceMemberByUserIdUseCase(userId: string) {
  return await getWorkspaceMemberByUserId(userId);
}
