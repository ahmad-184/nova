import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Page } from "@/db/schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import useEditPageInfo from "@/features/workspace/hooks/use-edit-page-info";
import { useRegisterClickOutside } from "@/shared/contexts/click-outside-context";
import PageIcon from "../page-icon";
import Picker from "../../picker";

type Props = {
  className?: string;
  page: Pick<Page, "icon" | "name" | "id">;
  open: boolean;
};

export default function FloatingPageInfoEdit({ className, page }: Props) {
  const { updateIcon, updateName } = useEditPageInfo(page.id);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRegisterClickOutside<HTMLDivElement>();

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [inputRef, open]);

  return (
    <div className="px-2 py-1" ref={containerRef}>
      <div className={cn("flex gap-1.5", className)}>
        <Picker
          onChangeIcon={e => {
            updateIcon(e.iconUrl);
          }}
          onRemove={() => updateIcon(null)}
        >
          <Button
            variant={"outline"}
            size="icon"
            className="!bg-transparent rounded-xs hover:!bg-muted-foreground/5"
          >
            <PageIcon page={page} />
          </Button>
        </Picker>
        <div className="w-xs">
          <Input
            ref={inputRef}
            className="h-7 rounded-xs bg-muted-foreground/10 border border-border placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
            placeholder={page.name || "New page"}
            defaultValue={page.name || ""}
            onChange={e => {
              updateName(e.target.value ?? null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
