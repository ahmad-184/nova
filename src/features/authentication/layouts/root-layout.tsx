import Link from "next/link";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen px-5">
      <div className="px-2 w-full flex h-full flex-col gap-3 py-5">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold">
              N<span className="text-muted-foreground">ova</span>
            </span>
          </Link>
        </div>
        <div className="my-auto flex items-center justify-center py-10 flex-col flex-1">
          <div className="w-full flex justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
