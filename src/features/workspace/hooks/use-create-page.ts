"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import { createUUID } from "@/utils/uuid";
import { PageInsert, pageInsertSchema } from "@/db/schema";
import { getErrorInfo } from "@/helpers/error";
import { useCreatePageMutation } from "../redux/slices/page/api";
import useCurrentUser from "./use-current-user";

export const useCreatePage = () => {
  const [createPage, { error: mutationError, isLoading: loading }] =
    useCreatePageMutation();

  const { user } = useCurrentUser();

  const onSubmit = (values: PageInsert) => {
    if (!user) return;
    const data = {
      ...values,
      id: createUUID(),
    };
    const { success } = pageInsertSchema.safeParse(data);
    if (!success) return toast.error("Invalid form data");
    createPage(data);
  };

  const error = useMemo(() => getErrorInfo(mutationError), [mutationError]);

  return {
    onSubmit,
    loading,
    error,
  };
};
