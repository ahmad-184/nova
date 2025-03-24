"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, HomeIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen">
      <div className="flex flex-col">
        <h1 className="text-[150px] font-bold text-muted-foreground">404</h1>
        <p className="text-sm text-muted-foreground">
          We did not found the page you are looking for.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant={"ghost"} onClick={() => router.back()}>
          <ArrowLeft /> Back
        </Button>
        <Link href="/">
          <Button variant={"outline"}>
            <HomeIcon /> Go to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
