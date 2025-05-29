import { PlusIcon, EllipsisIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";

type Props = {
  toggleMenu: () => void;
  createNewPage: () => void;
  showAddPage: boolean;
};

export default function HiddenButtons({
  toggleMenu,
  createNewPage,
  showAddPage,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={event => {
          event.stopPropagation();
          toggleMenu();
        }}
        className={cn(
          "relative hover:!bg-muted-foreground/10 size-5 !ring-0 focus-visible:!ring-0 focus-visible:!outline-none transition-opacity group-hover/private-pages:flex hidden group-hover/private-pages:opacity-100 opacity-0"
        )}
      >
        <EllipsisIcon className="text-muted-foreground" />
      </Button>
      {!!showAddPage && (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="hover:!bg-muted-foreground/10 size-5 transition-all group-hover/private-pages:flex hidden group-hover/private-pages:opacity-100 opacity-0"
              onClick={event => {
                event.stopPropagation();
                createNewPage();
              }}
            >
              <PlusIcon className="text-muted-foreground" />{" "}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            Add a page inside
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
