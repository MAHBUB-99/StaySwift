"use client";

import { GUEST_RATINGS, PRICE_RANGES } from "@/database/utils/stay";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FILTER_KEYS = ["name", "price", "rating", "stars", "amenities"];

// Removable chips for the filters that are currently applied.
export default function ActiveFilters({ amenities }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const list = (key) => (searchParams.get(key) ?? "").split(",").filter(Boolean);
  const amenityName = Object.fromEntries(amenities.map((a) => [a.id, a.name]));
  const chips = [];

  const name = searchParams.get("name");
  if (name) chips.push({ key: "name", value: name, label: `Name: ${name}` });

  const price = PRICE_RANGES.find((range) => range.key === searchParams.get("price"));
  if (price) chips.push({ key: "price", value: price.key, label: price.label });

  const rating = GUEST_RATINGS.find((r) => String(r.value) === searchParams.get("rating"));
  if (rating) chips.push({ key: "rating", value: String(rating.value), label: rating.label });

  for (const star of list("stars")) {
    chips.push({ key: "stars", value: star, label: `${star} ★`, multi: true });
  }
  for (const id of list("amenities")) {
    if (amenityName[id]) {
      chips.push({ key: "amenities", value: id, label: amenityName[id], multi: true });
    }
  }

  if (chips.length === 0) return null;

  const apply = (mutate) => {
    const params = new URLSearchParams(searchParams);
    mutate(params);
    router.replace(`${pathname}?${params}`, { scroll: false });
  };

  const remove = (chip) =>
    apply((params) => {
      if (!chip.multi) {
        params.delete(chip.key);
        return;
      }
      const rest = list(chip.key).filter((value) => value !== chip.value);
      if (rest.length > 0) params.set(chip.key, rest.join(","));
      else params.delete(chip.key);
    });

  const clearAll = () =>
    apply((params) => FILTER_KEYS.forEach((key) => params.delete(key)));

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Applied filters">
      {chips.map((chip) => (
        <button
          key={`${chip.key}:${chip.value}`}
          type="button"
          onClick={() => remove(chip)}
          className="group flex items-center gap-2 rounded-full bg-navy px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-primary"
          aria-label={`Remove filter ${chip.label}`}
        >
          {chip.label}
          <span aria-hidden="true" className="text-white/70 group-hover:text-white">
            ✕
          </span>
        </button>
      ))}
      <button type="button" onClick={clearAll} className="link ml-1 text-sm">
        Clear all
      </button>
    </div>
  );
}
