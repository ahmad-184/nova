import {
  Workspace,
  WorkspaceMember,
  Page,
  PageCollaborator,
} from "@/db/schema";
import { PageType } from "@/shared/type";

export type UseWorkspaceMember = Pick<
  WorkspaceMember,
  "id" | "userId" | "role"
>;

export type UserWorkspace = WorkspaceMember & {
  workspace: Pick<Workspace, "id" | "name" | "icon" | "ownerId"> & {
    members: UseWorkspaceMember[];
  };
};

export type PageWithChildren = PageType & {
  children: PageWithChildren[];
};

export type PageCollaboratorWithPage = PageCollaborator & {
  page: Page;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string | null | undefined | undefined;
};

export type PagesListType = "private" | "shared" | "favorites";
