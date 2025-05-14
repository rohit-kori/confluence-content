import { NextRequest } from "next/server";
import { getConfluenceSearchResults } from "../../../lib/confluence-search";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing search query" }), {
      status: 400,
    });
  }

  try {
    const results = await getConfluenceSearchResults(query);
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("Failed to search Confluence:", err);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

// import { source } from "@/lib/source";
// import { createFromSource } from "fumadocs-core/search/server";

// export const { GET } = createFromSource(source);
