import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import Login from "@/features/authentication/pages/login";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) return redirect("/dashboard");

  return <Login />;
}
