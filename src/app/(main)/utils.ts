import { cookies } from "next/headers";

export async function getCurrentWorkspaceIdFromCookie() {
  return (await cookies()).get("active_workspace")?.value;
}

export async function getCurrentPageIdFromCookie(workspaceId?: string) {
  return (await cookies()).get(`active_page_${workspaceId}`)?.value;
}
