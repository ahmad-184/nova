import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PageType } from "@/shared/type";
import { NestedList } from "@/features/workspace/utils/nest-pages";
import { PagesApiStateType } from "./api";

export interface PageState {
  activePage: PageType | undefined;
  activePageId: string | null;
  inTrashPages: string[];
  editingState: EditingState | undefined;
  favoritePagesIds: string[];
  nestedPagePrivateList: NestedList[];
  nestedPageFavoriteList: NestedList[];
  nestedPageSharedList: NestedList[];
}

type EditingState = {
  id: string;
  name?: string;
  icon?: string;
};

const initialState: PageState = {
  activePageId: null,
  activePage: undefined,
  editingState: undefined,
  favoritePagesIds: [],
  inTrashPages: [],
  nestedPagePrivateList: [],
  nestedPageFavoriteList: [],
  nestedPageSharedList: [],
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setActivePageId: (state, { payload }: PayloadAction<string>) => {
      state.activePageId = payload;
    },
    setActivePage: (state, { payload }: PayloadAction<PageType>) => {
      state.activePage = payload;
    },
    addToFavorites: (state, { payload }: PayloadAction<string | string[]>) => {
      if (typeof payload === "string") {
        if (!state.favoritePagesIds.includes(payload))
          state.favoritePagesIds.push(payload);
      }
      if (Array.isArray(payload)) {
        const ids = [...state.favoritePagesIds, ...payload];
        state.favoritePagesIds = Array.from(new Set(ids));
      }
    },
    removeFromFavorites: (
      state,
      { payload }: PayloadAction<string | string[]>
    ) => {
      if (typeof payload === "string")
        state.favoritePagesIds = state.favoritePagesIds.filter(
          id => id !== payload
        );
      if (Array.isArray(payload))
        state.favoritePagesIds = state.favoritePagesIds.filter(
          id => !payload.includes(id)
        );
    },
    addToTrash: (state, { payload }: PayloadAction<string | string[]>) => {
      if (typeof payload === "string") {
        if (!state.inTrashPages.includes(payload))
          state.inTrashPages.push(payload);
      }
      if (Array.isArray(payload)) {
        const ids = [...state.inTrashPages, ...payload];
        state.inTrashPages = Array.from(new Set(ids));
      }
    },
    removeFromTrash: (state, { payload }: PayloadAction<string | string[]>) => {
      if (typeof payload === "string")
        state.inTrashPages = state.inTrashPages.filter(id => id !== payload);
      if (Array.isArray(payload))
        state.inTrashPages = state.inTrashPages.filter(
          id => !payload.includes(id)
        );
    },
    setPrivateList: (state, { payload }: PayloadAction<NestedList[]>) => {
      state.nestedPagePrivateList = payload;
    },
    setFavoriteList: (state, { payload }: PayloadAction<NestedList[]>) => {
      state.nestedPageFavoriteList = payload;
    },
    setSharedList: (state, { payload }: PayloadAction<NestedList[]>) => {
      state.nestedPageSharedList = payload;
    },
    setEditingState: (
      state,
      { payload }: PayloadAction<EditingState | undefined>
    ) => {
      if (payload === undefined) return (state.editingState = undefined);
      if (payload && !payload.id) return;
      state.editingState = {
        ...state.editingState,
        ...payload,
      };
    },
  },
});

export const {
  addToFavorites: addToFavoritesAction,
  removeFromFavorites: removeFromFavoritesAction,
  setActivePage: setActivePageAction,
  setActivePageId: setActivePageIdAction,
  addToTrash: addToTrashAction,
  removeFromTrash: removeFromTrashAction,
  setFavoriteList: setFavoriteListAction,
  setPrivateList: setPrivateListAction,
  setSharedList: setSharedListAction,
  setEditingState: setEditingStateAction,
} = pageSlice.actions;

export const selectInTrashPageIds = createSelector(
  state => state,
  res => res.page?.inTrashPageIds ?? []
);

export const selectPageSelector = (id: string) =>
  createSelector(
    (res: PagesApiStateType | undefined) => res,
    res => res?.find(e => e.id === id)
  );

export default pageSlice.reducer;
