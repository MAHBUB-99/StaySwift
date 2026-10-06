"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiError } from "@/components/api-error";
import { safeCallbackUrl } from "./callback-url";

const RegistrationForm = () => {
  const [error, setError] = useState();
  const router = useRouter();
  const callbackParam = useSearchParams().get("callbackUrl");
  async function onSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const fname = formData.get("fname");
      const lname = formData.get("lname");
      const email = formData.get("email");
      const password = formData.get("password");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          fname,
          lname,
          email,
          password,
        }),
      });
      if (response.status === 201) {
        router.push(
          callbackParam
            ? `/login?callbackUrl=${encodeURIComponent(safeCallbackUrl(callbackParam))}`
            : "/login"
        );
      } else {
        setError(await apiError(response));
      }
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <>
      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <form className="login-form" onSubmit={onSubmit}>
        <div>
          <label htmlFor="fname">First Name</label>
          <input type="text" name="fname" id="fname" />
        </div>

        <div>
          <label htmlFor="lname">Last Name</label>
          <input type="text" name="lname" id="lname" />
        </div>

        <div>
          <label htmlFor="email">Email address</label>
          <input type="email" name="email" id="email" />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" minLength={6} autoComplete="new-password" />
        </div>

        <button type="submit" className="btn-primary w-full mt-4">
          Create account
        </button>
      </form>
    </>
  );
};

export default RegistrationForm;
