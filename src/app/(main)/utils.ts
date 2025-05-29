import { cookies } from "next/headers";

export async function getActiveWorkspaceId() {
  return (await cookies()).get("active_workspace")?.value;
}

export async function getActivePageId(workspaceId?: string) {
  return (await cookies()).get(`active_page_${workspaceId}`)?.value;
}
