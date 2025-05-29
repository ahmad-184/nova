import { useMemo } from "react";
import { validate } from "uuid";

import { getErrorInfo } from "@/helpers/error";
import { useAppSelector } from "../redux/store";
import {
  useDeletePageMutation,
  useDeleteManyPagesMutation,
} from "../redux/slices/page/api";

export const useDeletePage = () => {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const [deletePage, { isLoading: loading, error: mutationError }] =
    useDeletePageMutation();
  const [
    deleteManyPages,
    { isLoading: loadingMany, error: mutationErrorMany },
  ] = useDeleteManyPagesMutation();

  const onSubmit = async (id: string | string[]) => {
    if (!activeWorkspaceId || !id) return;

    const isIdsValid = Array.isArray(id)
      ? id.every(id => validate(id))
      : validate(id);

    if (!isIdsValid) return;

    if (Array.isArray(id)) {
      deleteManyPages({
        workspaceId: activeWorkspaceId,
        ids: id,
      });
    } else {
      deletePage({
        workspaceId: activeWorkspaceId,
        id,
      });
    }
  };

  const error = useMemo(
    () => getErrorInfo(mutationError ?? mutationErrorMany),
    [mutationError, mutationErrorMany]
  );

  return {
    onSubmit,
    loading: loading || loadingMany,
    error,
  };
};
