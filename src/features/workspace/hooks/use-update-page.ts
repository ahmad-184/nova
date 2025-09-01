import { useMemo } from "react";
import { toast } from "sonner";

import { getErrorInfo } from "@/helpers/error";
import {
  updateManyPagesSchema,
  UpdatePageSchema,
  updatePageSchema,
} from "@/shared/validations/page";
import { useAppSelector } from "../redux/store";
import {
  useUpdateManyPagesMutation,
  useUpdatePageMutation,
} from "../redux/slices/page/api";

export const useUpdatePage = () => {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const [updatePage, { isLoading: loading, error: mutationError }] =
    useUpdatePageMutation();
  const [
    updateManyPages,
    { isLoading: loadingMany, error: mutationErrorMany },
  ] = useUpdateManyPagesMutation();

  const onSubmit = async (values: UpdatePageSchema | UpdatePageSchema[]) => {
    if (!activeWorkspaceId) return;

    const { success, error } = Array.isArray(values)
      ? updateManyPagesSchema.safeParse(values)
      : updatePageSchema.safeParse(values);

    if (!success || error)
      return toast.error(
        error.flatten().formErrors[0] || "Could not update the page."
      );

    if (Array.isArray(values))
      return updateManyPages({
        workspaceId: activeWorkspaceId,
        data: values,
      });
    updatePage({
      workspaceId: activeWorkspaceId,
      data: { ...values },
    });
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
