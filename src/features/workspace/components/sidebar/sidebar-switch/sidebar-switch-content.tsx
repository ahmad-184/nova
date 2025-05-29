import { useState } from "react";
import {
  CheckIcon,
  PlusIcon,
  SettingsIcon,
  UserRoundPlusIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useUser } from "@/features/workspace/hooks/use-user";
import { useWorkspaces } from "@/features/workspace/providers/workspace-provider";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import WorkspaceIcon from "../../workspace/workspace-icon";
import SignOutModal from "../../modals/sign-out-modal";
import CreateWorkspaceModal from "../../modals/create-workspace-modal";
import { useAppSelector } from "@/features/workspace/redux/store";
import useGetWorkspaces from "@/features/workspace/hooks/use-get-workspaces";
import { ClickOutsideProvider } from "@/shared/contexts/click-outside-context";

type Props = {
  toggleOpen: () => void;
};

export default function SidebarSwitchContent({ toggleOpen }: Props) {
  const activeWorkspace = useAppSelector(
    store => store.workspace.activeWorkspace
  );

  const { workspaces } = useGetWorkspaces();
  const { onSwitchWorkspace } = useWorkspaces();

  const { user } = useUser();

  const [hoveredWorkspace, setHoveredWorkspace] = useState("");

  if (!activeWorkspace || !user) return null;

  const activeWorkspaceName = activeWorkspace.workspace.name;

  return (
    <div className="bg-sidebar w-full h-full">
      <div className="w-full flex items-center gap-2 p-2">
        <div>
          <WorkspaceIcon
            className="size-11"
            name={activeWorkspaceName}
            icon={activeWorkspace.workspace.icon || undefined}
          />
        </div>
        <div className="flex-1 truncate">
          <p className="text-sm truncate">{activeWorkspaceName}</p>
          <p className="text-xs text-muted-foreground truncate">
            {activeWorkspace.workspace.members.length} member
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap p-2">
        <Button
          variant={"outline"}
          size={"sm"}
          className="!bg-transparent hover:!bg-muted-foreground/10"
        >
          <SettingsIcon className="size-4" strokeWidth={1.5} />
          <p>Settings</p>
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className="!bg-transparent hover:!bg-muted-foreground/10"
        >
          <UserRoundPlusIcon className="size-4" strokeWidth={1.5} />
          <p>Invite members</p>
        </Button>
      </div>
      <Separator />
      <div className="w-full">
        <p className="text-xs px-2 pt-2 mb-1 text-muted-foreground">
          {user.email}
        </p>
        <div className="w-full flex flex-col mb-2 px-1">
          {workspaces.map(workspace => {
            const isActive = Boolean(
              workspace.workspaceId === activeWorkspace.workspaceId
            );
            const isHovered = Boolean(
              workspace.workspaceId === hoveredWorkspace
            );

            return (
              <Tooltip key={workspace.workspaceId} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => {
                      if (isActive) return;
                      onSwitchWorkspace(workspace.workspaceId);
                      toggleOpen();
                    }}
                    onMouseOver={() =>
                      setHoveredWorkspace(workspace.workspaceId)
                    }
                    className={buttonVariants({
                      variant: "ghost",
                      className: cn(
                        "w-full justify-start hover:!bg-muted-foreground/10",
                        {
                          "!bg-muted-foreground/10": isHovered,
                        }
                      ),
                    })}
                  >
                    <div>
                      <WorkspaceIcon
                        className="size-5 text-xs"
                        name={workspace.workspace.name}
                        icon={workspace.workspace.icon || undefined}
                      />
                    </div>
                    <p className="flex-1 truncate select-none text-sm">
                      {workspace.workspace.name}
                    </p>
                    {!!isActive && (
                      <div>
                        <CheckIcon className="size-5" strokeWidth={1.1} />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={10}
                  className="!text-muted-foreground"
                >
                  {workspace.workspace.members.length} members
                </TooltipContent>
              </Tooltip>
            );
          })}
          <ClickOutsideProvider onClickOutside={() => {}}>
            <CreateWorkspaceModal>
              <Button
                variant={"ghost"}
                className="hover:!bg-muted-foreground/10 w-full justify-start items-center"
              >
                <div className="flex items-center justify-center bg-muted-foreground/10 size-5 rounded-xs">
                  <PlusIcon
                    className="w-4 text-muted-foreground"
                    strokeWidth={1.3}
                  />
                </div>
                <p className="text-muted-foreground">New workspace</p>
              </Button>
            </CreateWorkspaceModal>
          </ClickOutsideProvider>
        </div>
        <div className="px-2 ">
          <Separator className="mb-2" />
        </div>
        <div className="w-full flex flex-col pb-2 px-1">
          <SignOutModal>
            <Button
              variant={"ghost"}
              className="hover:!bg-muted-foreground/10 hover:text-destructive text-muted-foreground text-xs w-full justify-start items-center"
            >
              Log out
            </Button>
          </SignOutModal>
        </div>
      </div>
    </div>
  );
}
