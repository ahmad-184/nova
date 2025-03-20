import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/providers";
import { applicationDescription, applicationName } from "@/app-confige";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Helvetica Neue",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: applicationName,
  description: applicationDescription,
  icons: [
    { rel: "icon", type: "image/png", sizes: "48x48", url: "/icon?icon.tsx" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
