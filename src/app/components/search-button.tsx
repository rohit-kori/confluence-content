"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import SearchModal from "./search";

export default function SearchButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        aria-label="Open Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {showModal && <SearchModal onClose={() => setShowModal(false)} />}
    </>
  );
}
