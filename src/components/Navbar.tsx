"use client";

import { ArrowUp, LogOut, Menu, X, Search, ShoppingCart, UserCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function getNavHref(label: string) {
  if (label === "Home") return "/";
  if (label === "Find Experts") return "/directory";
  return `/${label.toLowerCase().replace(/\s+/g, "")}`;
}

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
    if (!searchOpen || professionalResultsLoaded) return;
    const loadProfessionals = async () => {
      try {
        const response = await fetch("/api/professionals", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as { professionals?: SearchProfessional[] };
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
    if (!query) return [];
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
      .filter((p) => `${p.name} ${p.specialization}`.toLowerCase().includes(query))
      .map((p) => ({ label: p.name, href: `/professionals/${p.id}`, type: p.specialization }));
    return [...pageResults, ...professionalMatches].slice(0, 6);
  }, [professionalResults, searchQuery]);

  const runSearch = (value?: string) => {
    const query = (value ?? searchQuery).trim();
    if (!query) return;
    const normalizedQuery = query.toLowerCase();
    const exactPage = [
      { label: "Home", href: "/" }, { label: "Find Experts", href: "/directory" },
      { label: "Categories", href: "/categories" }, { label: "Professionals", href: "/professionals" },
      { label: "Shop", href: "/shop" }, { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" }, { label: "Cart", href: "/cart" },
    ].find((item) => item.label.toLowerCase() === normalizedQuery || item.label.toLowerCase().includes(normalizedQuery));
    if (exactPage) router.push(exactPage.href);
    else {
      const match = professionalResults.find((p) => p.name.toLowerCase().includes(normalizedQuery));
      if (match) router.push(`/professionals/${match.id}`);
      else router.push(`/professionals?search=${encodeURIComponent(query)}`);
    }
    setSearchOpen(false);
    setSearchQuery("");
  };

  if (!hasMounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="h-8 w-28 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              LOOKIT
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 lg:flex">
            {["Home", "Find Experts", "Categories", "Professionals", "Shop", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={getNavHref(item)}
                className="relative transition-colors hover:text-emerald-600 after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-emerald-500 after:to-teal-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:scale-105"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {isStudent ? (
              <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:scale-105">
                <ShoppingCart className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-bold text-white shadow-sm">0</span>
              </Link>
            ) : (
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 cursor-not-allowed opacity-60">
                <ShoppingCart className="h-4 w-4" />
              </div>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen((o) => !o)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:scale-105"
                >
                  {session?.user?.image ? (
                    <Image src={session.user.image} alt="Profile" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <UserCircle2 className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-lg p-4 shadow-xl"
                    >
                      <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
                      <p className="mt-1 truncate text-xs text-gray-500">{displayEmail}</p>
                      <button
                        onClick={() => signOut({ callbackUrl: "/dashboard/students" })}
                        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-semibold text-white transition-all hover:shadow-md hover:scale-[1.02]"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="hidden rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-105 sm:flex">
                LOGIN
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 transition-all hover:bg-emerald-50 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Search Modal */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 top-full z-50 w-full border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-xl"
            >
              <div ref={searchMenuRef} className="mx-auto w-full max-w-7xl px-4 py-5 md:px-8">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3">
                    <Search className="h-5 w-5 text-emerald-500" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && runSearch()}
                      placeholder="Search pages, professionals, or cart..."
                      className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                    />
                    <button onClick={() => runSearch()} className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all">
                      Search
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {searchResults.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-gray-500">Type something to search pages and professionals.</p>
                    ) : (
                      searchResults.map((item) => (
                        <button
                          key={`${item.href}-${item.label}`}
                          onClick={() => { router.push(item.href); setSearchOpen(false); setSearchQuery(""); }}
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-emerald-50/50"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.type}</p>
                          </div>
                          <span className="text-xs font-medium text-emerald-600">Open →</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden"
            >
              <nav className="flex flex-col space-y-1 px-4 py-4">
                {["Home", "Find Experts", "Categories", "Professionals", "Shop", "About", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href={getNavHref(item)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link href="/login" className="mt-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm" onClick={() => setMobileMenuOpen(false)}>
                    LOGIN
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;