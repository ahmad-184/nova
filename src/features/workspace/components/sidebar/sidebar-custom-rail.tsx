"use client";

import { useState } from "react";

import { SidebarRail, useSidebar } from "@/shared/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export default function SidebarCustomRail() {
  const [cursorY, setCursorY] = useState(0);

  const { isDraggingRail } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarRail
          onMouseEnter={e => {
            setCursorY(e.clientY - 373);
          }}
          enableDrag={true}
        />
      </TooltipTrigger>
      <TooltipContent
        side="right"
        style={{
          position: "fixed",
          top: cursorY,
          transform: "translateY(-50%)",
        }}
        className="w-[134px]"
        align="center"
        sideOffset={0}
        hidden={isDraggingRail}
      >
        <p>
          Close <span className="text-muted-foreground">Click or Ctrl+B</span>
        </p>
        <p>
          Resize <span className="text-muted-foreground">Drag</span>
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
