import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { afterLoginUrl } from "@/app-config";
import { loginSchema, LoginSchema } from "../validations";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [process, setProcess] = useState<"login" | "email-verification">(
    "login"
  );

  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [process],
    mutationFn: async (values: LoginSchema) => {
      setError(null);

      if (process === "email-verification") {
        const { data, error } = await authClient.emailOtp.sendVerificationOtp({
          email: values.email,
          type: "email-verification",
          fetchOptions: {
            onSuccess: () => {
              router.push(`/verify-email?email=${values.email}`);
            },
          },
        });
        if (error || !data || !data.success)
          throw new Error(error?.message ?? "something went wrong");
        return data;
      }

      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: afterLoginUrl,
      });

      if (error && error?.code === "EMAIL_NOT_VERIFIED") {
        setProcess("email-verification");
        return;
      }

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: () => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate(values);
  });

  return { form, error, onSubmit, isLoading: isPending, process };
};
