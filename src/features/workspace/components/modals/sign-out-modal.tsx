"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/shared/components/ui/alert-dialog";
import LoaderButton from "@/shared/components/loader-button";
import { useUser } from "../../hooks/use-user";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function SignOutModal({ children, className }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signOut } = useUser();

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className={cn(className)}>{children}</div>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Log out of your account?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-center">
          You will need to log back in to access your nova workspaces
        </AlertDialogDescription>
        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-2">
            <LoaderButton
              variant={"destructive"}
              onClick={() => {
                setIsLoading(true);
                signOut();
              }}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Log out
            </LoaderButton>
            <AlertDialogCancel className="dark:bg-transparent hover:bg-accent">
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
