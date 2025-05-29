import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getErrorInfo } from "@/helpers/error";
import {
  useSendVerificationOtpMutation,
  useSignUpMutation,
} from "../redux/api";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { changeSignUpProcessAction } from "../redux/slices/auth.slice";
import { signUpSchema, SignUpSchema } from "../validations";

export const useSignUp = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const process = useAppSelector(store => store.auth.signUpProcess);

  const [signUp, { error: signUpError, isLoading: signUpLoading }] =
    useSignUpMutation();
  const [
    sendVerificationOtp,
    { error: sendVerificationOtpError, isLoading: sendVerificationOtpLoading },
  ] = useSendVerificationOtpMutation();

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

  const onSubmit = form.handleSubmit(async values => {
    const { data: signUpRes } = await signUp(values);
    if (!signUpRes?.email) return;

    const { data: sendVerificationRes } = await sendVerificationOtp({
      email: signUpRes.email,
    });

    dispatch(changeSignUpProcessAction("sign-up"));

    if (sendVerificationRes)
      router.push(`/verify-email?email=${sendVerificationRes.email}`);
  });

  const error = useMemo(() => {
    if (signUpError || sendVerificationOtpError)
      return getErrorInfo(signUpError || sendVerificationOtpError);
  }, [signUpError, sendVerificationOtpError]);

  const isLoading = Boolean(!!signUpLoading || !!sendVerificationOtpLoading);

  return {
    form,
    error,
    onSubmit,
    isLoading,
    process,
  };
};
