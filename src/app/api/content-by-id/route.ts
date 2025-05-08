// src/app/api/confluence/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing content ID" }, { status: 400 });
  }

  const username = process.env.CONFLUENCE_USERNAME;
  const token = process.env.CONFLUENCE_TOKEN;
  const auth = Buffer.from(`${username}:${token}`).toString("base64");

  try {
    const response = await fetch(
      `https://idocket.atlassian.net/wiki/rest/api/content/${id}?expand=body.view.value`,
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
    return NextResponse.json({ html: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
