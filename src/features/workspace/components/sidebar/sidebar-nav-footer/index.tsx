"use client";
import { SettingsIcon, Trash2Icon } from "lucide-react";

import { usePages } from "@/features/workspace/providers/page-provider";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import SidebarTrashMenu from "../../page/sidebar-trash-menu";

export default function SidebarNavFooter() {
  const { loading } = usePages();

  if (loading) return null;

  return (
    <SidebarGroupContent>
      <SidebarMenu className="gap-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-muted-foreground hover:text-muted-foreground active:text-muted-foreground text-sm"
                asChild
              >
                <div>
                  <div>
                    <SettingsIcon className="size-4" strokeWidth={1.5} />
                  </div>
                  <span className="select-none">Settings</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={15}>
            Manage your account and settings
          </TooltipContent>
        </Tooltip>
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuItem>
                <PopoverTrigger asChild>
                  <SidebarMenuButton
                    className="text-muted-foreground hover:text-muted-foreground active:text-muted-foreground text-sm"
                    asChild
                  >
                    <div>
                      <div>
                        <Trash2Icon className="size-4" strokeWidth={1.5} />
                      </div>
                      <span className="select-none">Trash</span>
                    </div>
                  </SidebarMenuButton>
                </PopoverTrigger>
              </SidebarMenuItem>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={15}>
              Restore your pages
            </TooltipContent>
            <PopoverContent
              className="p-1 py-3 pointer-events-auto shadow-2xl w-[400px] rounded-md h-[350px]"
              align="start"
              side="right"
              sideOffset={-10}
              alignOffset={20}
              collisionPadding={10}
              avoidCollisions={true}
            >
              <SidebarTrashMenu />
            </PopoverContent>
          </Tooltip>
        </Popover>
      </SidebarMenu>
    </SidebarGroupContent>
  );
}
