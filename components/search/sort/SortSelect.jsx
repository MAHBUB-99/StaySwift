"use client";

import { SORT_OPTIONS } from "@/database/utils/stay";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const onChange = (event) => {
    const params = new URLSearchParams(searchParams);
    if (event.target.value === "recommended") params.delete("sort");
    else params.set("sort", event.target.value);
    router.replace(`${pathname}?${params}`, { scroll: false });
  };

  return (
    <label className="field min-w-[220px] !h-12 !pb-1.5">
      <span className="field-label !top-1">Sort by</span>
      <select value={searchParams.get("sort") ?? "recommended"} onChange={onChange}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
