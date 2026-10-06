"use client";

import { useState } from "react";

export default function DestinationInput({ value, onChange, destinations }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const term = value.trim().toLowerCase();
  const suggestions = destinations
    .filter((item) => !term || item.city.toLowerCase().includes(term))
    .slice(0, 6);
  const showList = open && suggestions.length > 0;

  const choose = (city) => {
    onChange(city);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (event) => {
    if (!showList) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      choose(suggestions[active].city);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <label className="field">
        <span className="field-label">Where to?</span>
        <input
          type="text"
          name="destination"
          value={value}
          placeholder="City or property name"
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls="destination-suggestions"
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="placeholder:font-normal placeholder:text-gray-400"
        />
      </label>

      {showList && (
        <ul
          id="destination-suggestions"
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
        >
          {suggestions.map((item, index) => (
            <li
              key={item.city}
              role="option"
              aria-selected={index === active}
              // mousedown fires before the input's blur closes the list
              onMouseDown={(event) => {
                event.preventDefault();
                choose(item.city);
              }}
              className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm ${
                index === active ? "bg-surface" : "hover:bg-surface"
              }`}
            >
              <span>
                <span className="font-semibold">{item.city}</span>
                {item.country && (
                  <span className="text-gray-500"> · {item.country}</span>
                )}
              </span>
              <span className="text-xs text-gray-500">
                {item.count} {item.count === 1 ? "stay" : "stays"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
