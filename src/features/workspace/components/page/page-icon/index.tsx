import Image from "next/image";

import { Page } from "@/db/schema";
import { cn } from "@/lib/utils";

type Props = {
  page: {
    name: Page["name"];
    icon: Page["icon"];
  };
  className?: string;
};

export default function PageIcon({ page, className }: Props) {
  return (
    <div className={cn("relative size-[17px]", className)}>
      <Image
        src={page?.icon || ""}
        alt={page?.name || ""}
        fill
        className="size-full"
      />
    </div>
  );
}
