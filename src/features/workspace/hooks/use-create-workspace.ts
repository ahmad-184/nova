"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createWorkspaceSchema,
  CreateWorkspaceSchema,
} from "@/shared/validations/workspace";
import { useCreateWorkspaceMutation } from "../redux/slices/workspace/api";
import { getErrorInfo } from "@/helpers/error";

type Props = {
  callback?: () => void;
  initialValues?: {
    name: string;
    icon: string;
  };
};

export function useCreateWorkspace({ callback, initialValues }: Props) {
  const [createWorkspace, { isLoading, error: createWorkspaceError }] =
    useCreateWorkspaceMutation();

  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      icon: "",
      ...initialValues,
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    const { data } = await createWorkspace(values);
    if (data?.id) {
      form.reset();
      callback?.();
    }
  });

  const error = useMemo(
    () => getErrorInfo(createWorkspaceError),
    [createWorkspaceError]
  );

  return {
    form,
    onSubmit,
    error,
    loading: isLoading,
  };
}
