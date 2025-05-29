import MainPage from "@/features/workspace/pages/main-page";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ pageId: string }>;
};

export default async function Page({ params }: Props) {
  const { pageId } = await params;

  if (!pageId) return notFound();

  return <MainPage />;
}
