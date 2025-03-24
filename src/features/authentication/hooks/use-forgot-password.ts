import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, ForgotPasswordSchema } from "../validations";

export const useForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (values: ForgotPasswordSchema) => {
      setError(null);
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: values.email,
        type: "forget-password",
      });
      if (error) throw new Error(error.message);
      return { ...data, email: values.email };
    },
    onSuccess: res => {
      setError(null);
      if (!res || !res.success) return setError("Something went wrong");
      router.push(`/reset-password?email=${res.email}`);
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
