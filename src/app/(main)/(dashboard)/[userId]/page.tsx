import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function Page({ params }: Props) {
  const user = await getCurrentUser();
  if (!user || !user.emailVerified) return redirect("/login");

  const { userId } = await params;

  if (!userId || user.id !== userId) return notFound();

  return <div>Dashboard</div>;
}
