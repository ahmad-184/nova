"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect } from "react";
import { validate } from "uuid";

import { extractUUID } from "@/utils/uuid";
import {
  changePageUrl,
  savePageIdOnCookie,
  setPagesList,
} from "../helpers/page";
import useGetPages from "../hooks/use-get-pages";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  addToTrashAction,
  setActivePageAction,
  setActivePageIdAction,
} from "../redux/slices/page/slice";
import { PageType } from "@/shared/type";
import useGetPage from "../hooks/use-get-page";

type ContextType = {
  switchPage: (pageId: string) => void;
  loading: boolean;
};

const Context = createContext<ContextType>({
  switchPage: () => {},
  loading: false,
});

export const usePages = () => {
  const context = useContext(Context);
  if (!context) throw new Error("usePages must be used within a PageProvider");
  return context;
};

type Props = {
  children: React.ReactNode;
};

export default function PageContextProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );
  const favoritePagesIds = useAppSelector(store => store.page.favoritePagesIds);
  const inTrashPages = useAppSelector(store => store.page.inTrashPages);
  const activePageId = useAppSelector(store => store.page.activePageId);

  const dispatch = useAppDispatch();

  const { data, loading } = useGetPages(activeWorkspaceId);

  const { page: dataForActivePage } = useGetPage(
    activeWorkspaceId,
    activePageId
  );

  const switchPage = useCallback((pageId: string) => {
    changePageUrl(pageId);
  }, []);

  useEffect(() => {
    if (
      !!data.ids.length ||
      !!inTrashPages.length ||
      !!favoritePagesIds.length
    ) {
      setPagesList(dispatch, Object.values(data.entities), favoritePagesIds);
    }
  }, [data.ids, inTrashPages, favoritePagesIds]);

  useEffect(() => {
    if (!data.ids.length) return;
    const pagesInTrashIds = Object.values(data.entities)
      .filter(e => e.inTrash)
      .map(e => e.id);
    if (!pagesInTrashIds.length) return;
    dispatch(addToTrashAction(pagesInTrashIds));
  }, [data.ids]);

  const changeWindowTabDetail = useCallback((data: PageType) => {
    if (!data) return;

    const link =
      document.querySelector<HTMLLinkElement>("link[rel*='icon']") ||
      (document.createElement("link") as HTMLLinkElement);

    const pageName = data.name;
    const pageIcon = data.icon;

    document.title = pageName?.length ? pageName : "New page";

    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = pageIcon || "/favicon.ico";

    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (!dataForActivePage) return;
    changeWindowTabDetail(dataForActivePage);
    dispatch(setActivePageAction(dataForActivePage));
  }, [dataForActivePage]);

  useEffect(() => {
    const pageId = extractUUID(pathname.replaceAll("/", " "));
    if (!pageId || !activeWorkspaceId) return;
    if (!validate(pageId)) router.replace("/");
    if (data.entities[pageId]) dispatch(setActivePageIdAction(pageId));
    savePageIdOnCookie(pageId, activeWorkspaceId);
  }, [pathname, activeWorkspaceId, data.ids]);

  return (
    <Context.Provider
      value={{
        switchPage,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  );
}
