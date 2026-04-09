"use client";

import { ChevronUp, LogOut, Menu, X, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 220);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayName = session?.user?.name?.trim() || "Student";
  const displayEmail = session?.user?.email?.trim() || "";
  const isAuthenticated = status === "authenticated";
  const navTextClass = "text-gray-700 hover:text-primary";
  const iconClass = "text-gray-700";
  const iconButtonClass = "border-gray-300 hover:bg-gray-100";

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="relative z-40 w-full bg-white shadow-sm transition-all duration-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-8" data-aos="fade-down" data-aos-duration="700">
        <div className="flex items-center gap-2" data-aos="fade-right" data-aos-delay="100">
          <Image
            src="/lookit-logo.svg"
            alt="Lookit logo"
            width={160}
            height={156}
            priority
            className="h-16 w-auto origin-left scale-125 sm:h-9 md:h-10"
          />
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex" data-aos="fade-down" data-aos-delay="180">
          <Link href="/" className={`${navTextClass} relative transition-all duration-300 hover:-translate-y-0.5`}>Home</Link>
          <Link href="/directory" className={`${navTextClass} relative transition-all duration-300 hover:-translate-y-0.5`}>Find Experts</Link>
          <Link href="/categories" className={`${navTextClass} relative transition-all duration-300 hover:-translate-y-0.5`}>Categories</Link>
          <Link href="/professionals" className={`${navTextClass} relative transition-all duration-300 hover:-translate-y-0.5`}>Professionals</Link>
          <Link href="/resources" className={`${navTextClass} relative transition-all duration-300 hover:-translate-y-0.5`}>Resources</Link>
          <Link href="/about" className={`${navTextClass} relative transition-all duration-300 hover:-translate-y-0.5`}>About</Link>
          <Link href="/contact" className={`${navTextClass} relative transition-all duration-300 hover:-translate-y-0.5`}>Contact</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4" data-aos="fade-left" data-aos-delay="240">
          <button type="button" className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 sm:h-10 sm:w-10 ${iconButtonClass}`}>
            <Search className={`h-4 w-4 ${iconClass}`} />
          </button>

          <button type="button" className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 sm:h-10 sm:w-10 ${iconButtonClass}`}>
            <ShoppingCart className={`h-4 w-4 ${iconClass}`} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              0
            </span>
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 sm:h-10 sm:w-10"
                aria-label="Open profile menu"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                  />
                ) : (
                  <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>

              {profileMenuOpen ? (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_42px_rgba(15,23,42,0.16)] sm:w-72 sm:p-4">
                  <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm">{displayName}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{displayEmail}</p>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/dashboard/students" })}
                    className="mt-3 inline-flex h-8 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-medium text-white transition hover:bg-[#18ab7d] sm:h-9 sm:text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/login" className="hidden rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#18ab7d] sm:flex sm:px-5 sm:py-2 sm:text-sm">
              LOGIN 
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 lg:hidden sm:h-10 sm:w-10 ${iconButtonClass}`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className={`h-5 w-5 sm:h-6 sm:w-6 ${iconClass}`} /> : <Menu className={`h-5 w-5 sm:h-6 sm:w-6 ${iconClass}`} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div ref={mobileMenuRef} className="border-t border-gray-200 bg-white lg:hidden">
          <nav className="flex flex-col space-y-2 px-3 py-3 sm:px-4">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/directory" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Find Experts</Link>
            <Link href="/categories" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
            <Link href="/professionals" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Professionals</Link>
            <Link href="/resources" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
            <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {!isAuthenticated ? (
              <Link href="/login" className="mx-3 mt-2 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-[#18ab7d]" onClick={() => setMobileMenuOpen(false)}>
                LOGIN 
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
      </header>

      {showScrollTop ? (
        <button
          type="button"
          onClick={handleScrollTop}
          className="fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_25px_rgba(30,194,142,0.45)] transition hover:scale-105 hover:bg-[#18ab7d]"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      ) : null}
    </>
  );
};

export default Navbar;
