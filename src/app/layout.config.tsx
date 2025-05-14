import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

const baseUrl = process.env.CONFLUENCE_BASE_URL!;
const spaceKey = process.env.CONFLUENCE_SPACE_KEY!;
const username = process.env.CONFLUENCE_USERNAME!;
const token = process.env.CONFLUENCE_TOKEN!;
const auth = Buffer.from(`${username}:${token}`).toString("base64");
import SearchButton from "./components/search-button";

// Fetches all top-level pages in the Confluence space.
async function getTopLevelPages(): Promise<any[]> {
  const res = await fetch(
    `${baseUrl}/wiki/rest/api/content?spaceKey=${spaceKey}&type=page&expand=ancestors&limit=500`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to fetch top-level pages:", res.status, errorText);
    return [];
  }
  const json = await res.json();

  // removing the ancestor with id 2405073204 (which is the root page)
  const cleanedPages = json.results.map((page: any) => ({
    ...page,
    ancestors: (page.ancestors || []).filter(
      (ancestor: any) => ancestor.id !== "2405073204"
    ),
  }));

  const topLevelPages = cleanedPages.filter(
    (page: any) => page.ancestors.length === 0
  );

  const uniqueAncestors = Array.from(
    new Map(
      topLevelPages
        .filter((a: any) => a.id !== "2405073204" && a.id !== "2405073240")
        .map((a: any) => [a.id, a])
    ).values()
  );

  return uniqueAncestors;
}

// Recursively fetches child pages for a given page ID.
async function getChildPagesRecursive(parentId: string): Promise<any[]> {
  const res = await fetch(
    `${baseUrl}/wiki/rest/api/content/${parentId}/child/page`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      `Failed to fetch children for ${parentId}:`,
      res.status,
      errorText
    );
    return [];
  }

  const json = await res.json();
  const children = json.results;

  const nestedChildren = await Promise.all(
    children.map(async (child: any) => {
      const grandChildren = await getChildPagesRecursive(child.id);
      const hasChildren = grandChildren.length > 0;
      return {
        type: hasChildren ? "menu" : "link",
        text: child.title,
        url: "/confluence/" + child.id,
        ...(hasChildren ? { items: grandChildren } : {}),
      };
    })
  );

  return nestedChildren;
}

// Builds the full menu structure for Fumadocs.
export async function getNavLinks(): Promise<any[]> {
  const topPages = await getTopLevelPages();

  const fullMenu = await Promise.all(
    topPages.map(async (page: any) => {
      const children = await getChildPagesRecursive(page.id);
      return {
        type: "menu",
        text: page.title,
        url: "/confluence/" + page.id,
        items: children,
      };
    })
  );

  return fullMenu;
}

export async function getBaseLayoutOptions(): Promise<BaseLayoutProps> {
  const links = await getNavLinks();

  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <span>Confluence Content</span>
          <div className="mx-5">
            <SearchButton />
          </div>
        </div>
      ),
    },
    links,
  };
}
