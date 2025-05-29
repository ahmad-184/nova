import { LoginSchema, ResetPasswordSchema, SignUpSchema } from "./validations";

export type EmailType = string;

export type LoginProcessType = "login" | "email-verification";
export type LoginMutationResponse = { success: boolean };
export type LoginMutationBody = LoginSchema;

export type SignUpProcessType = "sign-up" | "email-verification";

export type SendVerificationOtpMutationResponse = { email: EmailType };
export type SendVerificationOtpMutationBody = { email: EmailType };

export type SignUpMutationResponse = { email: EmailType };
export type SignUpMutationBody = SignUpSchema;

export type VerifyVerificationOtpMutationResponse = {
  emailVerified: boolean;
};
export type VerifyVerificationOtpMutationBody = {
  email: EmailType;
  otp: string;
};

export type ForgotPasswordMutationResponse = {
  email: EmailType;
  success: boolean;
};
export type ForgotPasswordMutationBody = {
  email: EmailType;
};

export type ResetPasswordMutationResponse = {
  success: boolean;
};
export type ResetPasswordMutationBody = ResetPasswordSchema & {
  email: EmailType;
};
