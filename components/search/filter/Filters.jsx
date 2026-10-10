"use client";

import { GUEST_RATINGS, PRICE_RANGES } from "@/database/utils/stay";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const FILTER_KEYS = ["name", "price", "rating", "stars", "amenities"];

function Section({ title, children }) {
  return (
    <fieldset className="border-t border-gray-200 py-4">
      <legend className="float-left mb-2 w-full text-sm font-bold">{title}</legend>
      <div className="clear-both space-y-2">{children}</div>
    </fieldset>
  );
}

// Every filter lives in the URL, so results are rendered on the server and
// a filtered search can be shared or reloaded.
export default function Filters({ amenities }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(searchParams.get("name") ?? "");

  const list = (key) => (searchParams.get(key) ?? "").split(",").filter(Boolean);
  const price = searchParams.get("price") ?? "";
  const rating = searchParams.get("rating") ?? "";
  const stars = list("stars");
  const selectedAmenities = list("amenities");
  const activeCount = FILTER_KEYS.filter((key) => searchParams.get(key)).length;

  const update = (changes) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params}`, { scroll: false });
    });
  };

  const toggle = (key, current, value) => {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    update({ [key]: next.join(",") });
  };

  const clearAll = () => {
    setName("");
    update(Object.fromEntries(FILTER_KEYS.map((key) => [key, ""])));
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="btn-secondary w-full lg:hidden"
      >
        {open ? "Hide filters" : "Filters"}
        {activeCount > 0 && ` (${activeCount})`}
      </button>

      <div
        className={`${open ? "block" : "hidden"} card mt-3 p-5 lg:sticky lg:top-24 lg:mt-0 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto ${
          isPending ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-lg font-bold">Filter by</h2>
          {activeCount > 0 && (
            <button type="button" onClick={clearAll} className="link text-sm">
              Clear all
            </button>
          )}
        </div>

        <form
          className="border-t border-gray-200 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            update({ name: name.trim() });
          }}
        >
          <label htmlFor="property-name" className="mb-2 block text-sm font-bold">
            Search by property name
          </label>
          <div className="flex gap-2">
            <input
              id="property-name"
              type="search"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Charme villa"
              className="input"
            />
            <button type="submit" className="btn-secondary !px-4 !py-2 text-sm">
              Go
            </button>
          </div>
        </form>

        <Section title="Price per night">
          {[{ key: "", label: "Any price" }, ...PRICE_RANGES].map((range) => (
            <label key={range.key || "any"} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="price"
                checked={price === range.key}
                onChange={() => update({ price: range.key })}
                className="h-4 w-4 accent-primary"
              />
              {range.label}
            </label>
          ))}
        </Section>

        <Section title="Guest rating">
          {[{ value: "", label: "Any" }, ...GUEST_RATINGS].map((option) => (
            <label key={option.value || "any"} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="rating"
                checked={rating === String(option.value)}
                onChange={() => update({ rating: String(option.value) })}
                className="h-4 w-4 accent-primary"
              />
              {option.label}
            </label>
          ))}
        </Section>

        <Section title="Star rating">
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4", "5"].map((star) => {
              const active = stars.includes(star);
              return (
                <button
                  key={star}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle("stars", stars, star)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-gray-300 hover:border-navy"
                  }`}
                >
                  {star} ★
                </button>
              );
            })}
          </div>
        </Section>

        {amenities.length > 0 && (
          <Section title="Amenities">
            {amenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => toggle("amenities", selectedAmenities, amenity.id)}
                  className="h-4 w-4 accent-primary"
                />
                {amenity.name}
              </label>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}
