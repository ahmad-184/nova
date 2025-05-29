import { useMemo } from "react";
import { createSelector } from "@reduxjs/toolkit";

import { UserWorkspaceType } from "@/shared/type";
import { useGetWorkspacesQuery } from "../redux/slices/workspace/api";
import { getErrorInfo } from "@/helpers/error";

export default function useGetWorkspaces() {
  const selectAllPagesSelector = useMemo(() => {
    return createSelector(
      res => res,
      res => res?.data ?? []
    );
  }, []);

  const {
    workspaces,
    isFetching: fetching,
    isLoading: loading,
    error: queryError,
  } = useGetWorkspacesQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      workspaces: selectAllPagesSelector(result) as UserWorkspaceType[],
    }),
  });

  const error = useMemo(() => getErrorInfo(queryError), [queryError]);

  return {
    workspaces,
    loading,
    fetching,
    error,
  };
}
