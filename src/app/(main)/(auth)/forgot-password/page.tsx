import { redirect } from "next/navigation";

import ForgotPassword from "@/features/authentication/pages/forgot-password";
import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  const user = await getCurrentUser();
  if (user && user.emailVerified) return redirect("/");

  return <ForgotPassword />;
}
