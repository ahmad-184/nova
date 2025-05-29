import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { forgotPasswordSchema, ForgotPasswordSchema } from "../validations";
import { useForgotPasswordMutation } from "../redux/api";
import { useMemo } from "react";
import { getErrorInfo } from "@/helpers/error";

export const useForgotPassword = () => {
  const router = useRouter();

  const [forgotPassword, { error: forgotPasswordError, isLoading }] =
    useForgotPasswordMutation();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    const { data } = await forgotPassword({
      ...values,
    });
    if (data && data.success) {
      router.push(`/reset-password?email=${data.email}`);
    }
  });

  const error = useMemo(
    () => getErrorInfo(forgotPasswordError),
    [forgotPasswordError]
  );

  return { form, error, onSubmit, isLoading };
};
