import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserWorkspace } from "@/features/workspace/type";

export interface WorkspaceState {
  activeWorkspace: UserWorkspace | undefined;
  activeWorkspaceId: string | null;
}

const initialState: WorkspaceState = {
  activeWorkspace: undefined,
  activeWorkspaceId: null,
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveWorkspaceId: (state, { payload }: PayloadAction<string>) => {
      state.activeWorkspaceId = payload;
    },
    setActiveWorkspace: (state, { payload }: PayloadAction<UserWorkspace>) => {
      state.activeWorkspace = payload;
    },
  },
});

export const {
  setActiveWorkspace: setActiveWorkspaceAction,
  setActiveWorkspaceId: setActiveWorkspaceIdAction,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
