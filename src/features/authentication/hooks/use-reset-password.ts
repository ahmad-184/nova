import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordSchema, ResetPasswordSchema } from "../validations";
import { useResetPasswordMutation } from "../redux/api";
import { toast } from "sonner";
import { getErrorInfo } from "@/helpers/error";

export const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [resetPassword, { error: resetPasswordError, isLoading }] =
    useResetPasswordMutation();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    const email = searchParams.get("email");
    if (!email) return toast.warning("Please provide an email address");
    const { data } = await resetPassword({ ...values, email });
    if (data?.success) {
      router.replace("/login");
    }
  });

  const error = useMemo(
    () => getErrorInfo(resetPasswordError),
    [resetPasswordError]
  );

  return { form, error, onSubmit, isLoading };
};
