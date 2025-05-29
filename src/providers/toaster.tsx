import { Toaster as ToasterUI } from "@/shared/components/ui/sonner";

export default function Toaster() {
  return (
    <ToasterUI
      toastOptions={{
        classNames: {
          toast:
            "!bg-neutral-800 !text-neutral-100 !py-2 !px-2 !gap-2 !w-fit !text-sm",
        },
      }}
      position="bottom-center"
    />
  );
}
