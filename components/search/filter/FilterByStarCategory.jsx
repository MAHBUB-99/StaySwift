"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterByStarCategory() {
  const [query, setQuery] = useState([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const checked = e.target.checked;
    if (checked) {
      setQuery((prev) => [...prev, name]);
    } else {
      setQuery((prev) => prev.filter((item) => item !== name));
    }
  };

  useEffect(() => {
    const category = params.get("category");
    if (category) {
      const decodedCategory = decodeURI(category);
      const queryInCategory = decodedCategory.split("|");
      setQuery(queryInCategory);
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      params.set("category", encodeURI(query.join("|")));
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params}`);
  }, [query]);

  return (
    <div>
      <h3 className="font-bold text-lg">Star Category</h3>
      <form action="" className="flex flex-col gap-2 mt-2">
        <label for="fiveStar">
          <input
            type="checkbox"
            name="5"
            id="fiveStar"
            checked={query.includes("5")}
            onChange={handleChange}
          />{" "}
          5 Star
        </label>

        <label for="fourStar">
          <input
            type="checkbox"
            name="4"
            id="fourStar"
            checked={query.includes("4")}
            onChange={handleChange}
          />{" "}
          4 Star
        </label>

        <label for="threeStar">
          <input
            type="checkbox"
            name="3"
            id="threeStar"
            checked={query.includes("3")}
            onChange={handleChange}
          />{" "}
          3 Star
        </label>

        <label for="twoStar">
          <input
            type="checkbox"
            name="2"
            id="twoStar"
            checked={query.includes("2")}
            onChange={handleChange}
          />{" "}
          2 Star
        </label>

        <label for="oneStar">
          <input
            type="checkbox"
            name="1"
            id="oneStar"
            checked={query.includes("1")}
            onChange={handleChange}
          />{" "}
          1 Star
        </label>
      </form>
    </div>
  );
}
