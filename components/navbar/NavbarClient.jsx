"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../hotel/icons";
import Logo from "../Logo";

const LINKS = [
  { href: "/hotels", label: "Stays", icon: "bed", match: "/hotels" },
  { href: "/bookings", label: "Trips", icon: "calendar", match: "/bookings" },
];

function Avatar({ user, size = "h-9 w-9" }) {
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();
  return (
    <span
      className={`relative grid ${size} shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-navy to-[#173a63] text-sm font-bold text-white ring-2 ring-white`}
    >
      {user.image ? (
        <Image src={user.image} alt="" fill sizes="40px" className="object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}

export default function NavbarClient({ user, minimal }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Shadow and frosted glass once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the page changes.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Close the profile menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (link) => pathname?.startsWith(link.match);
  const firstName = user?.name?.split(" ")[0];
  const doSignOut = () => signOut({ callbackUrl: "/login" });

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 shadow-md shadow-navy/5 backdrop-blur-xl"
          : "bg-white"
      }`}
    >
      <div className="h-[3px] bg-gradient-to-r from-primary via-amber-400 to-primary" aria-hidden="true" />
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        {minimal ? (
          <Link href="/" className="link text-sm">
            ← Back to home
          </Link>
        ) : (
          <>
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link) ? "page" : undefined}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive(link)
                      ? "bg-primary/10 text-primary-dark"
                      : "text-navy/80 hover:bg-surface hover:text-navy"
                  }`}
                >
                  <Icon name={link.icon} className="h-[18px] w-[18px]" />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 transition hover:border-gray-300 hover:shadow-sm"
                  >
                    <Avatar user={user} />
                    <span className="max-w-[110px] truncate text-sm font-semibold">{firstName}</span>
                    <Icon
                      name="chevron"
                      className={`h-4 w-4 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-navy/10"
                    >
                      <div className="flex items-center gap-3 border-b border-gray-100 bg-surface px-4 py-3.5">
                        <Avatar user={user} size="h-11 w-11" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{user.name}</p>
                          <p className="truncate text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/bookings"
                          role="menuitem"
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface"
                        >
                          <Icon name="calendar" className="h-[18px] w-[18px] text-primary" />
                          My trips
                        </Link>
                        <Link
                          href="/hotels"
                          role="menuitem"
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface"
                        >
                          <Icon name="search" className="h-[18px] w-[18px] text-primary" />
                          Search stays
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={doSignOut}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          <Icon name="logout" className="h-[18px] w-[18px]" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden rounded-full px-4 py-2 text-sm font-semibold text-navy hover:bg-surface sm:inline-block"
                  >
                    Sign in
                  </Link>
                  <Link href="/register" className="btn-primary !px-5 !py-2 text-sm shadow-md shadow-primary/25">
                    Create account
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="grid h-10 w-10 place-items-center rounded-full text-navy hover:bg-surface md:hidden"
              >
                <Icon name={mobileOpen ? "close" : "menu"} className="h-6 w-6" />
              </button>
            </div>
          </>
        )}
      </div>

      {!minimal && mobileOpen && (
        <div id="mobile-menu" className="border-t border-gray-100 bg-white md:hidden">
          <div className="container space-y-1 py-3">
            {user && (
              <div className="mb-2 flex items-center gap-3 rounded-2xl bg-surface p-3">
                <Avatar user={user} size="h-11 w-11" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
            )}
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link) ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 font-semibold ${
                  isActive(link) ? "bg-primary/10 text-primary-dark" : "hover:bg-surface"
                }`}
              >
                <Icon name={link.icon} className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={doSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-red-600 hover:bg-red-50"
              >
                <Icon name="logout" className="h-5 w-5" />
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold hover:bg-surface sm:hidden"
              >
                <Icon name="users" className="h-5 w-5" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
