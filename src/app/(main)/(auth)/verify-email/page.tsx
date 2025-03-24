import { redirect } from "next/navigation";

import VerifyEmailOtp from "@/features/authentication/pages/verify-email-otp";
import { getCurrentUser } from "@/lib/auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const user = await getCurrentUser();
  if (user && user.emailVerified) return redirect("/");

  const { email } = await searchParams;
  if (!email) return redirect("/");

  return <VerifyEmailOtp />;
}
