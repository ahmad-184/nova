import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getErrorInfo } from "@/helpers/error";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useLoginMutation, useSendVerificationOtpMutation } from "../redux/api";
import { changeLoginProcessAction } from "../redux/slices/auth.slice";
import { emailSchema, loginSchema, LoginSchema } from "../validations";

export const useLogin = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const loginProcess = useAppSelector(store => store.auth.loginProcess);

  const [login, { isLoading, error: loginError }] = useLoginMutation();
  const [
    sendVerificationOtp,
    { isLoading: verificationLoading, error: sendVerificationOtpError },
  ] = useSendVerificationOtpMutation();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = form.handleSubmit(values => {
    login(values);
  });

  const onSendVerificationOtp = async () => {
    const value = form.getValues("email");
    const { success, data: email, error } = emailSchema.safeParse(value);

    if (!success || !email)
      form.setError("email", {
        message: error?.flatten().formErrors[0] ?? "Invalid email address",
      });

    const { data: result } = await sendVerificationOtp({ email: email! });

    if (result?.email) {
      dispatch(changeLoginProcessAction("login"));
      return router.push(`/verify-email?email=${result.email}`);
    }
  };

  const error = useMemo(() => {
    if (loginError) return getErrorInfo(loginError);
    if (sendVerificationOtpError) return getErrorInfo(sendVerificationOtpError);
  }, [loginError, sendVerificationOtpError]);

  return {
    form,
    error,
    onSubmit,
    isLoading: isLoading,
    sendVerificationOtpLoading: verificationLoading,
    onSendVerificationOtp,
    process: loginProcess,
  };
};
