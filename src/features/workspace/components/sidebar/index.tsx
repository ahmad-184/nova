"use client";

import {
  Sidebar as AppSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter as AppSidebarFooter,
  SidebarMenu,
  SidebarGroup,
} from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import SidebarSwitch from "./sidebar-switch";
import SidebarNavMain from "./sidebar-nav-main";
import SidebarNavPages from "./sidebar-nav-pages";
import SidebarFooter from "./sidebar-footer";
import SidebarCustomRail from "./sidebar-custom-rail";
import SidebarNavFooter from "./sidebar-nav-footer";
import { useSidebarContentScrollbar } from "../../hooks/use-sidebar-content-scrollbar";

export default function Sidebar() {
  const { containerRef } = useSidebarContentScrollbar();

  return (
    <TooltipProvider delayDuration={0}>
      <AppSidebar className="group/sidebar">
        <SidebarHeader>
          <SidebarMenu className="gap-0">
            <SidebarSwitch />
            <div className="py-1"></div>
            <SidebarNavMain />
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent
          ref={containerRef}
          className="px-2 overflow-y-auto h-full border-t border-b border-t-transparent/0 border-b-transparent/0 transition-[border-color] duration-200"
        >
          <SidebarGroup className="px-0 pt-1 gap-3">
            <SidebarNavPages />
            <SidebarNavFooter />
          </SidebarGroup>
        </SidebarContent>
        <AppSidebarFooter>
          <SidebarFooter />
        </AppSidebarFooter>
        <SidebarCustomRail />
      </AppSidebar>
    </TooltipProvider>
  );
}
