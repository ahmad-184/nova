"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import useCurrentUser from "@/features/workspace/hooks/use-current-user";
import { Skeleton } from "@/shared/components/ui/skeleton";
import useGetWorkspaces from "@/features/workspace/hooks/use-get-workspaces";
import SidebarSwitchButton from "./sidebar-switch-button";
import SidebarSwitchContent from "./sidebar-switch-content";

export default function SidebarSwitch() {
  const [isOpen, setIsOpen] = useState(false);

  const { loading } = useGetWorkspaces();
  const { loading: userLoading } = useCurrentUser();

  const toggleOpen = () => {
    if (loading || userLoading) return;
    setIsOpen(prev => !prev);
  };

  if (loading || userLoading)
    return (
      <div>
        <div className="w-full flex items-center gap-2 px-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-3 flex-1" />
        </div>
      </div>
    );

  return (
    <SidebarMenuItem className={cn((!!loading || !!userLoading) && "hidden")}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {(!!loading || !!userLoading) && (
          <div className="w-full flex items-center gap-2 px-2">
            <Skeleton className="size-6" />
            <Skeleton className="h-3 flex-1" />
          </div>
        )}
        <PopoverTrigger asChild>
          <SidebarMenuButton className={"pr-1"} isActive={isOpen}>
            <SidebarSwitchButton />
          </SidebarMenuButton>
        </PopoverTrigger>
        <PopoverContent className="w-[305px] translate-x-2 p-0 shadow-2xl">
          <SidebarSwitchContent toggleOpen={toggleOpen} />
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  );
}
