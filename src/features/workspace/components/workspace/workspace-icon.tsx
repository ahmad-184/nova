import Image from "next/image";

import { cn } from "@/lib/utils";

export default function WorkspaceIcon({
  name,
  icon,
  className,
}: {
  name: string;
  icon?: string;
  className?: string;
}) {
  if (icon)
    return (
      <div
        className={cn("size-10 flex items-center justify-center", className)}
      >
        <Image
          src={icon}
          alt="workspace icon"
          width={40}
          height={40}
          className="size-full"
        />
      </div>
    );

  return (
    <div
      className={cn(
        "size-10 rounded-[5px] select-none font-medium bg-muted-foreground/20 text-xl text-muted-foreground uppercase flex items-center justify-center",
        className
      )}
    >
      {name.split("")[0]}
    </div>
  );
}
