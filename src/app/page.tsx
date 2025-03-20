import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="p-4 flex items-center gap-4">
      <Button variant={"outline"}>Hello</Button>
      <ModeToggle />
    </main>
  );
}
