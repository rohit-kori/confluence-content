import { NextRequest } from "next/server";
import { getConfluenceSearchResults } from "../../../lib/confluence-search"; // Create this

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing search query" }), {
      status: 400,
    });
  }

  try {
    const results = await getConfluenceSearchResults(query);
    return results;
  } catch (err: any) {
    console.error("Failed to search Confluence:", err);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
