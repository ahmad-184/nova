import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { verifyEmailOtpSchema, VerifyEmailOtpSchema } from "../validations";

export const useVerifyEmailOtp = () => {
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<VerifyEmailOtpSchema>({
    resolver: zodResolver(verifyEmailOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: VerifyEmailOtpSchema) => {
      setError(null);
      const email = searchParams.get("email");
      if (!email) throw new Error("Please provide an email");
      const { data, error } = await authClient.emailOtp.verifyEmail({
        otp: values.otp,
        email,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: res => {
      setError(null);
      if (!res.user.emailVerified || res.user.emailVerified === undefined)
        return setError("Something went wrong");
      const redirectUrl = searchParams.get("redirectUrl");
      if (redirectUrl) return router.replace(redirectUrl);
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
