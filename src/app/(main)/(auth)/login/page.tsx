import { redirect } from "next/navigation";

import Login from "@/features/authentication/pages/login";
import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  const user = await getCurrentUser();
  if (user && user.emailVerified) return redirect("/");

  return <Login />;
}
