import { LoaderCircle } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="w-full h-screen bg-neutral-900 fixed inset-0 z-50">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex gap-2 items-center justify-center">
          <LoaderCircle className="animate-spin w-7 h-7 text-neutral-400" />
        </div>
      </div>
    </div>
  );
}
