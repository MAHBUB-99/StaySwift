"use client";

import Image from "next/image";
import { useState } from "react";

// Fills its (relatively positioned) parent. Shows a grey placeholder when
// there is no photo or the photo fails to load (some source URLs are dead).
export default function HotelImage({ src, alt, sizes, priority = false }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-gray-200 text-sm text-gray-500">
        No photo
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}
