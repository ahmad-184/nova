import Cookies from "js-cookie";

export const saveWorkspaceIdOnCookie = (workspaceId: string) => {
  Cookies.set("active_workspace", workspaceId, {
    path: "/",
    secure: true,
  });
  const pageId = Cookies.get(`active_page_${workspaceId}`);
  return pageId;
};
