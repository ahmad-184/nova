import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import PageIcon from "../page-icon";

type Props = {
  icon: string;
  name: string;
  toggleList: () => void;
  isOpen: boolean;
};

export default function OpenListArrow({
  icon,
  isOpen,
  name,
  toggleList,
}: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:!bg-muted-foreground/10 size-[22px] p-0 flex"
      onClick={event => {
        event.stopPropagation();
        toggleList();
      }}
    >
      <span className="group-hover/private-pages:hidden block">
        <PageIcon page={{ name, icon }} />
      </span>
      <span className="group-hover/private-pages:block hidden">
        <ChevronRightIcon
          className={cn("size-4 text-neutral-500 transition-all", {
            "rotate-90": isOpen,
          })}
        />
      </span>
    </Button>
  );
}
