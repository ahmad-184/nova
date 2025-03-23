import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function Page({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");

  return <div>Dashboard</div>;
}
