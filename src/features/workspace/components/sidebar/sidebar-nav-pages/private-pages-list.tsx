import { useLocalStorage } from "usehooks-ts";
import { EllipsisIcon, PlusIcon } from "lucide-react";

import { createUUID } from "@/utils/uuid";
import { Button } from "@/shared/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useCreatePage } from "@/features/workspace/hooks/use-create-page";
import { useAppSelector } from "@/features/workspace/redux/store";
import SidebarPageItem from "../../page/sidebar-page-list-item";

export default function PrivatePagesList() {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const [isListOpen, setIsListOpen] = useLocalStorage(
    `private-pages-list-open-${activeWorkspaceId}`,
    true
  );

  const nestedPageList = useAppSelector(
    store => store.page.nestedPagePrivateList
  );

  const { onSubmit } = useCreatePage();

  const addPage = () => {
    if (!activeWorkspaceId) return;
    onSubmit({
      id: createUUID(),
      workspaceId: activeWorkspaceId,
    });
  };

  return (
    <SidebarMenu className="gap-[2px]">
      <SidebarMenuItem className="group/private-pages">
        <SidebarMenuButton asChild onClick={() => setIsListOpen(prev => !prev)}>
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-[400] select-none">
              Private
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="hover:!bg-muted-foreground/10 size-5"
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <EllipsisIcon className="text-muted-foreground transition-all group-hover/private-pages:opacity-100 opacity-0" />
              </Button>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:!bg-muted-foreground/10 size-5"
                    onClick={event => {
                      event.stopPropagation();
                      addPage();
                    }}
                  >
                    <PlusIcon className="text-muted-foreground transition-all group-hover/private-pages:opacity-100 opacity-0" />{" "}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={4}>
                  Add a page
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {!!isListOpen &&
        !!nestedPageList.length &&
        nestedPageList.map(page => (
          <SidebarPageItem
            key={page.id}
            page={page}
            listType="private"
            childrenIdx={0}
          />
        ))}
    </SidebarMenu>
  );
}
