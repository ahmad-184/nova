import RootLayout from "@/features/authentication/layouts/root-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
