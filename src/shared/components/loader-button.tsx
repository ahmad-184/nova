import { LoaderCircle } from "lucide-react";

import { Button, buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

export default function LoaderButton({
  children,
  isLoading,
  className,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  return (
    <Button
      disabled={isLoading}
      type="submit"
      {...props}
      className={cn("flex gap-2 justify-center px-3", className)}
    >
      {isLoading && <LoaderCircle className="animate-spin w-4 h-4" />}
      {children}
    </Button>
  );
}
