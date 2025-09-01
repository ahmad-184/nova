"use client";

import { useMemo, useState } from "react";
import { Trash2Icon, UndoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import useGetPages from "@/features/workspace/hooks/use-get-pages";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { PageType } from "@/shared/type";
import { Button } from "@/shared/components/ui/button";
import { useUpdatePage } from "@/features/workspace/hooks/use-update-page";
import { useDeletePage } from "@/features/workspace/hooks/use-delete-page";
import {
  changePageUrl,
  deletePageOptimistic,
  getChildrenIdsOfPage,
  getPagePath,
} from "@/features/workspace/helpers/page";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { removeFromTrashAction } from "@/features/workspace/redux/slices/page/slice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/features/workspace/redux/store";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import LoaderButton from "@/shared/components/loader-button";
import PageIcon from "../page-icon";

type Props = {
  data: PageType;
  onHovered: (id: string) => void;
  hoveredPage: string;
  workspaceId: string;
};

export default function SidebarTrashMenuItem({
  data,
  onHovered,
  hoveredPage,
  workspaceId,
}: Props) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );
  const activePageId = useAppSelector(store => store.page.activePageId);

  const { onSubmit: onUpdatePage } = useUpdatePage();
  const { onSubmit: onDeletePage } = useDeletePage();
  const { data: allPages, ids: allPagesIds } = useGetPages(workspaceId);

  const dispatch = useAppDispatch();

  const pagePath = useMemo(
    () => getPagePath(data.id, allPages),
    [data.id, allPages]
  );

  const pageIdWithChildrenIds = useMemo(
    () => [data.id, ...getChildrenIdsOfPage(data.id, allPages)],
    [data.id, allPagesIds]
  );

  const handleRestore = async () => {
    if (!activeWorkspaceId) return;

    const shouldSetParentPageIdToNull = Boolean(
      !!data.parentPageId &&
        !!allPages.find(e => e.id === data.parentPageId)?.inTrash
    );

    dispatch(removeFromTrashAction(pageIdWithChildrenIds));

    const toUpddate = pageIdWithChildrenIds.map(id => ({
      id,
      inTrash: false,
      ...(id === data.id &&
        shouldSetParentPageIdToNull && {
          parentPageId: null,
        }),
    }));

    await onUpdatePage(toUpddate);
  };

  const handleDelete = async () => {
    dispatch(removeFromTrashAction(pageIdWithChildrenIds));

    dispatch(
      deletePageOptimistic({
        workspaceId,
        id: data.id,
      })
    );

    if (
      activePageId === data.id &&
      pageIdWithChildrenIds.includes(activePageId)
    ) {
      const findAPageThatIsNotInTrash = allPages.find(
        e =>
          !pageIdWithChildrenIds.includes(e.id) &&
          !e.inTrash &&
          e.id !== data.id
      );
      if (findAPageThatIsNotInTrash)
        changePageUrl(findAPageThatIsNotInTrash.id);
    }

    await onDeletePage(data.id);
  };

  const isActive = Boolean(hoveredPage === data.id);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        onClick={event => {
          event.stopPropagation();
          changePageUrl(data.id);
        }}
        isActive={isActive}
        onMouseOver={() => onHovered(data.id)}
        className={cn(
          "h-7 text-muted-foreground data-[active=true]:bg-muted-foreground/10 data-[active=true]:!text-primary !rounded-sm",
          !!pagePath.length && "!h-fit"
        )}
      >
        <div className={"w-full flex items-center px-2 gap-2"}>
          <div className="flex-1 truncate flex gap-2 items-start">
            <div className="flex items-start justify-center relative top-[1.5px]">
              <PageIcon page={{ name: data.name, icon: data.icon }} />
            </div>
            <div
              className={cn(
                "text-sm font-[400] select-none truncate",
                pagePath.length > 1 && "flex flex-col gap-1"
              )}
            >
              <span className="dark:text-neutral-300">
                {data?.name ?? "New page"}
              </span>
              {pagePath.length > 1 && (
                <SidebarTrashMenuItemPath pagePath={pagePath} />
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={event => {
                      event.stopPropagation();
                      handleRestore();
                    }}
                    className={cn(
                      "relative hover:!bg-muted-foreground/10 size-6 !ring-0 focus-visible:!ring-0 focus-visible:!outline-none"
                    )}
                  >
                    <UndoIcon
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Restore from trash</TooltipContent>
            </Tooltip>
            <AlertDialog
              open={isAlertDialogOpen}
              onOpenChange={setIsAlertDialogOpen}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={event => {
                        event.stopPropagation();
                        setIsAlertDialogOpen(true);
                      }}
                      className={cn(
                        "relative hover:!bg-muted-foreground/10 size-6 !ring-0 focus-visible:!ring-0 focus-visible:!outline-none"
                      )}
                    >
                      <Trash2Icon
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Delete from trash</TooltipContent>
              </Tooltip>

              <AlertDialogContent className="w-xs">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center font-semibold">
                    Are you sure you want to delete this page from Trash?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <div className="flex w-full flex-col gap-2">
                    <LoaderButton
                      variant={"destructive"}
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                    >
                      Delete
                    </LoaderButton>
                    <AlertDialogCancel
                      onClick={e => {
                        e.stopPropagation();
                        setIsAlertDialogOpen(false);
                      }}
                    >
                      Cancel
                    </AlertDialogCancel>
                  </div>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

type SidebarTrashMenuItemPathProps = {
  pagePath: PageType[];
};

function SidebarTrashMenuItemPath({ pagePath }: SidebarTrashMenuItemPathProps) {
  const isRootPage = pagePath.length === 1;
  const isTwoPages = pagePath.length === 2;
  const isMoreThanTwoPages = pagePath.length > 2;

  const firstPage = pagePath[0];
  const lastPage = pagePath[pagePath.length - 1];

  if (isRootPage)
    return (
      <span className="text-xs dark:text-neutral-500">
        {firstPage?.name ?? "New page"}
      </span>
    );

  if (isTwoPages)
    return (
      <span className="text-xs dark:text-neutral-500">
        {firstPage?.name ?? "New page"} / {lastPage?.name ?? "New page"}
      </span>
    );

  if (isMoreThanTwoPages)
    return (
      <span className="text-xs dark:text-neutral-500">
        {firstPage?.name ?? "New page"} / ... / {lastPage?.name ?? "New page"}
      </span>
    );

  return null;
}
