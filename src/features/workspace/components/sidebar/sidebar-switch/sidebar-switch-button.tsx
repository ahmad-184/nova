import { ChevronDownIcon, ChevronsLeftIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useSidebar } from "@/shared/components/ui/sidebar";
import { useCreatePage } from "@/features/workspace/hooks/use-create-page";
import { useAppSelector } from "@/features/workspace/redux/store";
import useCurrentUser from "../../../hooks/use-current-user";
import WorkspaceIcon from "../../workspace/workspace-icon";

export default function SidebarSwitchButton() {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );
  const activeWorkspace = useAppSelector(
    store => store.workspace.activeWorkspace
  );

  const { user } = useCurrentUser();
  const { toggleSidebar } = useSidebar();

  const { onSubmit } = useCreatePage();

  const createNewPage = () => {
    if (!activeWorkspaceId) return;

    onSubmit({
      workspaceId: activeWorkspaceId,
    });
  };

  if (!activeWorkspace || !user) return null;

  const activeWorkspaceName = activeWorkspace.workspace.name;

  return (
    <div className="flex gap-1 whitespace-nowrap items-center w-full">
      <div className="flex flex-1 mr-1 items-center gap-2 truncate">
        <div>
          <WorkspaceIcon
            className="size-5 text-xs rounded-[3px]"
            name={activeWorkspaceName}
            icon={activeWorkspace.workspace.icon || undefined}
          />
        </div>
        <p className="text-sm truncate select-none ">{activeWorkspaceName}</p>
        <div>
          <ChevronDownIcon
            strokeWidth={1.5}
            className="size-4 text-muted-foreground"
          />
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Button
              onClick={e => {
                e.stopPropagation();
                toggleSidebar();
              }}
              variant="ghost"
              size="icon"
              className="hover:!bg-muted-foreground/10 text-muted-foreground hover:!text-primary group-hover/sidebar:opacity-100 opacity-0 transition-all"
            >
              <ChevronsLeftIcon strokeWidth={1.3} className="size-6" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Close sidebar</p>
          <p className="text-muted-foreground">Ctrl + B</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Button
              onClick={e => {
                e.stopPropagation();
                createNewPage();
              }}
              variant="ghost"
              size="icon"
              className="hover:!bg-muted-foreground/10"
            >
              <div>
                <Icon />
              </div>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" sideOffset={5}>
          Create a new page
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      className="size-[19px]"
    >
      <rect width="24" height="24" fill="none" />
      <g
        fill="none"
        stroke="#e5e5e5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
        color="#e5e5e5"
      >
        <path d="m16.214 4.982l1.402-1.401a1.982 1.982 0 0 1 2.803 2.803l-1.401 1.402m-2.804-2.804l-5.234 5.234c-1.045 1.046-1.568 1.568-1.924 2.205S8.342 14.561 8 16c1.438-.342 2.942-.7 3.579-1.056s1.16-.879 2.205-1.924l5.234-5.234m-2.804-2.804l2.804 2.804" />
        <path d="M21 12c0 4.243 0 6.364-1.318 7.682S16.242 21 12 21s-6.364 0-7.682-1.318S3 16.242 3 12s0-6.364 1.318-7.682S7.758 3 12 3" />
      </g>
    </svg>
  );
};
