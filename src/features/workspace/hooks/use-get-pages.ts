"use client";

import { useMemo } from "react";

import { getErrorInfo } from "@/helpers/error";
import { useGetWorkspacePagesQuery } from "../redux/slices/page/api";

export default function useGetPages(workspaceId: string | null | undefined) {
  const {
    data,
    ids,
    isFetching: loading,
    error: queryError,
  } = useGetWorkspacePagesQuery(
    { workspaceId: workspaceId! },
    {
      skip: Boolean(!workspaceId || workspaceId === null),
      selectFromResult: result => {
        const data = result.data ?? [];
        return {
          ...result,
          data,
          ids: data.map(e => e.id),
        };
      },
    }
  );

  const error = useMemo(() => getErrorInfo(queryError), [queryError]);

  return {
    data,
    ids,
    loading,
    error,
  };
}
