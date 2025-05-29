import { PublicError, returnCustomApiError } from "@/helpers/error";
import { api } from "../../api";
import { client } from "@/lib/client";
import { UserWorkspaceType } from "@/shared/type";
import { CreateWorkspaceSchema } from "@/shared/validations/workspace";

export const workspaceApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getWorkspaces: builder.query<UserWorkspaceType[], undefined>({
      queryFn: async () => {
        try {
          const response = await client.workspace.getUserWorkspaces.$get();
          const body = await response.json();
          if (!body.length) {
            window.location.href = "/";
            throw new PublicError("Could not find any workspace.");
          }
          return {
            data: body.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            ),
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      providesTags: ["WORKSPACES"],
    }),
    createWorkspace: builder.mutation<{ id: string }, CreateWorkspaceSchema>({
      queryFn: async values => {
        try {
          const response = await client.workspace.create.$post(values);
          const body = await response.json();
          if (!body.id) throw new PublicError("Failed to create workspace");
          return {
            data: body,
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      invalidatesTags: ["WORKSPACES"],
    }),
  }),
});

export const { useGetWorkspacesQuery, useCreateWorkspaceMutation } =
  workspaceApiSlice;
