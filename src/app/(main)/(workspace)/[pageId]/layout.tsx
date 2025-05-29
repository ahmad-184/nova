import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import RootLayout from "@/features/workspace/layouts/root-layout";

type Props = {
  children: React.ReactNode;
  params: Promise<{ pageId: string }>;
};

export default async function Layout({ children, params }: Props) {
  const user = await getCurrentUser();
  if (!user || !user.emailVerified) return redirect("/login");

  const { pageId } = await params;

  if (!pageId) return notFound();

  return <RootLayout>{children}</RootLayout>;
}
