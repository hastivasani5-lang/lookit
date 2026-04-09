"use client";

import { ArrowUp, LogOut, Menu, X, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchProfessional = {
  id: string;
  name: string;
  specialization: string;
};

type SearchResult = {
  label: string;
  href: string;
  type: string;
};

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hasMounted, setHasMounted] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [professionalResults, setProfessionalResults] = useState<SearchProfessional[]>([]);
  const [professionalResultsLoaded, setProfessionalResultsLoaded] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const searchMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (searchMenuRef.current && !searchMenuRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 180);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen || professionalResultsLoaded) {
      return;
    }

    const loadProfessionals = async () => {
      try {
        const response = await fetch("/api/professionals", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as {
          professionals?: SearchProfessional[];
        };

        if (response.ok && Array.isArray(payload.professionals)) {
          setProfessionalResults(payload.professionals);
        }
      } catch {
        setProfessionalResults([]);
      } finally {
        setProfessionalResultsLoaded(true);
      }
    };

    void loadProfessionals();
  }, [professionalResultsLoaded, searchOpen]);

  const displayName = session?.user?.name?.trim() || "Student";
  const displayEmail = session?.user?.email?.trim() || "";
  const isAuthenticated = status === "authenticated";
  const isStudent = session?.user?.role === "student";

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [] as SearchResult[];
    }

    const pageResults = [
      { label: "Home", href: "/", type: "Page" },
      { label: "Find Experts", href: "/directory", type: "Page" },
      { label: "Categories", href: "/categories", type: "Page" },
      { label: "Professionals", href: "/professionals", type: "Page" },
      { label: "Shop", href: "/shop", type: "Page" },
      { label: "About", href: "/about", type: "Page" },
      { label: "Contact", href: "/contact", type: "Page" },
      { label: "Cart", href: "/cart", type: "Page" },
    ].filter((item) => item.label.toLowerCase().includes(query));

    const professionalMatches = professionalResults
      .filter((professional) => `${professional.name} ${professional.specialization}`.toLowerCase().includes(query))
      .map((professional) => ({
        label: professional.name,
        href: `/professionals/${professional.id}`,
        type: professional.specialization,
      }));

    return [...pageResults, ...professionalMatches].slice(0, 6);
  }, [professionalResults, searchQuery]);

  const runSearch = (value?: string) => {
    const query = (value ?? searchQuery).trim();

    if (!query) {
      return;
    }

    const normalizedQuery = query.toLowerCase();
    const exactPage = [
      { label: "Home", href: "/" },
      { label: "Find Experts", href: "/directory" },
      { label: "Categories", href: "/categories" },
      { label: "Professionals", href: "/professionals" },
      { label: "Shop", href: "/shop" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Cart", href: "/cart" },
    ].find((item) => item.label.toLowerCase() === normalizedQuery || item.label.toLowerCase().includes(normalizedQuery));

    if (exactPage) {
      router.push(exactPage.href);
    } else {
      const match = professionalResults.find((professional) => professional.name.toLowerCase().includes(normalizedQuery));
      if (match) {
        router.push(`/professionals/${match.id}`);
      } else {
        router.push(`/professionals?search=${encodeURIComponent(query)}`);
      }
    }

    setSearchOpen(false);
    setSearchQuery("");
  };

  if (!hasMounted) {
    return (
      <header className="z-50 w-full bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-8">
          <div className="h-8 w-29.5 rounded bg-slate-100 sm:h-9 sm:w-33 md:h-10 md:w-37" />
          <div className="h-8 w-8 rounded-full bg-slate-100 sm:h-10 sm:w-10" />
        </div>
      </header>
    );
  }

  return (
    <header className="z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-8">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-[0.12em] text-slate-900 sm:text-xl">LOOKKIT</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 lg:flex">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <Link href="/directory" className="transition hover:text-primary">Find Experts</Link>
          <Link href="/categories" className="transition hover:text-primary">Categories</Link>
          <Link href="/professionals" className="transition hover:text-primary">Professionals</Link>
          <Link href="/shop" className="transition hover:text-primary">Shop</Link>
          <Link href="/about" className="transition hover:text-primary">About</Link>
          <Link href="/contact" className="transition hover:text-primary">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((current) => !current);
              setMobileMenuOpen(false);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border transition hover:bg-gray-100 sm:h-10 sm:w-10"
            aria-label="Open search"
          >
            <Search className="h-4 w-4 text-gray-700" />
          </button>

          {isStudent ? (
            <Link href="/cart" className="relative flex h-8 w-8 items-center justify-center rounded-full border transition hover:bg-gray-100 sm:h-10 sm:w-10" aria-label="Open cart">
              <ShoppingCart className="h-4 w-4 text-gray-700" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">0</span>
            </Link>
          ) : (
            <button type="button" className="relative flex h-8 w-8 items-center justify-center rounded-full border opacity-60 sm:h-10 sm:w-10" aria-label="Cart is available for students" disabled>
              <ShoppingCart className="h-4 w-4 text-gray-700" />
            </button>
          )}

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
            className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100 lg:hidden sm:h-10 sm:w-10"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-gray-700 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 text-gray-700 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="absolute left-0 top-full z-50 w-full border-t border-gray-200 bg-white shadow-lg">
          <div ref={searchMenuRef} className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 md:px-8">
            <div className="overflow-hidden rounded-2xl border border-[#dbe8e4] bg-white shadow-[0_18px_42px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      runSearch();
                    }
                  }}
                  placeholder="Search pages, professionals, or cart"
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button type="button" onClick={() => runSearch()} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#18ab7d]">
                  Search
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {searchResults.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-gray-500">Start typing to search pages and professionals.</p>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={`${item.href}-${item.label}`}
                      type="button"
                      onClick={() => {
                        router.push(item.href);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex w-full items-start justify-between rounded-xl px-3 py-3 text-left transition hover:bg-[#f7fbfa]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                      <span className="text-xs font-medium text-primary">Open</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {mobileMenuOpen ? (
        <div ref={mobileMenuRef} className="border-t border-gray-200 bg-white lg:hidden">
          <nav className="flex flex-col space-y-2 px-3 py-3 sm:px-4">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/directory" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Find Experts</Link>
            <Link href="/categories" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
            <Link href="/professionals" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Professionals</Link>
            <Link href="/shop" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
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

      {showScrollTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 animate-bounce items-center justify-center rounded-4xl border-4 border-Solid border-primary bg-white text-primary shadow-lg transition hover:scale-105 hover:bg-[#f2fbf8]"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </header>
  );
};

export default Navbar;
