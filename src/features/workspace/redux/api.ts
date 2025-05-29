import { env } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${env.NEXT_PUBLIC_URL}/api`;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["USER", "WORKSPACES", "PAGES"],
  endpoints: () => ({}),
});
