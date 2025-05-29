import { useDispatch, useSelector, useStore } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { type PersistConfig, persistReducer } from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";

import { api } from "./api";
import pageReducer, { PageState } from "./slices/page/slice";
import workspaceReducer, { WorkspaceState } from "./slices/workspace/slice";

const pagePersistConfig: PersistConfig<PageState> = {
  key: "page",
  storage: storage,
};

const workspacePersistConfig: PersistConfig<WorkspaceState> = {
  key: "workspace",
  storage: storage,
};

const persistedPageReducer = persistReducer(pagePersistConfig, pageReducer);
const persistedWorkspaceReducer = persistReducer(
  workspacePersistConfig,
  workspaceReducer
);

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  page: persistedPageReducer,
  workspace: persistedWorkspaceReducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers({
        autoBatch: { type: "tick" },
      }),
  });

  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
