import { useRef } from "react";

import { fileIcon } from "@/icons/file-icon";
import { useUpdatePage } from "./use-update-page";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { setEditingStateAction } from "../redux/slices/page/slice";

export default function useEditPageInfo(pageId: string) {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const dispatch = useAppDispatch();

  const { onSubmit, loading } = useUpdatePage();

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUpdateIcon = (newIcon: string | null) => {
    if (!activeWorkspaceId || !pageId) return;

    dispatch(
      setEditingStateAction({
        id: pageId,
        icon: newIcon ?? undefined,
      })
    );

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      onSubmit({
        id: pageId,
        workspaceId: activeWorkspaceId,
        icon: newIcon ?? fileIcon,
      });
      dispatch(setEditingStateAction(undefined));
    }, 800);
  };

  const handleUpdateName = (newName: string | null) => {
    if (!activeWorkspaceId || !pageId) return;

    dispatch(
      setEditingStateAction({
        id: pageId,
        name: newName ?? undefined,
      })
    );

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      onSubmit({
        id: pageId,
        workspaceId: activeWorkspaceId,
        name: newName,
      });
      dispatch(setEditingStateAction(undefined));
    }, 800);
  };

  return {
    updateIcon: handleUpdateIcon,
    updateName: handleUpdateName,
    loading,
  };
}
