import { memo, useState } from "react";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { Button } from "@/shared/components/ui/button";
import { NestedList } from "@/features/workspace/utils/nest-pages";
import useGetPage from "@/features/workspace/hooks/use-get-page";
import PageIcon from "../page-icon";

type Props = {
  workspaceId: string | null;
  page: NestedList;
  childrenIdx: number;
  onClick?: (pageId: string) => void;
};

const leftPadding = 7;

const PageListItem = ({
  workspaceId,
  childrenIdx = 0,
  page,
  onClick,
}: Props) => {
  const [isListOpen, setIsListOpen] = useState(false);

  const { page: data } = useGetPage(workspaceId, page.id);

  const toggleList = () => {
    setIsListOpen(prev => !prev);
  };

  const isThereChildrens = Boolean(!!isListOpen && !!page.children.length);
  const noChildrens = Boolean(!!isListOpen && !page.children.length);

  return (
    <SidebarMenu className="gap-[2px]">
      <SidebarMenuItem
        onClick={event => {
          event.stopPropagation();
        }}
        className="group/page"
      >
        <SidebarMenuButton
          asChild
          onClick={event => {
            event.stopPropagation();
            onClick?.(page.id);
          }}
          className="!rounded-none !py-0 h-7 text-neutral-300 data-[active=true]:bg-muted-foreground/10 data-[active=true]:!text-primary"
        >
          <div
            className={"w-full flex items-center gap-2"}
            style={{
              paddingLeft: leftPadding * childrenIdx + 8,
            }}
          >
            <div className="flex-1 truncate flex gap-[2px] items-center">
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:!bg-muted-foreground/10 size-[20px] p-0 flex"
                  onClick={event => {
                    event.stopPropagation();
                    toggleList();
                  }}
                >
                  <ChevronRightIcon
                    className={cn("size-4 text-neutral-500 transition-all", {
                      "rotate-90": isListOpen,
                    })}
                  />
                </Button>
              </div>
              <div className="pr-1">
                <PageIcon page={data} />
              </div>
              <span className="text-sm font-[400] select-none truncate">
                {data?.name?.length ? data.name : "New page"}
              </span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {!!isThereChildrens &&
        page.children.map((page, idx) => (
          <PageListItem
            workspaceId={workspaceId}
            key={page.id + "_" + idx * Math.random()}
            page={page}
            childrenIdx={childrenIdx + 1}
            onClick={onClick}
          />
        ))}

      {!!noChildrens && (
        <div
          className="w-full px-2 py-1"
          style={{
            paddingLeft: leftPadding * childrenIdx + 32,
          }}
        >
          <p className="text-neutral-500 text-[13px] select-none">
            No pages inside
          </p>
        </div>
      )}
    </SidebarMenu>
  );
};

export default memo(PageListItem);
