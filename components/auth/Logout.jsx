"use client";
import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <button
      onClick={() => {
        signOut({ callbackUrl: "/login" });
      }}
      className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-surface"
    >
      Sign out
    </button>
  );
}
