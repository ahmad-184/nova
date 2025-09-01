import Cookies from "js-cookie";

import { fileIcon } from "@/icons/file-icon";
import { PageType } from "@/shared/type";
import { pagesApiSlice } from "../redux/slices/page/api";
import { AppDispatch } from "../redux/store";
import {
  setPrivateListAction,
  setFavoriteListAction,
  setSharedListAction,
} from "../redux/slices/page/slice";
import { createNestedList } from "../utils/nest-pages";

export const changePageUrl = (pageId: string) => {
  if (!pageId) return;
  const url = `/${pageId}`;
  window.history.pushState(null, "", url);
};

export const savePageIdInCookie = (pageId: string, workspaceId: string) => {
  Cookies.set(`active_page_${workspaceId}`, pageId, {
    path: "/",
    secure: true,
  });
};

type CreatePageOptimisticProps = {
  userId: string;
  workspaceId: string;
  pageId: string;
  parentPageId?: string;
  name?: string;
  icon?: string | null;
};

export const setPagesList = (
  dispatch: AppDispatch,
  data: PageType[],
  favoritePagesIds: string[]
) => {
  const privatePages = data.filter(e => !e.inTrash);
  const favoritePages = data.filter(
    e => !!favoritePagesIds.includes(e.id) && !e.inTrash
  );
  const sharedPages = data.filter(e => !!e.isShared);

  dispatch(setPrivateListAction(createNestedList(privatePages)));
  dispatch(setFavoriteListAction(createNestedList(favoritePages)));
  dispatch(setSharedListAction(createNestedList(sharedPages)));
};

export const createPageData = ({
  userId,
  workspaceId,
  pageId,
  parentPageId,
  name,
  icon,
}: CreatePageOptimisticProps) => {
  const page: PageType = {
    id: pageId,
    name: name || "New page",
    icon: icon ?? fileIcon,
    inTrash: false,
    isShared: false,
    parentPageId: parentPageId || null,
    workspaceId,
    isPublished: false,
    collaboratorId: userId,
    collaboratorRole: "FULL_ACCESS",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return page;
};

type UpdatePageOptimistic = {
  workspaceId: string;
  id: string;
  values: Partial<PageType>;
};

export const updatePageOptimistic = ({
  workspaceId,
  id,
  values,
}: UpdatePageOptimistic) =>
  pagesApiSlice.util.updateQueryData(
    "getWorkspacePages",
    { workspaceId },
    draft => {
      const page = draft.find(e => e.id === id);
      if (page) {
        Object.assign(page, values);
      }
    }
  );

type UpdateManyPageOptimistic = {
  workspaceId: string;
  data: {
    id: string;
    value: Partial<PageType>;
  }[];
};

export const updateManyPageOptimistic = ({
  workspaceId,
  data,
}: UpdateManyPageOptimistic) =>
  pagesApiSlice.util.updateQueryData(
    "getWorkspacePages",
    { workspaceId },
    draft => {
      const updates = new Map(data.map(({ id, value }) => [id, value]));

      draft.forEach(page => {
        const value = updates.get(page.id);
        if (value) Object.assign(page, value);
      });
    }
  );

type CreatePageOptimistic = {
  workspaceId: string;
  values: PageType;
};

export const createPageOptimistic = ({
  workspaceId,
  values,
}: CreatePageOptimistic) =>
  pagesApiSlice.util.updateQueryData(
    "getWorkspacePages",
    { workspaceId },
    draft => {
      draft.push(values);
    }
  );

type DeletePageOptimistic = {
  workspaceId: string;
  id: string;
};

export const deletePageOptimistic = ({
  workspaceId,
  id,
}: DeletePageOptimistic) =>
  pagesApiSlice.util.updateQueryData(
    "getWorkspacePages",
    { workspaceId },
    draft => {
      const index = draft.findIndex(e => e.id === id);
      if (index !== -1) draft.splice(index, 1);
    }
  );

type DeleteManyPageOptimistic = {
  workspaceId: string;
  ids: string[];
};

export const deleteManyPageOptimistic = ({
  workspaceId,
  ids,
}: DeleteManyPageOptimistic) =>
  pagesApiSlice.util.updateQueryData(
    "getWorkspacePages",
    { workspaceId },
    draft => {
      ids.forEach(id => {
        const index = draft.findIndex(e => e.id === id);
        if (index !== -1) draft.splice(index, 1);
      });
    }
  );

export function getChildrenIdsOfPage(
  pageId: string,
  data: PageType[]
): string[] {
  const descendants: string[] = [];

  function findChildren(id: string) {
    const children = data.filter(p => p.parentPageId === id);
    for (const child of children) {
      descendants.push(child.id);
      findChildren(child.id);
    }
  }

  findChildren(pageId);

  return descendants;
}

export function getPagePath(pageId: string, pagesData: PageType[]): PageType[] {
  const pageMap = new Map<string, PageType>();
  for (const page of pagesData) {
    pageMap.set(page.id, page);
  }

  const path: PageType[] = [];
  let current = pageMap.get(pageId);

  while (current) {
    path.unshift(current); // insert at start to keep order
    current = current.parentPageId
      ? pageMap.get(current.parentPageId)
      : undefined;
  }

  return path;
}
