import { useLocalStorage } from "usehooks-ts";
import { EllipsisIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useAppSelector } from "@/features/workspace/redux/store";
import SidebarPageItem from "../../page/sidebar-page-list-item";

export default function FavoritePagesList() {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const [isListOpen, setIsListOpen] = useLocalStorage(
    `favorite-pages-list-open-${activeWorkspaceId}`,
    true
  );

  const nestedPageList = useAppSelector(
    store => store.page.nestedPageFavoriteList
  );

  if (!nestedPageList.length) return null;

  return (
    <SidebarMenu className="gap-[2px]">
      <SidebarMenuItem className="group/private-pages">
        <SidebarMenuButton asChild onClick={() => setIsListOpen(prev => !prev)}>
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-[400] select-none">
              Favorites
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
            listType="favorites"
            childrenIdx={0}
          />
        ))}
    </SidebarMenu>
  );
}
