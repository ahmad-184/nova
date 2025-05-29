"use client";

import { createContext, useCallback, useContext, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { changePageUrl } from "../helpers/page";
import { saveWorkspaceIdOnCookie } from "../helpers/workspace";
import useGetWorkspaces from "../hooks/use-get-workspaces";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setActiveWorkspaceAction,
  setActiveWorkspaceIdAction,
} from "../redux/slices/workspace/slice";

type Contexttype = {
  onSwitchWorkspace: (workspaceId: string) => void;
};

const Context = createContext<Contexttype>({
  onSwitchWorkspace: () => {},
});

export const useWorkspaces = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};

export default function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeWorkspaceId = useAppSelector(
    store => store.workspace.activeWorkspaceId
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();

  const { workspaces } = useGetWorkspaces();

  const onSwitchWorkspace = useCallback(async (workspacId: string) => {
    dispatch(setActiveWorkspaceIdAction(workspacId));
    const pageId = saveWorkspaceIdOnCookie(workspacId);
    if (pageId) return changePageUrl(pageId);
    router.replace("/");
  }, []);

  useEffect(() => {
    if (!workspaces || !workspaces.length) return undefined;

    const workspaceExist = workspaces.find(
      workspace => workspace.workspaceId === activeWorkspaceId
    );

    if (!workspaceExist && workspaces[0]) {
      dispatch(setActiveWorkspaceIdAction(workspaces[0].workspaceId));
      saveWorkspaceIdOnCookie(workspaces[0].workspaceId);
      dispatch(setActiveWorkspaceAction(workspaces[0]));
    }

    if (workspaceExist) dispatch(setActiveWorkspaceAction(workspaceExist));
  }, [workspaces, activeWorkspaceId]);

  useEffect(() => {
    const setActiveWorkspace = searchParams.get("set_active_workspace");
    if (!setActiveWorkspace) return;
    onSwitchWorkspace(setActiveWorkspace);
  }, [searchParams, onSwitchWorkspace]);

  return (
    <Context.Provider
      value={{
        onSwitchWorkspace,
      }}
    >
      {children}
    </Context.Provider>
  );
}
