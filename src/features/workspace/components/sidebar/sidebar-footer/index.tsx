"use client";

import { UserRoundPlusIcon } from "lucide-react";

import useGetWorkspaces from "@/features/workspace/hooks/use-get-workspaces";
import useCurrentUser from "@/features/workspace/hooks/use-current-user";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

export default function SidebarFooter() {
  const { loading } = useGetWorkspaces();
  const { loading: userLoading } = useCurrentUser();

  if (loading || userLoading) return null;

  return (
    <SidebarMenu className="pb-2">
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <div>
            <UserRoundPlusIcon
              className="size-4 text-muted-foreground"
              strokeWidth={1.7}
            />
            <span
              className="text-muted-foreground select-none font-normal"
              style={{
                fontFamily: "SegoeUI !important",
              }}
            >
              Invite member
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
