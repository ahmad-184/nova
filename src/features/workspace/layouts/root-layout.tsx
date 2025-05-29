import { cookies } from "next/headers";

import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import Sidebar from "../components/sidebar";
import WorkspaceProvider from "../providers/workspace-provider";
import PageProvider from "../providers/page-provider";
import StoreProvider from "../providers/store-provider";

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const cookieStore = await cookies();

  const sidebarState = cookieStore.get("sidebar_state")?.value;
  //* get sidebar width from cookie
  const sidebarWidth = cookieStore.get("sidebar_width")?.value;

  let defaultOpen = true;

  if (sidebarState) {
    defaultOpen = sidebarState === "true";
  }

  return (
    <StoreProvider>
      <WorkspaceProvider>
        <PageProvider>
          <SidebarProvider
            defaultOpen={defaultOpen}
            defaultWidth={sidebarWidth}
          >
            <Sidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </PageProvider>
      </WorkspaceProvider>
    </StoreProvider>
  );
}
