import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { signUpSchema, SignUpSchema } from "../validations";

export const useSignUp = () => {
  const [process, setProcess] = useState<"sign-up" | "email-verification">(
    "sign-up"
  );
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (values: SignUpSchema) => {
      setError(null);
      setProcess("sign-up");
      const { data, error } = await authClient.signUp.email({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        image: `https://avatar.iran.liara.run/username?username=${values.firstName}+${values.lastName}`,
      });
      if (error) throw new Error(error.message);
      setProcess("email-verification");
      const { data: otpResponse, error: otpError } =
        await authClient.emailOtp.sendVerificationOtp({
          email: data.user.email,
          type: "email-verification",
        });
      if (!otpResponse?.success || otpError)
        throw new Error(
          otpError?.message ?? "Failed to send verification code"
        );
      setProcess("sign-up");
      return data;
    },
    onSuccess: response => {
      setError(null);
      router.push(`/verify-email?email=${response.user.email}`);
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
