"use client";

import { SidebarGroupContent } from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import useGetPages from "@/features/workspace/hooks/use-get-pages";
import useGetWorkspaces from "@/features/workspace/hooks/use-get-workspaces";
import { useAppSelector } from "@/features/workspace/redux/store";
import PrivatePagesList from "./private-pages-list";
import FavoritePagesList from "./favorite-pages-list";

export default function SidebarNavPages() {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const { loading: getWorkspacesLoading } = useGetWorkspaces();

  const { loading: getPagesLoading } = useGetPages(activeWorkspaceId);

  if (!!getPagesLoading || !!getWorkspacesLoading)
    return (
      <SidebarGroupContent>
        <div className="mt-3 py-1 w-full flex items-center gap-2 px-2">
          <Skeleton className="h-2.5 w-14" />
        </div>
        <div className="mt-1 w-full flex flex-col gap-2">
          {[55, 65, 79, 75, 45, 60, 80, 70, 65, 100, 95, 95, 45, 85, 76].map(
            (width, index) => (
              <SidebarNavPagesSkeleton
                key={width * index + "_" + index}
                width={`${width}%`}
              />
            )
          )}
        </div>
      </SidebarGroupContent>
    );

  return (
    <SidebarGroupContent>
      <div className="w-full flex flex-col gap-2">
        <PrivatePagesList />
        <FavoritePagesList />
      </div>
    </SidebarGroupContent>
  );
}

const SidebarNavPagesSkeleton = ({ width }: { width: string }) => {
  return (
    <div
      className="w-full flex items-center max-w-full gap-2 px-2"
      style={
        {
          width,
        } as React.CSSProperties
      }
    >
      <Skeleton className="size-5" />
      <Skeleton className="h-3 flex-1" />
    </div>
  );
};
