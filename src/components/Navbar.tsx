"use client";

import { LogOut, Menu, X, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const displayName = session?.user?.name?.trim() || "Student";
  const displayEmail = session?.user?.email?.trim() || "";
  const isAuthenticated = status === "authenticated";

  return (
    <header className="w-full fixed top-0 z-50 bg-white shadow-sm">

      {/* MAIN NAV */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 md:px-8 py-2 sm:py-3">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Image src="/leaf.png" alt="logo" width={35} height={35} className="h-8 w-8 sm:h-9 sm:w-9" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Educate<span className="text-primary">X</span>
          </h1>
        </div>

        {/* MENU - DESKTOP */}
        <nav className="hidden lg:flex items-center gap-6 md:gap-8 text-gray-700 text-sm font-medium">
          <Link href="/about" className="hover:text-primary transition">About</Link>
          <Link href="/pages" className="hover:text-primary transition">Pages</Link>
          <Link href="/courses" className="hover:text-primary transition">Courses</Link>
          <Link href="/shop" className="hover:text-primary transition">Shop</Link>
          <Link href="/blog" className="hover:text-primary transition">Blog</Link>
          <Link href="/contact" className="hover:text-primary transition">Contact</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

          {/* SEARCH */}
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
            <Search className="w-4 h-4 text-gray-700" />
          </button>

          {/* CART */}
          <button className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
            <ShoppingCart className="w-4 h-4 text-gray-700" />

            {/* BADGE */}
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="grid h-8 sm:h-10 w-8 sm:w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                aria-label="Open profile menu"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-8 sm:h-10 w-8 sm:w-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-5 sm:h-6 w-5 sm:w-6" />
                )}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-[0_18px_42px_rgba(15,23,42,0.16)]">
                  <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{displayName}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{displayEmail}</p>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/dashboard/students" })}
                    className="mt-3 inline-flex h-8 sm:h-9 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs sm:text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:flex items-center gap-1 sm:gap-2 bg-primary hover:bg-[#18ab7d] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition">
              LOGIN <span className="hidden sm:inline">→</span>
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            )}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-3 sm:px-4 py-3 space-y-2">
            <Link
              href="/about"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/pages"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pages
            </Link>
            <Link
              href="/courses"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/shop"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/blog"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {!isAuthenticated && (
              <Link
                href="/login"
                className="mt-2 flex items-center justify-center gap-1 bg-primary hover:bg-[#18ab7d] text-white px-4 py-2 rounded-full text-sm font-medium transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                LOGIN
              </Link>
            )}
          </nav>
        </div>
      )}

    </header>
  );
};

export default Navbar;