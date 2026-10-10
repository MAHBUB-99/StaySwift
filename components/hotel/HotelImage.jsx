"use client";

import Image from "next/image";
import { useState } from "react";

// Fills its (relatively positioned) parent. Tries `fallbackSrc` if `src`
// fails, then shows a grey placeholder when there is no usable photo (some
// source URLs are dead).
export default function HotelImage({
  src,
  fallbackSrc,
  alt,
  sizes,
  priority = false,
  fit = "cover",
}) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);

  if (!current || failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-gray-200 text-sm text-gray-500">
        No photo
      </div>
    );
  }
  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setFailed(true);
      }}
      className={fit === "contain" ? "object-contain" : "object-cover"}
    />
  );
}
