// app/page.tsx
import { redirect } from "next/navigation"; // adjust the import if needed
import { getNavLinks } from "../layout.config";

export default async function HomePage() {
  const links = await getNavLinks();

  // Find the first valid link
  const firstLink = findFirstLink(links);

  if (!firstLink?.url) {
    return (
      <main className="flex flex-1 flex-col justify-center text-center">
        <h1 className="text-xl font-bold mb-4">No Confluence Content Found</h1>
      </main>
    );
  }

  redirect(firstLink.url);
}

// Recursively finds the first link in the nested menu structure
function findFirstLink(links: any[]): any {
  for (const link of links) {
    if (link.type === "link") {
      return link;
    } else if (link.items?.length) {
      const nested = findFirstLink(link.items);
      if (nested) return nested;
    }
  }
  return null;
}
