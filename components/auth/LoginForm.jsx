"use client";
import { login } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { safeCallbackUrl } from "./callback-url";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const callbackUrl = safeCallbackUrl(useSearchParams().get("callbackUrl"));

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      const response = await login(formData);
      if (response?.error) {
        setError(response.error);
        setSubmitting(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError(error.message);
      setSubmitting(false);
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
          <label htmlFor="email">Email address</label>
          <input type="email" name="email" id="email" autoComplete="email" required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full mt-4">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
