import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { afterLoginUrl } from "@/app-config";
import { loginSchema, LoginSchema } from "../validations";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: LoginSchema) => {
      setError(null);
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: afterLoginUrl,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: res => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate(values);
  });

  return { form, error, onSubmit, isLoading: isPending };
};
