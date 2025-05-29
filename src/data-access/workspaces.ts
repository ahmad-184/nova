import "server-only";

import { and, eq } from "drizzle-orm";

import {
  WorkspaceInsert,
  workspaceInsertSchema,
  WorkspaceMemberInsert,
  workspaceMemberInsertSchema,
  workspaceMembers,
  workspaces,
} from "@/db/schema";
import { database } from "@/db";
import { TX } from "./type";

// create a workspace
export async function createWorkspace(values: WorkspaceInsert) {
  const validatedValues = workspaceInsertSchema.parse(values);

  const [workspace] = await database
    .insert(workspaces)
    .values(validatedValues)
    .returning({
      id: workspaces.id,
    });

  return workspace;
}

// create a workspace member
export async function createWorkspaceMember(values: WorkspaceMemberInsert) {
  const validatedValues = workspaceMemberInsertSchema.parse(values);

  const [workspaceMember] = await database
    .insert(workspaceMembers)
    .values(validatedValues)
    .returning({ id: workspaceMembers.id });

  return workspaceMember;
}

// get user workspaces with their members
export async function getUserWorkspaces(userId: string) {
  return await database.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.userId, userId),
    with: {
      workspace: {
        columns: {
          id: true,
          name: true,
          icon: true,
          ownerId: true,
        },
        with: {
          members: {
            columns: {
              id: true,
              userId: true,
              role: true,
            },
          },
        },
      },
    },
  });
}

// get workspace members
export async function getWorkspaceMembers(workspaceId: string, tx?: TX) {
  return await (tx ?? database).query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
  });
}

export async function getWorkspaceMemberByUserIdWorkspaceId(
  userId: string,
  workspaceId: string
) {
  return database.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.userId, userId),
      eq(workspaceMembers.workspaceId, workspaceId)
    ),
  });
}

export async function getWorkspaceMemberByUserId(userId: string) {
  return database.query.workspaceMembers.findFirst({
    where: eq(workspaceMembers.userId, userId),
  });
}
