import {
  Page,
  PageCollaborator,
  Workspace,
  WorkspaceMember,
} from "@/db/schema";

export type PageUpdate = Partial<PageType> & { id: string };

export type PageType = Page & {
  collaboratorId: string;
  collaboratorRole: PageCollaborator["role"];
};

export type UserWorkspaceType = WorkspaceMember & {
  workspace: Pick<Workspace, "id" | "name" | "ownerId" | "icon"> & {
    members: Pick<WorkspaceMember, "id" | "role" | "userId">[];
  };
};
