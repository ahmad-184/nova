import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, ResetPasswordSchema } from "../validations";

export const useResetPassword = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (values: ResetPasswordSchema) => {
      setError(null);
      const email = searchParams.get("email");
      if (!email) throw new Error("Please provide an email address");
      const { data, error } = await authClient.emailOtp.resetPassword({
        otp: values.otp,
        password: values.password,
        email,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: res => {
      setError(null);
      if (!res || !res.success) return setError("Something went wrong");
      router.replace("/login");
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
