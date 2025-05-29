"use client";

import { useMemo } from "react";
import { createSelector } from "@reduxjs/toolkit";

import { getErrorInfo } from "@/helpers/error";
import {
  PagesApiStateType,
  useGetWorkspacePagesQuery,
} from "../redux/slices/page/api";
import { PageType } from "@/shared/type";

export default function useGetPage(
  workspaceId: string | null,
  pageId: string | null
) {
  const selectPageSelector = useMemo(() => {
    return createSelector(
      res => res as PagesApiStateType,
      (_, id) => id,
      (res: PagesApiStateType, id: string) => res?.entities[id] ?? undefined
    );
  }, []);

  const {
    page,
    isFetching: loading,
    error: queryError,
  } = useGetWorkspacePagesQuery(
    { workspaceId: workspaceId! },
    {
      skip: Boolean(
        !workspaceId || workspaceId === null || !pageId || pageId === null
      ),
      selectFromResult: result => ({
        ...result,
        page: selectPageSelector(result.data, pageId) as PageType,
      }),
    }
  );

  const error = useMemo(() => getErrorInfo(queryError), [queryError]);

  return {
    page,
    loading,
    error,
  };
}
