"use client";

import { useState } from "react";

const LONG_TEXT = 420;

// Long descriptions start collapsed with a "Read more" toggle.
export default function ExpandableText({ text }) {
  const [open, setOpen] = useState(false);
  const isLong = text.length > LONG_TEXT;

  return (
    <div>
      <p
        className={`whitespace-pre-line leading-7 text-gray-700 ${
          isLong && !open ? "line-clamp-5" : ""
        }`}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="link mt-2 text-sm"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
