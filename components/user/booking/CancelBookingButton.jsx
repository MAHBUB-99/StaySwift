"use client";

import { apiError } from "@/components/api-error";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelBookingButton({ bookingId, hotelName }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const onCancel = async () => {
    if (!window.confirm(`Cancel your booking at ${hotelName}? This can't be undone.`)) {
      return;
    }
    setError("");
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError(await apiError(res));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={onCancel}
        disabled={cancelling}
        className="rounded-full border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {cancelling ? "Cancelling…" : "Cancel booking"}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
