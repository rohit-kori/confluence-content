"use client";

import HtmlViewer from "@/app/components/html-viewe";
import { useParams } from "next/navigation";

export default function ConfluencePage() {
  const { id } = useParams();

  if (!id || Array.isArray(id)) return <p>Invalid ID</p>;

  return <HtmlViewer id={id} />;
}
