import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");

  return redirect(`/${user.id}`);
}
