"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-md font-semibold mb-4">Search Confluence</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Confluence content"
            className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="mt-4 text-gray-600 dark:text-gray-300">Searching...</p>
        )}

        {results.length > 0 && (
          <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto">
            {results.map((item) => (
              <li key={item.url}>
                <Link href={item.url} passHref>
                  <span
                    onClick={onClose}
                    className="inline-flex items-center gap-2.5 text-[15px] font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
