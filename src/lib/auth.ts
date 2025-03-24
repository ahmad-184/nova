import "server-only";

import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";

import { env } from "@/env";
import { database } from "@/db";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESET_PASSWORD_TOKEN_EXPIRES_IN_S,
  SESSION_MAX_DURATION_S,
  SESSION_REFRESH_INTERVAL_S,
  VERIFICATION_OTP_EXPIRES_IN_S,
  VERIFICATION_OTP_LENGTH,
} from "@/app-config";
import * as schema from "@/db/schema";
import { emailSender } from "./email-sender";

const sendVerificationOTP = async ({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
}) => {
  let subject = "";
  let body = "";

  if (type === "email-verification") {
    subject = "Verification Code";
    body = `Your verification code is ${otp}`;
  }
  if (type === "forget-password") {
    subject = "Reset your password";
    body = `Your password reset code is ${otp}`;
  }
  if (type === "sign-in") {
    subject = "Sign in to your account";
    body = `Your sign in code is ${otp}`;
  }

  const { error, message } = await emailSender({
    email,
    body,
    subject,
  });
  if (error) throw new Error(message);
};

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    autoSignIn: true,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_EXPIRES_IN_S,
  },
  session: {
    expiresIn: SESSION_MAX_DURATION_S,
    updateAge: SESSION_REFRESH_INTERVAL_S,
  },
  plugins: [
    nextCookies(),
    emailOTP({
      sendVerificationOTP,
      expiresIn: VERIFICATION_OTP_EXPIRES_IN_S,
      otpLength: VERIFICATION_OTP_LENGTH,
    }),
  ],
});

export async function validateRequest() {
  const response = await auth.api.getSession({ headers: await headers() });
  if (!response) return null;
  const { user } = response;
  if (!user) return null;
  return response;
}

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session) return null;
  return session.user;
});
