import { redirect } from "next/navigation";

import SignUp from "@/features/authentication/pages/sign-up";
import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  const user = await getCurrentUser();
  if (user && user.emailVerified) return redirect("/");

  return <SignUp />;
}
