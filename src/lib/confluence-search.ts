const baseUrl = process.env.CONFLUENCE_BASE_URL!;
const spaceKey = process.env.CONFLUENCE_SPACE_KEY!;
const username = process.env.CONFLUENCE_USERNAME!;
const token = process.env.CONFLUENCE_TOKEN!;
const auth = Buffer.from(`${username}:${token}`).toString("base64");

export async function getConfluenceSearchResults(query: string) {
  const searchUrl = `${baseUrl}/wiki/rest/api/search?cql=space="${spaceKey}" AND type=page AND text~"${query}"&limit=10`;

  const res = await fetch(searchUrl, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Confluence search error:", res.status, errorText);
    return [];
    // throw new Error("Failed to search Confluence");
  }

  const json = await res.json();

  // Transform to Fumadocs-compatible format
  return json.results.map((result: any) => ({
    title: result.title,
    url: `/confluence/${result.content.id}`,
    description: result.excerpt || "", // optional
  }));
}
