import { useMemo, useRef } from "react";
import { toast } from "sonner";
import {
  CopyIcon,
  CornerUpRightIcon,
  LinkIcon,
  MoveUpRightIcon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
} from "lucide-react";

import { env } from "@/env";
import { cn } from "@/lib/utils";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/shared/components/ui/dropdown-menu";
import { useUpdatePage } from "@/features/workspace/hooks/use-update-page";
import { Button } from "@/shared/components/ui/button";
import { useCreatePage } from "@/features/workspace/hooks/use-create-page";
import { PageType } from "@/shared/type";
import {
  useAppDispatch,
  useAppSelector,
} from "@/features/workspace/redux/store";
import {
  changePageUrl,
  getChildrenIdsOfPage,
  updateManyPageOptimistic,
} from "@/features/workspace/helpers/page";
import useGetPages from "@/features/workspace/hooks/use-get-pages";
import {
  addToTrashAction,
  removeFromTrashAction,
} from "@/features/workspace/redux/slices/page/slice";

type Props = {
  isFavorite: boolean;
  toggleFavorite: () => void;
  page: PageType;
  toggleMovePage: () => void;
  toggleEditPage: () => void;
  showMovePage: boolean;
  showMoveToTrash: boolean;
  showDuplicate: boolean;
};

export default function MenuActions({
  isFavorite,
  toggleFavorite,
  page,
  toggleMovePage,
  toggleEditPage,
  showMovePage,
  showMoveToTrash,
  showDuplicate,
}: Props) {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );
  const activePageId = useAppSelector(store => store.page.activePageId);

  const dispatch = useAppDispatch();

  const { data: allPages, ids: allPagesIds } = useGetPages(activeWorkspaceId);

  const { onSubmit: onUpdatePage } = useUpdatePage();
  const { onSubmit: onCreatePage } = useCreatePage();

  const timer = useRef<NodeJS.Timeout | null>(null);

  const pageChildrenIds = useMemo(
    () => [page.id, ...getChildrenIdsOfPage(page.id, allPages)],
    [page.id, allPagesIds]
  );

  const handleToTrash = () => {
    if (!activeWorkspaceId) return;

    dispatch(
      updateManyPageOptimistic({
        workspaceId: activeWorkspaceId,
        data: pageChildrenIds.map(id => ({
          id,
          value: {
            inTrash: true,
          },
        })),
      })
    );

    dispatch(addToTrashAction(pageChildrenIds));

    if (activePageId && pageChildrenIds.includes(activePageId)) {
      const findAPageThatIsNotInTrash = allPages.find(
        e => !pageChildrenIds.includes(e.id) && !e.inTrash && e.id !== page.id
      );
      if (findAPageThatIsNotInTrash)
        changePageUrl(findAPageThatIsNotInTrash.id);
    }

    if (timer.current) clearTimeout(timer.current);

    onUpdatePage(pageChildrenIds.map(id => ({ id, inTrash: true })));

    const toastId = toast("Moved to trash", {
      cancel: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (timer.current) clearTimeout(timer.current);
            dispatch(
              updateManyPageOptimistic({
                workspaceId: activeWorkspaceId,
                data: pageChildrenIds.map(id => ({
                  id,
                  value: {
                    inTrash: false,
                  },
                })),
              })
            );
            dispatch(removeFromTrashAction(pageChildrenIds));
            onUpdatePage(pageChildrenIds.map(id => ({ id, inTrash: false })));
            toast.dismiss(toastId);
          }}
        >
          Undo
        </Button>
      ),
      position: "bottom-center",
      duration: 5000,
    });
  };

  const handleCopyLink = () => {
    if (!activeWorkspaceId) return;

    const url = `${env.NEXT_PUBLIC_URL}/${page.id}`;
    navigator.clipboard.writeText(url);
    toast("Copied link to clipboard");
  };

  const handleDuplicate = () => {
    if (!activeWorkspaceId) return;
    onCreatePage({
      name: page.name ?? null,
      workspaceId: activeWorkspaceId,
      icon: page.icon,
      parentPageId: page.parentPageId,
    });
  };

  const handleOpenInNewTab = () => {
    window.open(`${env.NEXT_PUBLIC_URL}/${page.id}`);
  };

  return (
    <div>
      <DropdownMenuItem
        onClick={event => {
          event.stopPropagation();
          toggleFavorite();
        }}
      >
        <div className="flex items-center gap-2">
          {isFavorite ? (
            <StarOffIcon
              strokeWidth={1.5}
              className="text-primary size-[18px]"
            />
          ) : (
            <StarIcon strokeWidth={1.7} className="text-primary size-[17px]" />
          )}
        </div>
        <span>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
      </DropdownMenuItem>
      <div className="px-3">
        <DropdownMenuSeparator />
      </div>
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={event => {
            event.stopPropagation();
            handleCopyLink();
          }}
        >
          <div>
            <LinkIcon strokeWidth={1.7} className="text-primary size-[17px]" />
          </div>
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={event => {
            event.stopPropagation();
            handleDuplicate();
          }}
          className={cn(!showDuplicate && "hidden")}
        >
          <div>
            <CopyIcon strokeWidth={1.7} className="text-primary size-[17px]" />
          </div>
          <span>Duplicate</span>
          <DropdownMenuShortcut className="!text-xs font-light">
            Ctrl+D
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={event => {
            event.stopPropagation();
            toggleEditPage();
          }}
        >
          <div>
            <EditIcon />
          </div>
          <span>Rename</span>
          <DropdownMenuShortcut className="!text-xs font-light">
            Ctrl+⇧+D
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={event => {
            event.stopPropagation();
            toggleMovePage();
          }}
          className={cn(!showMovePage && "hidden")}
        >
          <div>
            <CornerUpRightIcon
              strokeWidth={1.7}
              className="text-primary size-[17px]"
            />
          </div>
          <span>Move to</span>
          <DropdownMenuShortcut className="!text-xs font-light">
            Ctrl+⇧+P
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={event => {
            event.stopPropagation();
            handleToTrash();
          }}
          className={cn(
            "group/trash hover:!text-destructive",
            !showMoveToTrash && "hidden"
          )}
        >
          <div>
            <Trash2Icon
              strokeWidth={1.7}
              className="text-primary size-[17px] group-hover/trash:text-destructive"
            />
          </div>
          <span>Move to Trash</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <div className="px-3">
        <DropdownMenuSeparator />
      </div>
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={event => {
            event.stopPropagation();
            handleOpenInNewTab();
          }}
        >
          <div>
            <MoveUpRightIcon
              strokeWidth={1.7}
              className="text-primary size-[17px]"
            />
          </div>
          <span>Open in new tab</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
}

const EditIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      className="size-[18px]"
    >
      <rect width="24" height="24" fill="none" />
      <g
        fill="none"
        stroke="oklch(0.922 0 0)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        color="oklch(0.922 0 0)"
      >
        <path d="m16.214 4.982l1.402-1.401a1.982 1.982 0 0 1 2.803 2.803l-1.401 1.402m-2.804-2.804l-5.234 5.234c-1.045 1.046-1.568 1.568-1.924 2.205S8.342 14.561 8 16c1.438-.342 2.942-.7 3.579-1.056s1.16-.879 2.205-1.924l5.234-5.234m-2.804-2.804l2.804 2.804" />
        <path d="M21 12c0 4.243 0 6.364-1.318 7.682S16.242 21 12 21s-6.364 0-7.682-1.318S3 16.242 3 12s0-6.364 1.318-7.682S7.758 3 12 3" />
      </g>
    </svg>
  );
};
