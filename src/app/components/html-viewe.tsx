"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";

interface HtmlViewerProps {
  id: string;
}

export default function HtmlViewer({ id }: HtmlViewerProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/content-by-id?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.html?.body?.view?.value) {
          setHtml(data.html.body.view.value);
          setTitle(data.html.title);
        } else if (data.error) {
          setError(data.error);
        } else {
          setHtml(""); // explicitly mark “no content”
        }
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // still loading
  if (html === null) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // explicitly no content
  if (html.trim() === "") {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-gray-500">No content available.</p>
      </div>
    );
  }

  // finally render real HTML
  return (
    <div className="flex justify-center py-8 px-4">
      <div className="max-w-4xl w-full prose prose-img:mx-auto prose-img:rounded-md prose-img:shadow-md prose-headings:text-center">
        {title && <h2>{title}</h2>}
        {parse(html)}
      </div>
    </div>
  );
}
