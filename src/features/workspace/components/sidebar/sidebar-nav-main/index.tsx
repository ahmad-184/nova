"use client";

import { HouseIcon, SearchIcon } from "lucide-react";

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
import { Skeleton } from "@/shared/components/ui/skeleton";
import useGetWorkspaces from "@/features/workspace/hooks/use-get-workspaces";
import useCurrentUser from "../../../hooks/use-current-user";

export default function SidebarNavMain() {
  const { loading } = useGetWorkspaces();
  const { loading: userLoading } = useCurrentUser();

  if (loading || userLoading)
    return (
      <SidebarMenu>
        <div className="mt-3 py-1 w-full flex items-center gap-2 px-2">
          <Skeleton className="h-2.5 w-20" />
        </div>
        <div className="w-full py-1 flex items-center gap-2 px-2">
          <Skeleton className="h-2.5 w-20" />
        </div>
      </SidebarMenu>
    );

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-muted-foreground hover:text-muted-foreground active:text-muted-foreground text-sm"
              asChild
            >
              <div>
                <div>
                  <SearchIcon className="size-4" strokeWidth={1.5} />
                </div>
                <span className="select-none">Search</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={15}>
          Search and quickly jump to a page
        </TooltipContent>
      </Tooltip>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="text-muted-foreground hover:text-muted-foreground active:text-muted-foreground text-sm"
          asChild
        >
          <div>
            <div>
              <HouseIcon className="size-4" strokeWidth={1.5} />
            </div>
            <span className="select-none">Home</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </div>
  );
}
