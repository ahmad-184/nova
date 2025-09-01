import { client } from "@/lib/client";
import { PageInsert } from "@/db/schema";
import { PageType, PageUpdate } from "@/shared/type";
import { PublicError, returnCustomApiError } from "@/helpers/error";
import {
  createPageOptimistic,
  createPageData,
  setPagesList,
  updatePageOptimistic,
  deletePageOptimistic,
  updateManyPageOptimistic,
  deleteManyPageOptimistic,
  getChildrenIdsOfPage,
} from "@/features/workspace/helpers/page";
import { api } from "../../api";
import { RootState } from "../../store";

export type PagesApiStateType = PageType[];

export const pagesApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getWorkspacePages: builder.query<
      PagesApiStateType,
      { workspaceId: string }
    >({
      queryFn: async body => {
        try {
          const workspaceId = body.workspaceId;
          const response = await client.page.getWorkspacePages.$get({
            workspaceId: workspaceId,
          });
          const result = await response.json();
          return {
            data: result.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            ),
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      providesTags: (result, _, args) =>
        !!result?.length
          ? [
              ...result.map(({ id }) => ({
                type: "PAGES" as const,
                workspacId: args.workspaceId,
                id,
              })),
              { type: "PAGES", workspaceId: args.workspaceId },
            ]
          : [{ type: "PAGES", workspaceId: args.workspaceId }],
    }),
    createPage: builder.mutation<{ id: string }, PageInsert & { id: string }>({
      queryFn: async values => {
        try {
          if (!values)
            throw new PublicError(
              "Could not create the page, page data needed."
            );
          const res = await client.page.create.$post({
            ...values,
          });
          const body = await res.json();
          return {
            data: body,
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      onQueryStarted: async (values, { dispatch, queryFulfilled }) => {
        const data = createPageData({
          userId: values.id,
          workspaceId: values.workspaceId,
          pageId: values.id,
          parentPageId: values.parentPageId || undefined,
          name: values.name ?? undefined,
          icon: values.icon,
        });
        const patchResult = dispatch(
          createPageOptimistic({
            workspaceId: values.workspaceId,
            values: data,
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updatePage: builder.mutation<
      { id: string } | undefined,
      { data: PageUpdate; workspaceId: string }
    >({
      queryFn: async values => {
        try {
          const res = await client.page.update.$post({
            ...values.data,
          });
          const body = await res.json();
          return {
            data: body,
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      onQueryStarted: async (
        values,
        { dispatch, queryFulfilled, getState }
      ) => {
        const patchResult = dispatch(
          updatePageOptimistic({
            workspaceId: values.workspaceId,
            id: values.data.id,
            values: { ...values.data },
          })
        );

        if (values.data.parentPageId !== undefined) {
          const state = getState() as RootState;
          const { data: pagesData } =
            pagesApiSlice.endpoints.getWorkspacePages.select({
              workspaceId: values.workspaceId,
            })(state);

          if (pagesData?.length)
            setPagesList(dispatch, pagesData, state.page.favoritePagesIds);
        }

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateManyPages: builder.mutation<
      { id: string }[] | undefined,
      { data: PageUpdate[]; workspaceId: string }
    >({
      queryFn: async values => {
        try {
          const res = await client.page.updateMany.$post({
            values: [...values.data],
          });
          const body = await res.json();
          return {
            data: body,
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      onQueryStarted: async (
        values,
        { dispatch, queryFulfilled, getState }
      ) => {
        const patchResult = dispatch(
          updateManyPageOptimistic({
            workspaceId: values.workspaceId,
            data: values.data.map(e => ({
              id: e.id,
              value: { ...e },
            })),
          })
        );

        if (values.data.some(value => value.parentPageId !== undefined)) {
          const state = getState() as RootState;
          const { data: pagesData } =
            pagesApiSlice.endpoints.getWorkspacePages.select({
              workspaceId: values.workspaceId,
            })(state);

          if (pagesData?.length)
            setPagesList(dispatch, pagesData, state.page.favoritePagesIds);
        }

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deletePage: builder.mutation<
      { id: string },
      { id: string; workspaceId: string }
    >({
      queryFn: async values => {
        try {
          const res = await client.page.delete.$post({
            id: values.id,
          });
          const body = await res.json();
          return {
            data: body,
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      onQueryStarted: async (
        values,
        { dispatch, queryFulfilled, getState }
      ) => {
        const state = getState() as RootState;
        const { data: pagesData } =
          pagesApiSlice.endpoints.getWorkspacePages.select({
            workspaceId: values.workspaceId,
          })(state);

        const childrensOfThePage = getChildrenIdsOfPage(
          values.id,
          pagesData || []
        );

        const patchResult1 = dispatch(
          deletePageOptimistic({
            workspaceId: values.workspaceId,
            id: values.id,
          })
        );
        const patchResult2 = dispatch(
          updateManyPageOptimistic({
            workspaceId: values.workspaceId,
            data: childrensOfThePage.map(id => ({
              id,
              value: {
                parentPageId: null,
              },
            })),
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult1.undo();
          patchResult2.undo();
        }
      },
    }),
    deleteManyPages: builder.mutation<
      { ids: string[] },
      { ids: string[]; workspaceId: string }
    >({
      queryFn: async values => {
        try {
          const res = await client.page.deleteMany.$post({
            pageIds: values.ids,
          });
          const body = await res.json();
          return {
            data: body,
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      onQueryStarted: async (
        values,
        { dispatch, queryFulfilled, getState }
      ) => {
        const patchResults = [];
        const state = getState() as RootState;
        const { data: pagesData } =
          pagesApiSlice.endpoints.getWorkspacePages.select({
            workspaceId: values.workspaceId,
          })(state);

        for (const id of values.ids) {
          const childrenIds = getChildrenIdsOfPage(id, pagesData || []);

          const patchResult1 = dispatch(
            deletePageOptimistic({
              workspaceId: values.workspaceId,
              id,
            })
          );
          const patchResult2 = dispatch(
            updateManyPageOptimistic({
              workspaceId: values.workspaceId,
              data: childrenIds.map(id => ({
                id,
                value: {
                  parentPageId: null,
                },
              })),
            })
          );
          patchResults.push(patchResult1, patchResult2);
        }
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach(e => e.undo());
        }
      },
    }),
  }),
});

export const {
  useGetWorkspacePagesQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useUpdateManyPagesMutation,
  useDeleteManyPagesMutation,
} = pagesApiSlice;
