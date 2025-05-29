import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { PublicError, returnCustomApiError } from "@/helpers/error";
import { api } from "../../api";
import { UserType } from "../../../type";

export const userApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    currentUser: builder.query<UserType | undefined, void>({
      queryFn: async () => {
        try {
          const response = await authClient.getSession();
          const user = response.data?.user ?? undefined;

          if (!user) throw new PublicError("Could not get user info.");

          return {
            data: {
              ...user,
              createdAt: user.createdAt.toString(),
              updatedAt: user.updatedAt.toString(),
            },
          };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
      providesTags: ["USER"],
    }),
    signOut: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        try {
          const { data, error } = await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                window.location.href = "/";
              },
              onError: e => {
                toast.error(e.error.message);
              },
            },
          });

          if (error || !data)
            throw new PublicError(
              error?.message ?? "Something went wrong.",
              error?.code
            );

          return { data: { success: data.success } };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
    }),
  }),
});

export const { useCurrentUserQuery, useSignOutMutation } = userApiSlice;
