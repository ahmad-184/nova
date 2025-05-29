"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import CreateWorkspceForm from "../forms/create-workspace-form";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function CreateWorkspaceModal({ children, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={cn(className)}>{children}</div>
      </DialogTrigger>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>New Workspace</DialogTitle>
          <DialogDescription>
            Enter a name and select an icon for your workspace
          </DialogDescription>
        </DialogHeader>
        <CreateWorkspceForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
