"use client";

import { LogOut, Menu, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Image src="/leaf.png" alt="logo" width={35} height={35} className="h-auto w-auto" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Educate<span className="text-primary">X</span>
          </h1>
        </div>

        {/* MENU */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-700 text-sm font-medium">
          <Link href="/about" className="hover:text-primary transition">About</Link>
          <Link href="/pages" className="hover:text-primary transition">Pages</Link>
          <Link href="/courses" className="hover:text-primary transition">Courses</Link>
          <Link href="/shop" className="hover:text-primary transition">Shop</Link>
          <Link href="/blog" className="hover:text-primary transition">Blog</Link>
          <Link href="/contact" className="hover:text-primary transition">Contact</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
            <Search className="w-4 h-4 text-gray-700" />
          </div>

          {/* CART */}
          <div className="relative w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
            <ShoppingCart className="w-4 h-4 text-gray-700" />

            {/* BADGE */}
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </div>

          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                aria-label="Open profile menu"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-6 w-6" />
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_42px_rgba(15,23,42,0.16)]">
                  <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{displayEmail}</p>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/dashboard/students" })}
                    className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center gap-2 bg-primary hover:bg-[#18ab7d] text-white px-5 py-2 rounded-full text-sm font-medium transition">
              LOGIN →
            </Link>
          )}

          {/* MOBILE MENU */}
          <Menu className="lg:hidden w-6 h-6 cursor-pointer" />

        </div>
      </div>

    </header>
  );
};

export default Navbar;