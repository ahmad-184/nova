import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { verifyEmailOtpSchema, VerifyEmailOtpSchema } from "../validations";
import { useVerifyVeridicationOtpMutation } from "../redux/api";
import { getErrorInfo } from "@/helpers/error";

export const useVerifyEmailOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [verifyEmail, { error: verifyEmailError, isLoading }] =
    useVerifyVeridicationOtpMutation();

  const form = useForm<VerifyEmailOtpSchema>({
    resolver: zodResolver(verifyEmailOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    const email = searchParams.get("email");
    if (!email) return toast.warning("Please provide an email");
    const { data } = await verifyEmail({ email, otp: values.otp });
    if (data) {
      const redirectUrl = searchParams.get("redirectUrl");
      if (redirectUrl) return router.replace(redirectUrl);
      router.replace("/login");
    }
  });

  const error = useMemo(
    () => getErrorInfo(verifyEmailError),
    [verifyEmailError]
  );

  return { form, error, onSubmit, isLoading };
};
