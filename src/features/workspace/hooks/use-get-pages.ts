"use client";

import { useMemo } from "react";
import { createSelector } from "@reduxjs/toolkit";

import { getErrorInfo } from "@/helpers/error";
import {
  PagesApiStateType,
  pagesInitialState,
  useGetWorkspacePagesQuery,
} from "../redux/slices/page/api";

export default function useGetPages(workspaceId: string | null | undefined) {
  const selectAllPagesSelector = useMemo(() => {
    return createSelector(
      res => res,
      res => res?.data ?? pagesInitialState
    );
  }, []);

  const {
    allPages,
    isFetching: loading,
    error: queryError,
  } = useGetWorkspacePagesQuery(
    { workspaceId: workspaceId! },
    {
      skip: Boolean(!workspaceId || workspaceId === null),
      selectFromResult: result => ({
        ...result,
        allPages: selectAllPagesSelector(result) as PagesApiStateType,
      }),
    }
  );

  const error = useMemo(() => getErrorInfo(queryError), [queryError]);

  return {
    data: allPages,
    loading,
    error,
  };
}
