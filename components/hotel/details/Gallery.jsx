"use client";

import { hqImage } from "@/database/utils/stay";
import { useCallback, useEffect, useRef, useState } from "react";
import HotelImage from "../HotelImage";

function Tile({ url, alt, index, sizes, onOpen, className = "", priority = false, children }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1}: ${alt}`}
      className={`group relative overflow-hidden bg-gray-200 ${className}`}
    >
      <HotelImage
        src={hqImage(url)}
        fallbackSrc={url}
        alt={alt}
        sizes={sizes}
        priority={priority}
      />
      <span className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/15" />
      {children}
    </button>
  );
}

function Lightbox({ images, name, index, onClose, onMove }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onMove(1);
      else if (event.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onMove]);

  const url = images[index];
  const control =
    "grid h-11 w-11 place-items-center rounded-full bg-white/15 text-xl text-white backdrop-blur transition-colors hover:bg-white/30";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photos`}
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-medium">
          {name} · {index + 1} / {images.length}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className={control} aria-label="Close photos">
          ✕
        </button>
      </div>

      <div className="relative mx-4 mb-4 flex-1 sm:mx-16" onClick={(e) => e.stopPropagation()}>
        <HotelImage
          key={url}
          src={hqImage(url, 1440)}
          fallbackSrc={url}
          alt={`${name} photo ${index + 1}`}
          sizes="100vw"
          fit="contain"
          priority
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMove(-1);
            }}
            className={`${control} absolute left-3 top-1/2 -translate-y-1/2`}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMove(1);
            }}
            className={`${control} absolute right-3 top-1/2 -translate-y-1/2`}
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

// Photo mosaic that opens a full-screen viewer.
export default function Gallery({ images = [], name }) {
  const [openIndex, setOpenIndex] = useState(null);
  const count = images.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback(
    (step) => setOpenIndex((i) => (i === null ? i : (i + step + count) % count)),
    [count]
  );

  if (count === 0) {
    return (
      <div className="grid h-[240px] place-items-center rounded-3xl bg-gray-200 text-gray-500 md:h-[420px]">
        Photos coming soon
      </div>
    );
  }

  const side = images.slice(1, 5);
  const sideLayout =
    side.length >= 4
      ? "grid-cols-2 grid-rows-2"
      : side.length === 3
        ? "grid-cols-2 grid-rows-2"
        : side.length === 2
          ? "grid-cols-1 grid-rows-2"
          : "grid-cols-1 grid-rows-1";

  return (
    <>
      <div
        className={`relative grid h-[260px] gap-2 overflow-hidden rounded-3xl shadow-lg shadow-navy/10 md:h-[440px] ${
          side.length > 0 ? "md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        <Tile
          url={images[0]}
          alt={name}
          index={0}
          sizes="(max-width: 768px) 100vw, 50vw"
          onOpen={setOpenIndex}
          priority
        />
        {side.length > 0 && (
          <div className={`hidden gap-2 md:grid ${sideLayout}`}>
            {side.map((url, i) => (
              <Tile
                key={url}
                url={url}
                alt={`${name} photo ${i + 2}`}
                index={i + 1}
                sizes="25vw"
                onOpen={setOpenIndex}
                className={side.length === 3 && i === 0 ? "col-span-2" : ""}
              />
            ))}
          </div>
        )}

        {count > 1 && (
          <button
            type="button"
            onClick={() => setOpenIndex(0)}
            className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-navy shadow-lg backdrop-blur transition hover:bg-white"
          >
            Show all {count} photos
          </button>
        )}
      </div>

      {openIndex !== null && (
        <Lightbox images={images} name={name} index={openIndex} onClose={close} onMove={move} />
      )}
    </>
  );
}
