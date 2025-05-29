import { PageType } from "@/shared/type";

export type NestedList = {
  id: string;
  parentPageId: PageType["parentPageId"];
  children: NestedList[];
};

export function createNestedList(data: PageType[]): NestedList[] {
  const pageMap = new Map<string, NestedList>();

  const pageIds: NestedList[] = data.map((e: PageType) => ({
    id: e.id,
    parentPageId: e.parentPageId,
    children: [],
  }));

  for (const page of pageIds) {
    pageMap.set(page.id, page);
  }

  const rootPages: NestedList[] = [];

  for (const page of pageIds) {
    if (page.parentPageId && pageMap.has(page.parentPageId)) {
      const parentPage = pageMap.get(page.parentPageId)!;
      parentPage.children.push(page);
    } else {
      rootPages.push(page);
    }
  }

  return rootPages;
}
