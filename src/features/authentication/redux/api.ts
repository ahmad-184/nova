import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { env } from "@/env";
import { afterLoginUrl } from "@/app-config";
import { authClient } from "@/lib/auth-client";
import {
  changeLoginProcessAction,
  changeSignUpProcessAction,
} from "./slices/auth.slice";
import { PublicError, returnCustomApiError } from "@/helpers/error";
import {
  ForgotPasswordMutationBody,
  ForgotPasswordMutationResponse,
  LoginMutationBody,
  LoginMutationResponse,
  ResetPasswordMutationBody,
  ResetPasswordMutationResponse,
  SendVerificationOtpMutationBody,
  SendVerificationOtpMutationResponse,
  SignUpMutationBody,
  SignUpMutationResponse,
  VerifyVerificationOtpMutationBody,
  VerifyVerificationOtpMutationResponse,
} from "../type";

const baseUrl = `${env.NEXT_PUBLIC_URL}/api`;

export const api = createApi({
  reducerPath: "auth-api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: builder => ({
    login: builder.mutation<LoginMutationResponse, LoginMutationBody>({
      queryFn: async (body, { dispatch }) => {
        try {
          const { data, error } = await authClient.signIn.email({
            email: body.email,
            password: body.password,
            rememberMe: body.rememberMe,
            callbackURL: afterLoginUrl,
          });

          if (error) {
            if (error.code === "EMAIL_NOT_VERIFIED")
              dispatch(changeLoginProcessAction("email-verification"));

            throw new PublicError(
              error.message ?? "Something went wrong, please try again.",
              error.code
            );
          }

          if (!data || !data.user)
            throw new PublicError("Something went wrong, please try again.");

          return { data: { success: true } };
        } catch (error) {
          return returnCustomApiError(error);
        }
      },
    }),
    signUp: builder.mutation<SignUpMutationResponse, SignUpMutationBody>({
      queryFn: async (body, { dispatch }) => {
        try {
          dispatch(changeSignUpProcessAction("sign-up"));

          const { data, error } = await authClient.signUp.email({
            name: `${body.firstName} ${body.lastName}`,
            email: body.email,
            password: body.password,
            image: `https://avatar.iran.liara.run/username?username=${body.firstName}+${body.lastName}`,
          });

          if (error)
            throw new PublicError(
              error.message ?? "Something went wrong, please try again.",
              error.code
            );

          dispatch(changeSignUpProcessAction("email-verification"));

          return {
            data: {
              email: data.user.email,
            },
          };
        } catch (error: unknown) {
          return returnCustomApiError(error);
        }
      },
    }),
    verifyVeridicationOtp: builder.mutation<
      VerifyVerificationOtpMutationResponse,
      VerifyVerificationOtpMutationBody
    >({
      queryFn: async body => {
        try {
          const { data, error } = await authClient.emailOtp.verifyEmail({
            otp: body.otp,
            email: body.email,
          });

          if (error || !data.user)
            throw new PublicError(
              error?.message ?? "Something went wrong.",
              error?.code
            );

          return { data: { emailVerified: data.user.emailVerified } };
        } catch (error: unknown) {
          return returnCustomApiError(error);
        }
      },
    }),
    sendVerificationOtp: builder.mutation<
      SendVerificationOtpMutationResponse,
      SendVerificationOtpMutationBody
    >({
      queryFn: async body => {
        try {
          const { data, error } = await authClient.emailOtp.sendVerificationOtp(
            {
              email: body.email,
              type: "email-verification",
            }
          );

          if (error || !data.success)
            throw new PublicError(
              error?.message ?? "Something went wrong, please try again.",
              error?.code
            );

          return { data: { email: body.email } };
        } catch (error: unknown) {
          return returnCustomApiError(error);
        }
      },
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordMutationResponse,
      ForgotPasswordMutationBody
    >({
      queryFn: async body => {
        try {
          const { data, error } = await authClient.emailOtp.sendVerificationOtp(
            {
              email: body.email,
              type: "forget-password",
            }
          );

          if (error || !data)
            throw new PublicError(
              error?.message ?? "Something went wrong, please try again.",
              error?.code
            );

          return {
            data: {
              email: body.email,
              success: data.success,
            },
          };
        } catch (error: unknown) {
          return returnCustomApiError(error);
        }
      },
    }),
    resetPassword: builder.mutation<
      ResetPasswordMutationResponse,
      ResetPasswordMutationBody
    >({
      queryFn: async body => {
        try {
          const { data, error } = await authClient.emailOtp.resetPassword({
            otp: body.otp,
            password: body.password,
            email: body.email,
          });

          if (error || !data.success)
            throw new PublicError(
              error?.message ?? "Something went wrong, please try again.",
              error?.code
            );

          return {
            data: {
              success: data.success,
            },
          };
        } catch (error: unknown) {
          return returnCustomApiError(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSendVerificationOtpMutation,
  useSignUpMutation,
  useVerifyVeridicationOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = api;
