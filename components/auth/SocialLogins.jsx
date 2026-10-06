"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { safeCallbackUrl } from "./callback-url";

const SocialLogins = ({ mode }) => {
  const callbackParam = useSearchParams().get("callbackUrl");
  const callbackUrl = safeCallbackUrl(callbackParam);
  const keep = callbackParam ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";

  return (
    <>
      <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        or
        <span className="h-px flex-1 bg-gray-200" />
      </div>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 py-2.5 font-medium hover:bg-surface"
      >
        <Image src="/google.png" alt="" width={20} height={20} />
        Continue with Google
      </button>
      <p className="mt-5 text-center text-sm text-gray-600">
        {mode === "register" ? (
          <>
            Already have an account?{" "}
            <Link className="link" href={`/login${keep}`}>
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to StaySwift?{" "}
            <Link className="link" href={`/register${keep}`}>
              Create an account
            </Link>
          </>
        )}
      </p>
    </>
  );
};

export default SocialLogins;
