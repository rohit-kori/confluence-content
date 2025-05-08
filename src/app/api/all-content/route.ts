// src/app/api/confluence/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const username = process.env.CONFLUENCE_USERNAME;
  const token = process.env.CONFLUENCE_TOKEN;
  const auth = Buffer.from(`${username}:${token}`).toString("base64");

  try {
    const response = await fetch(
      "https://idocket.atlassian.net/wiki/rest/api/space/QC1/content",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    const html = data || "<p>No content</p>";
    return NextResponse.json({ html });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
