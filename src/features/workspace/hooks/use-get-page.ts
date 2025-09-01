"use client";

import { useMemo } from "react";

import { getErrorInfo } from "@/helpers/error";
import { useGetWorkspacePagesQuery } from "../redux/slices/page/api";
import { selectPageSelector } from "../redux/slices/page/slice";

export default function useGetPage(
  workspaceId: string | null,
  pageId: string | null
) {
  const selectPageById = useMemo(
    () => selectPageSelector(pageId ?? ""),
    [pageId]
  );

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
        page: selectPageById(result.data),
      }),
    }
  );

  const error = useMemo(() => getErrorInfo(queryError), [queryError]);

  return {
    data: page,
    loading,
    error,
  };
}
