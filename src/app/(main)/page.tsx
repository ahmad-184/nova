import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { createUUID } from "@/utils/uuid";
import {
  createWorkspaceUseCase,
  getWorkspaceMemberByUserIdUseCase,
  getWorkspaceMemberByUserIdWorkspaceIdUseCase,
} from "@/use-cases/workspaces";
import {
  createPageUseCase,
  getPageCollaboratorByPageIdUserIdUseCase,
  getPageCollaboratorByUserIdUseCase,
  getPageCollaboratorByWorkspaceIdUserIdUseCase,
} from "@/use-cases/pages";
import { PageCollaborator, WorkspaceMember } from "@/db/schema";
import { getActivePageId, getActiveWorkspaceId } from "./utils";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !user.emailVerified) return redirect("/login");

  const activeWorkspaceId = await getActiveWorkspaceId();
  let activePageId = await getActivePageId(activeWorkspaceId);

  let workspaceMember: WorkspaceMember | undefined = undefined;
  let pageCollaborator: PageCollaborator | undefined = undefined;

  if (activeWorkspaceId) {
    workspaceMember = await getWorkspaceMemberByUserIdWorkspaceIdUseCase(
      user.id,
      activeWorkspaceId
    );
  }

  if (!workspaceMember) {
    workspaceMember = await getWorkspaceMemberByUserIdUseCase(user.id);

    if (!workspaceMember) {
      const workspace = await createWorkspaceUseCase({
        name: `${user.name}'s workspace`,
        ownerId: user.id,
      });

      const pageCollaborator =
        await getPageCollaboratorByWorkspaceIdUserIdUseCase(
          workspace.id,
          user.id
        );

      if (pageCollaborator) return redirect(`/${pageCollaborator.pageId}`);

      return redirect(`/`);
    }
  }

  if (activePageId) {
    pageCollaborator = await getPageCollaboratorByPageIdUserIdUseCase(
      activePageId,
      user.id
    );

    if (
      workspaceMember &&
      pageCollaborator &&
      pageCollaborator.workspaceId !== workspaceMember.workspaceId
    )
      return redirect(
        `/${pageCollaborator.pageId}?set_active_workspace=${pageCollaborator.workspaceId}`
      );
  }

  if (!activePageId) {
    pageCollaborator = await getPageCollaboratorByWorkspaceIdUserIdUseCase(
      workspaceMember.workspaceId,
      user.id
    );
  }

  if (!pageCollaborator) {
    if (workspaceMember.role === "GUEST_ACCESS") {
      // Sending user to a unknown page and then deal with problem in client
      return redirect(`/${createUUID()}`);
    }

    pageCollaborator = await getPageCollaboratorByUserIdUseCase(user.id);

    if (pageCollaborator) {
      if (pageCollaborator.workspaceId !== workspaceMember.workspaceId)
        return redirect(
          `/${pageCollaborator.pageId}?set_active_workspace=${pageCollaborator.workspaceId}`
        );

      return redirect(`/${pageCollaborator.pageId}`);
    }

    const page = await createPageUseCase({
      workspaceId: workspaceMember.workspaceId,
    });

    pageCollaborator = await getPageCollaboratorByPageIdUserIdUseCase(
      page.id,
      user.id
    );
  }

  if (!pageCollaborator) throw new Error("What the hell is happening here? 😩");

  if (pageCollaborator.workspaceId !== activeWorkspaceId)
    return redirect(
      `/${pageCollaborator.pageId}?set_active_workspace=${pageCollaborator.workspaceId}`
    );

  return redirect(`/${pageCollaborator.pageId}`);
}
