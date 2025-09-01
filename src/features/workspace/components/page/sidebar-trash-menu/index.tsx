"use client";

import { useMemo, useState } from "react";

import useGetPages from "@/features/workspace/hooks/use-get-pages";
import { useAppSelector } from "@/features/workspace/redux/store";
import { Input } from "@/shared/components/ui/input";
import { SidebarMenu } from "@/shared/components/ui/sidebar";
import SidebarTrashMenuItem from "./sidebar-trash-menu-item";

export default function SidebarTrashMenu() {
  const [search, setSearch] = useState("");

  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );
  const inTrashPages = useAppSelector(store => store.page.inTrashPages);

  const [hoveredPage, setHoveredPage] = useState("");

  const { data: allPages } = useGetPages(activeWorkspaceId);

  const handleSelectHoveredPage = (id: string) => setHoveredPage(id);

  const pages = useMemo(() => {
    if (search.length) {
      return allPages
        .filter(e => !!e.inTrash)
        .filter(e =>
          (e.name ?? "New page").toLowerCase().includes(search.toLowerCase())
        );
    }
    return allPages.filter(e => !!e.inTrash);
  }, [allPages, inTrashPages, search]);

  if (!activeWorkspaceId) return null;

  const isTherePagesInTrash = Boolean(pages.length);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full px-1">
        <Input
          className="w-full !bg-muted-foreground/10"
          placeholder="Search pages in trash"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex w-full flex-1 gap-2">
        <SidebarMenu>
          {!!isTherePagesInTrash &&
            pages.map(page => (
              <SidebarTrashMenuItem
                data={page}
                key={page.id + page.workspaceId}
                onHovered={handleSelectHoveredPage}
                hoveredPage={hoveredPage}
                workspaceId={activeWorkspaceId}
              />
            ))}
          {!isTherePagesInTrash && (
            <div className="w-full flex-1 flex justify-center items-center">
              <span className="text-muted-foreground select-none dark:text-neutral-500 text-sm">
                No pages in trash
              </span>
            </div>
          )}
        </SidebarMenu>
      </div>
    </div>
  );
}
