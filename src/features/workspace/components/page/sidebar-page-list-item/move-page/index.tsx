import { useEffect, useMemo, useState } from "react";
import { LockIcon, TriangleAlertIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import useGetWorkspacePages from "@/features/workspace/hooks/use-get-pages";
import SearchInput from "@/shared/components/search-input";
import { createNestedList } from "@/features/workspace/utils/nest-pages";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import WorkspaceIcon from "@/features/workspace/components/workspace/workspace-icon";
import LoaderIcon from "@/shared/components/loader-icon";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import PageListItem from "../../page-list-item";
import { PageType } from "@/shared/type";
import { useAppSelector } from "@/features/workspace/redux/store";
import useGetWorkspaces from "@/features/workspace/hooks/use-get-workspaces";
import { useRegisterClickOutside } from "@/shared/contexts/click-outside-context";
import { useUpdatePage } from "@/features/workspace/hooks/use-update-page";
import useGetPage from "@/features/workspace/hooks/use-get-page";
import PageIcon from "../../page-icon";
import { useCreatePage } from "@/features/workspace/hooks/use-create-page";

type Props = {
  isParent: boolean;
  onClose: () => void;
  page: PageType;
};

export default function MovePage({ isParent, onClose, page }: Props) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [isSelectWorkspaceOpen, setSelectWorkspaceOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const selectRef = useRegisterClickOutside<HTMLDivElement>();
  const containerRef = useRegisterClickOutside<HTMLDivElement>();

  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const { workspaces } = useGetWorkspaces();
  const { data, loading } = useGetWorkspacePages(workspaceId);
  const { onSubmit: updatePage } = useUpdatePage();
  const { onSubmit: createPage } = useCreatePage();

  const switchWorkspace = (id: string) => {
    setWorkspaceId(id);
  };

  const isAnotherWorkspace = Boolean(activeWorkspaceId !== workspaceId);

  const onDuplicateToAnotherWorkspacePage = (toPageId: string | null) => {
    if (!activeWorkspaceId || !workspaceId) return;
    createPage({
      workspaceId,
      parentPageId: toPageId,
      name: page.name,
      icon: page.icon,
    });
  };

  const onMovePage = (toPageId: string) => {
    if (!workspaceId) return;
    if (!!isAnotherWorkspace)
      return onDuplicateToAnotherWorkspacePage(toPageId);
    updatePage({
      id: page.id,
      parentPageId: toPageId,
    });
  };

  const onMovePageToPrivateList = () => {
    if (!workspaceId) return;
    if (!!isAnotherWorkspace) return onDuplicateToAnotherWorkspacePage(null);
    updatePage({
      id: page.id,
      parentPageId: null,
    });
  };

  const onChangeSearchValue = (value: string) => {
    setSearchInput(value);
  };

  const searchedPages = useMemo(() => {
    if (!data) return [];
    const filtered = data
      .map(e => e)
      .filter(
        e =>
          e.id !== page.id &&
          !e.inTrash &&
          (e.name ?? "New page")
            .toLowerCase()
            .includes(searchInput.toLowerCase())
      );
    return JSON.parse(JSON.stringify(filtered)) as PageType[];
  }, [data, searchInput]);

  const defaultPagesList = useMemo(() => {
    const filtered = data
      .map(e => e)
      .filter(e => e.id !== page.id && !e.inTrash);
    const clonedData = JSON.parse(JSON.stringify(filtered)) as PageType[];
    return createNestedList(clonedData);
  }, [data]);

  useEffect(() => {
    if (activeWorkspaceId) setWorkspaceId(activeWorkspaceId);
  }, [activeWorkspaceId]);

  const renderDefault = Boolean(
    !loading && !searchInput.length && !!defaultPagesList.length
  );
  const renderSearched = Boolean(
    !loading && !!searchInput.length && !!searchedPages.length && !!workspaceId
  );
  const renderPrivate = Boolean(
    !!isAnotherWorkspace ? !loading : !isParent && !loading
  );

  return (
    <div
      className="pt-2.5 w-[330px] flex flex-col max-h-[90vh] max-w-[90wh] min-[180px]"
      ref={containerRef}
    >
      <div className="px-2 pb-2">
        <SearchInput
          placeholder="Move page to..."
          className="w-full bg-muted-foreground/10"
          inputClassName="!py-0 h-7"
          onChange={e => onChangeSearchValue(e.target.value)}
        />
      </div>
      <div>
        <div
          className={cn(
            "px-2 w-full mb-3 hidden",
            !!isAnotherWorkspace && "!block"
          )}
        >
          <Alert className="!gap-2 p-2 px-0">
            <AlertDescription className="text-sm text-neutral-300">
              <div>
                <TriangleAlertIcon className="mr-1 inline-block h-4 w-4 !text-yellow-600/80 align-text-bottom self-center" />
                <span>
                  You can only duplicate pages into another workspace — not move
                  them.
                </span>
              </div>
            </AlertDescription>
          </Alert>
        </div>
        <div className="w-full">
          <div className="w-full flex flex-col gap-2 h-96 pb-1 overflow-y-auto pt-3">
            {!!loading && (
              <div className="w-full h-full flex justify-center items-center">
                <LoaderIcon />
              </div>
            )}
            {!loading && (
              <>
                <p className="px-2 text-neutral-500 text-xs select-none">
                  Pages
                </p>
                <div className="w-full flex flex-col gap-[2px]">
                  {!!renderPrivate && (
                    <PrivateList
                      onClick={() => {
                        onClose();
                        onMovePageToPrivateList();
                      }}
                    />
                  )}
                  {!!renderDefault &&
                    defaultPagesList.map((page, idx) => (
                      <PageListItem
                        key={page.id + "_" + idx * Math.random()}
                        workspaceId={workspaceId}
                        page={page}
                        childrenIdx={0}
                        onClick={(pageId: string) => {
                          onClose();
                          onMovePage(pageId);
                        }}
                      />
                    ))}
                  {!!renderSearched && (
                    <SidebarMenu className="gap-[2px]">
                      {searchedPages.map((e, idx) => (
                        <SinglePageItem
                          key={e.id + "_" + idx * Math.random()}
                          pageId={e.id}
                          workspaceId={workspaceId!}
                          onClick={(pageId: string) => {
                            onClose();
                            onMovePage(pageId);
                          }}
                        />
                      ))}
                    </SidebarMenu>
                  )}
                </div>
              </>
            )}
          </div>
          <Separator />
          <div className="py-1 px-1 flex justify-end">
            <Select
              value={workspaceId || undefined}
              open={isSelectWorkspaceOpen}
              onOpenChange={setSelectWorkspaceOpen}
              onValueChange={value => {
                switchWorkspace(value);
              }}
            >
              <SelectTrigger className="text-xs gap-1 border-0 !h-6 px-2 max-w-full rounded-sm !bg-transparent hover:!bg-muted-foreground/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent ref={selectRef}>
                <SelectGroup>
                  {workspaces.map(workspace => (
                    <SelectItem
                      key={workspace.id}
                      value={workspace.workspaceId}
                      className="hover:!bg-muted-foreground/10"
                    >
                      <div className="flex flex-1 items-center gap-1.5 truncate">
                        <span>
                          <WorkspaceIcon
                            name={workspace.workspace.name}
                            icon={workspace.workspace.icon || ""}
                            className="size-4 text-xs rounded-xs"
                          />
                        </span>
                        <span className="flex-1 truncate">
                          {workspace.workspace.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

type PrivatePagesListProps = {
  onClick: () => void;
};

function PrivateList({ onClick }: PrivatePagesListProps) {
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
            onClick?.();
          }}
          className="!rounded-none !py-0 h-7 text-neutral-300 data-[active=true]:bg-muted-foreground/10 data-[active=true]:!text-primary"
        >
          <div className={"w-full flex items-center gap-2"}>
            <div className="flex-1 truncate flex gap-[2px] items-center">
              <div className="pr-1 pl-1">
                <div className="text-[11px] select-none flex items-center text-muted-foreground justify-center border size-4 rounded-full bg-neutral-900">
                  A
                </div>
              </div>
              <p className="text-sm font-[400] select-none truncate">
                Private pages
              </p>
              <div className="ml-1">
                <LockIcon
                  className="size-3 text-muted-foreground"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

type SinglePageItemProps = {
  pageId: string;
  workspaceId: string;
  onClick?: (e: string) => void;
};

function SinglePageItem({ pageId, workspaceId, onClick }: SinglePageItemProps) {
  const { data: page } = useGetPage(workspaceId, pageId);

  if (!page) return null;

  return (
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
          onClick?.(pageId);
        }}
        className="!rounded-none !
        py-0 h-7 text-neutral-300 data-[active=true]:bg-muted-foreground/10 data-[active=true]:!text-primary"
      >
        <div
          className={"w-full flex items-center gap-2"}
          style={{
            paddingLeft: 8,
          }}
        >
          <div className="flex-1 truncate flex gap-[2px] items-center">
            <div className="pr-1 pl-1">
              <PageIcon page={page} />
            </div>
            <span className="text-sm font-[400] select-none truncate">
              {page?.name?.length ? page.name : "New page"}
            </span>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
