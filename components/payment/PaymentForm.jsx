"use client";

import { apiError } from "@/components/api-error";
import { formatPrice } from "@/database/utils/stay";
import { useRouter } from "next/navigation";
import { useState } from "react";

const digits = (value) => value.replace(/\D/g, "");

// Card details are only checked for format in the browser; they are never
// sent to the server or stored. Payment is simulated.
function validateCard({ cardName, cardNumber, expiry, cvv }) {
  if (!cardName.trim()) return "Enter the name on the card.";
  const number = digits(cardNumber);
  if (number.length < 13 || number.length > 19) return "Enter a valid card number.";
  const match = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return "Enter the expiry date as MM/YY.";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  if (
    month < 1 ||
    month > 12 ||
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1)
  ) {
    return "This card has expired.";
  }
  if (!/^\d{3,4}$/.test(cvv)) return "Enter the 3 or 4 digit security code.";
  return "";
}

const PaymentForm = ({ loggedInUser, hotelId, roomType, stay, total }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    guestName: loggedInUser?.name ?? "",
    guestPhone: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  async function onSubmit(event) {
    event.preventDefault();
    if (!form.guestName.trim()) {
      setError("Enter the name of the main guest.");
      return;
    }
    if (!/^\+?[\d\s()-]{7,20}$/.test(form.guestPhone.trim())) {
      setError("Enter a valid phone number.");
      return;
    }
    const cardError = validateCard(form);
    if (cardError) {
      setError(cardError);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          roomType,
          checkin: stay.checkin,
          checkout: stay.checkout,
          rooms: stay.rooms,
          adults: stay.adults,
          children: stay.children,
          guestName: form.guestName.trim(),
          guestPhone: form.guestPhone.trim(),
        }),
      });

      if (res.status === 201) {
        router.push("/bookings?booked=1");
        router.refresh();
      } else {
        setError(await apiError(res));
        setSubmitting(false);
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      <section className="card space-y-4 p-5">
        <h2 className="text-lg font-bold">Who&apos;s checking in?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="guestName" className="mb-1 block text-sm font-medium">
              Full name
            </label>
            <input
              id="guestName"
              value={form.guestName}
              onChange={set("guestName")}
              autoComplete="name"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="guestPhone" className="mb-1 block text-sm font-medium">
              Mobile phone
            </label>
            <input
              id="guestPhone"
              type="tel"
              value={form.guestPhone}
              onChange={set("guestPhone")}
              autoComplete="tel"
              className="input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={loggedInUser?.email ?? ""}
              readOnly
              className="input bg-surface text-gray-600"
            />
            <p className="mt-1 text-xs text-gray-500">
              Your booking confirmation goes to this address.
            </p>
          </div>
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="text-lg font-bold">Payment</h2>
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Demo checkout: no payment is taken and card details never leave your browser.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="cardName" className="mb-1 block text-sm font-medium">
              Name on card
            </label>
            <input
              id="cardName"
              value={form.cardName}
              onChange={set("cardName")}
              autoComplete="cc-name"
              className="input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium">
              Card number
            </label>
            <input
              id="cardNumber"
              inputMode="numeric"
              value={form.cardNumber}
              onChange={set("cardNumber")}
              autoComplete="cc-number"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="expiry" className="mb-1 block text-sm font-medium">
              Expiry date
            </label>
            <input
              id="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={set("expiry")}
              autoComplete="cc-exp"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="cvv" className="mb-1 block text-sm font-medium">
              Security code
            </label>
            <input
              id="cvv"
              inputMode="numeric"
              value={form.cvv}
              onChange={set("cvv")}
              autoComplete="cc-csc"
              className="input"
            />
          </div>
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base">
        {submitting ? "Booking…" : `Complete booking · ${formatPrice(total)}`}
      </button>
    </form>
  );
};

export default PaymentForm;
