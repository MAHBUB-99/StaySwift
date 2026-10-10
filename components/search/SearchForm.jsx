"use client";

import { addDaysISO, todayISO } from "@/database/utils/stay";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import DestinationInput from "./DestinationInput";
import TravelersPicker from "./TravelersPicker";

const STAY_KEYS = ["destination", "checkin", "checkout", "rooms", "adults", "children"];

// Destination, dates and travelers. On the results page it keeps the active
// filters; on a hotel page (showDestination=false) it updates room prices.
export default function SearchForm({
  destinations = [],
  initial = {},
  action = "/hotels",
  hash = "",
  keepFilters = false,
  showDestination = true,
  variant = "hero",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(initial.destination ?? "");
  const [checkin, setCheckin] = useState(initial.checkin ?? "");
  const [checkout, setCheckout] = useState(initial.checkout ?? "");
  const [travelers, setTravelers] = useState({
    rooms: initial.rooms ?? 1,
    adults: initial.adults ?? 2,
    children: initial.children ?? 0,
  });
  const [error, setError] = useState("");
  const today = todayISO();

  const onCheckinChange = (value) => {
    setCheckin(value);
    if (value && (!checkout || checkout <= value)) {
      setCheckout(addDaysISO(value, 1));
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!!checkin !== !!checkout) {
      setError("Select both a check-in and a check-out date.");
      return;
    }
    if (checkin && checkin < today) {
      setError("Check-in can't be in the past.");
      return;
    }
    if (checkin && checkout <= checkin) {
      setError("Check-out must be after check-in.");
      return;
    }
    setError("");

    const params = keepFilters ? new URLSearchParams(searchParams) : new URLSearchParams();
    STAY_KEYS.forEach((key) => params.delete(key));
    if (showDestination && destination.trim()) {
      params.set("destination", destination.trim());
    }
    if (checkin && checkout) {
      params.set("checkin", checkin);
      params.set("checkout", checkout);
    }
    params.set("rooms", travelers.rooms);
    params.set("adults", travelers.adults);
    if (travelers.children > 0) params.set("children", travelers.children);

    router.push(`${action}?${params}${hash}`);
  };

  const grid = showDestination
    ? "lg:grid-cols-[1.6fr_1fr_1fr_1.2fr_auto]"
    : "lg:grid-cols-[1fr_1fr_1.2fr_auto]";

  // At the two-column (medium) width, destination and travelers share the
  // first row and the dates the second. Other widths keep the source order.
  const order = showDestination
    ? {
        destination: "sm:order-1 lg:order-none",
        travelers: "sm:order-2 lg:order-none",
        checkin: "sm:order-3 lg:order-none",
        checkout: "sm:order-4 lg:order-none",
        submit: "sm:order-5 lg:order-none",
      }
    : { destination: "", travelers: "", checkin: "", checkout: "", submit: "" };

  return (
    <form
      onSubmit={onSubmit}
      className={
        variant === "hero"
          ? "rounded-2xl bg-white/95 p-4 shadow-2xl shadow-navy/30 ring-1 ring-white/50 backdrop-blur md:p-5"
          : ""
      }
      noValidate
    >
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${grid}`}>
        {showDestination && (
          <div className={order.destination}>
            <DestinationInput
              value={destination}
              onChange={setDestination}
              destinations={destinations}
            />
          </div>
        )}
        <label className={`field ${order.checkin}`}>
          <span className="field-label">Check-in</span>
          <input
            type="date"
            value={checkin}
            min={today}
            onChange={(event) => onCheckinChange(event.target.value)}
          />
        </label>
        <label className={`field ${order.checkout}`}>
          <span className="field-label">Check-out</span>
          <input
            type="date"
            value={checkout}
            min={checkin ? addDaysISO(checkin, 1) : addDaysISO(today, 1)}
            onChange={(event) => setCheckout(event.target.value)}
          />
        </label>
        <div className={order.travelers}>
          <TravelersPicker value={travelers} onChange={setTravelers} />
        </div>
        <button
          type="submit"
          className={`btn-primary h-14 px-8 sm:col-span-2 lg:col-span-1 ${order.submit}`}
        >
          {showDestination ? "Search" : "Check availability"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
