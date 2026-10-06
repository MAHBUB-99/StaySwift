"use client";

import {
  MAX_ADULTS,
  MAX_CHILDREN,
  MAX_ROOMS,
  travelersLabel,
} from "@/database/utils/stay";
import { useEffect, useRef, useState } from "react";

function Counter({ label, hint, value, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid h-8 w-8 place-items-center rounded-full border border-gray-400 text-lg leading-none disabled:border-gray-200 disabled:text-gray-300"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-semibold" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="grid h-8 w-8 place-items-center rounded-full border border-gray-400 text-lg leading-none disabled:border-gray-200 disabled:text-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function TravelersPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Every room needs at least one adult.
  const setRooms = (rooms) =>
    onChange({ ...value, rooms, adults: Math.max(value.adults, rooms) });

  return (
    <div className="relative" ref={ref}>
      <div className="field">
        <span className="field-label">Travelers</span>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="truncate text-left"
        >
          {travelersLabel(value)}
        </button>
      </div>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-full min-w-[280px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          <div className="divide-y divide-gray-100">
            <Counter
              label="Rooms"
              value={value.rooms}
              min={1}
              max={MAX_ROOMS}
              onChange={setRooms}
            />
            <Counter
              label="Adults"
              hint="Ages 18 or above"
              value={value.adults}
              min={value.rooms}
              max={MAX_ADULTS}
              onChange={(adults) => onChange({ ...value, adults })}
            />
            <Counter
              label="Children"
              hint="Ages 0 to 17"
              value={value.children}
              min={0}
              max={MAX_CHILDREN}
              onChange={(children) => onChange({ ...value, children })}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 w-full"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
