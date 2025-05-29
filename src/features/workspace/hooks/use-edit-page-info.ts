import { useRef } from "react";

import { fileIcon } from "@/icons/file-icon";
import { useUpdatePage } from "./use-update-page";
import { useAppSelector } from "../redux/store";

export default function useEditPageInfo(pageId: string) {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const { onSubmit: onUpdatePage, loading } = useUpdatePage();

  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUpdateIcon = (newIcon: string | null) => {
    if (!activeWorkspaceId || !pageId) return;
    onUpdatePage({
      id: pageId,
      workspaceId: activeWorkspaceId,
      icon: newIcon ?? fileIcon,
    });
  };

  const handleUpdateName = (newName: string | null) => {
    if (!activeWorkspaceId || !pageId) return;

    if (timeOutRef.current) clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      onUpdatePage({
        id: pageId,
        workspaceId: activeWorkspaceId,
        name: newName,
      });
    }, 500);
  };

  return {
    updateIcon: handleUpdateIcon,
    updateName: handleUpdateName,
    loading,
  };
}
