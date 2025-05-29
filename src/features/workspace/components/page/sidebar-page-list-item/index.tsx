import { memo, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { createUUID } from "@/utils/uuid";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useCreatePage } from "@/features/workspace/hooks/use-create-page";
import { usePages } from "@/features/workspace/providers/page-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { NestedList } from "@/features/workspace/utils/nest-pages";
import useGetPage from "@/features/workspace/hooks/use-get-page";
import {
  useAppDispatch,
  useAppSelector,
} from "@/features/workspace/redux/store";
import {
  addToFavoritesAction,
  removeFromFavoritesAction,
} from "@/features/workspace/redux/slices/page/slice";
import { ClickOutsideProvider } from "@/shared/contexts/click-outside-context";
import { PagesListType } from "@/features/workspace/type";
import { getChildrenIdsOfPage } from "@/features/workspace/helpers/page";
import useGetPages from "@/features/workspace/hooks/use-get-pages";
import MenuActions from "./menu-actions";
import HiddenButtons from "./hidden-buttons";
import MovePage from "./move-page";
import OpenListArrow from "./open-list-arrow";
import FloatingPageInfoEdit from "../edit-page-icon-name";

type Props = {
  page: NestedList;
  childrenIdx: number;
  listType: PagesListType;
};

const leftPadding = 7;

const SidebarPageItem = ({ page, childrenIdx = 0, listType }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMovePageOpen, setIsMovePageOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);

  const [isListOpen, setIsListOpen] = useLocalStorage(
    `sidebar-page-${page.id}-is-${listType}-list-open`,
    false
  );

  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );
  const activePageId = useAppSelector(store => store.page.activePageId);
  const favoritePagesIds = useAppSelector(store => store.page.favoritePagesIds);

  const dispatch = useAppDispatch();

  const { page: data } = useGetPage(activeWorkspaceId, page.id);
  const { data: allPages } = useGetPages(activeWorkspaceId);

  const { switchPage } = usePages();
  const { onSubmit } = useCreatePage();

  const createNewPage = () => {
    if (!activeWorkspaceId) return;

    if (!isListOpen) setIsListOpen(true);

    onSubmit({
      id: createUUID(),
      workspaceId: activeWorkspaceId,
      parentPageId: page.id,
    });
  };

  const handleSwitchPage = () => {
    if (!activeWorkspaceId) return;
    switchPage(page.id);
  };

  const toggleFavorite = () => {
    const pageChildrenIds = getChildrenIdsOfPage(
      page.id,
      Object.values(allPages.entities)
    );
    if (isFavorite) {
      dispatch(removeFromFavoritesAction([page.id, ...pageChildrenIds]));
    } else {
      dispatch(addToFavoritesAction([page.id, ...pageChildrenIds]));
    }
  };

  const toggleList = () => {
    setIsListOpen(prev => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const openMovePage = () => {
    setIsMovePageOpen(prev => !prev);
  };

  const toggleEditPage = () => {
    setIsEditPageOpen(prev => !prev);
  };

  const isFavorite = useMemo(() => {
    return Boolean(favoritePagesIds.find(e => e === page.id) ?? false);
  }, [data, favoritePagesIds]);

  const isActive = Boolean(activePageId === page.id);
  const isParent = Boolean(!page.parentPageId);

  const showAddPage = Boolean(listType !== "favorites");
  const showMovePage = Boolean(true);
  const showMoveToTrash = Boolean(listType !== "favorites");
  const showDuplicate = Boolean(listType !== "favorites");

  const isThereChildrens = Boolean(!!isListOpen && !!page.children.length);
  const noChildrens = Boolean(!!isListOpen && !page.children.length);

  useEffect(() => {
    if (!!page.children.length) {
      const isAnyChildOpen = isChildOpen(page);
      if (isAnyChildOpen === true) {
        setIsListOpen(true);
      } else {
        if (!activePageId) return;
        const isActive = isChildActive(page, activePageId);
        if (isActive) setIsListOpen(true);
      }
    }
  }, []);

  const onClickOutside = () => {
    setIsMovePageOpen(false);
    setIsEditPageOpen(false);
  };

  return (
    <SidebarMenu className="gap-[2px]">
      <DropdownMenu modal open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Popover modal={false} open={!!isMovePageOpen || !!isEditPageOpen}>
          <DropdownMenuTrigger asChild disabled>
            <PopoverTrigger asChild disabled>
              <SidebarMenuItem
                onClick={event => {
                  event.stopPropagation();
                }}
                className="group/private-pages"
              >
                <SidebarMenuButton
                  asChild
                  onClick={event => {
                    event.stopPropagation();
                    handleSwitchPage();
                  }}
                  isActive={isActive}
                  className="text-muted-foreground data-[active=true]:bg-muted-foreground/10 data-[active=true]:!text-primary"
                >
                  <div
                    className={"w-full flex items-center gap-2"}
                    style={{
                      paddingLeft: leftPadding * childrenIdx + 8,
                    }}
                  >
                    <div className="flex-1 truncate flex gap-1.5 items-center">
                      <div>
                        {!!data?.icon && (
                          <OpenListArrow
                            icon={data?.icon || ""}
                            name={data?.name || ""}
                            isOpen={isListOpen}
                            toggleList={toggleList}
                          />
                        )}
                      </div>
                      <span className="text-sm font-[400] select-none truncate">
                        {data?.name?.length ? data?.name : "New page"}
                      </span>
                    </div>
                    <HiddenButtons
                      toggleMenu={toggleMenu}
                      createNewPage={createNewPage}
                      showAddPage={showAddPage}
                    />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </PopoverTrigger>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="right"
            sideOffset={-30}
            alignOffset={20}
            className="w-64 pointer-events-auto"
            collisionPadding={10}
            avoidCollisions={true}
          >
            <MenuActions
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              page={data}
              toggleMovePage={openMovePage}
              toggleEditPage={toggleEditPage}
              showMovePage={showMovePage}
              showMoveToTrash={showMoveToTrash}
              showDuplicate={showDuplicate}
            />
          </DropdownMenuContent>
          <ClickOutsideProvider onClickOutside={onClickOutside}>
            {!!isMovePageOpen && (
              <PopoverContent
                className="w-fit p-0 pointer-events-auto"
                align="start"
                side="right"
                sideOffset={-30}
                alignOffset={20}
                collisionPadding={10}
                avoidCollisions={true}
              >
                <MovePage
                  isParent={isParent}
                  onClose={openMovePage}
                  page={data}
                />
              </PopoverContent>
            )}
            {!!isEditPageOpen && (
              <PopoverContent
                side="bottom"
                className={"w-fit pointer-events-auto border !p-0"}
                collisionPadding={10}
                onOpenAutoFocus={e => e.preventDefault()}
              >
                <FloatingPageInfoEdit page={data} open={isEditPageOpen} />
              </PopoverContent>
            )}
          </ClickOutsideProvider>
        </Popover>
      </DropdownMenu>

      {!!isThereChildrens &&
        page.children.map(page => (
          <SidebarPageItem
            key={page.id}
            page={page}
            listType={listType}
            childrenIdx={childrenIdx + 1}
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

export default memo(SidebarPageItem);

function isChildOpen(page: NestedList): boolean {
  const isAnyChildOpen = page.children.some(child => {
    const isOpen = localStorage.getItem(
      `sidebar-page-${child.id}-is-list-open`
    ) as string;

    if (!!JSON.parse(isOpen)) return true;

    if (child.children.length) return isChildOpen(child);
  });

  return isAnyChildOpen;
}

function isChildActive(page: NestedList, activePageId: string): boolean {
  return page.children.some(child => {
    const isActive = activePageId === child.id;

    if (isActive) return true;

    if (child.children.length) return isChildActive(child, activePageId);
  });
}
