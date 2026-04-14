"use client";

import { ArrowUp, LogOut, Menu, X, Search, ShoppingCart, UserCircle2, Compass, Briefcase, Layers, Store, Info, Mail, Home, LibraryBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiteLogo from "@/components/SiteLogo";

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

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Find Experts", href: "/directory", icon: Compass },
  { name: "Categories", href: "/categories", icon: Layers },
  { name: "Professionals", href: "/professionals", icon: Briefcase },
  { name: "Shop", href: "/shop", icon: Store },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
];

const Navbar = () => {
    // ...existing code...
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
    const pageResults = navItems
      .filter((item) => item.name.toLowerCase().includes(query))
      .map((item) => ({ label: item.name, href: item.href, type: "Page" }));
    const professionalMatches = professionalResults
      .filter((p) => `${p.name} ${p.specialization}`.toLowerCase().includes(query))
      .map((p) => ({ label: p.name, href: `/professionals/${p.id}`, type: p.specialization }));
    return [...pageResults, ...professionalMatches].slice(0, 6);
  }, [professionalResults, searchQuery]);

  const runSearch = (value?: string) => {
    const query = (value ?? searchQuery).trim();
    if (!query) return;
    const normalizedQuery = query.toLowerCase();
    const exactPage = navItems.find(
      (item) => item.name.toLowerCase() === normalizedQuery || item.name.toLowerCase().includes(normalizedQuery)
    );
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
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl shadow-sm transition-all duration-300 border-b border-white/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <SiteLogo size="nav" priority />
          </Link>

          {/* Desktop Nav - Redesigned with pill style */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:text-emerald-600 rounded-full hover:bg-emerald-50/50"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4" />
              </Link>
            ))}
            {/* Language Switcher removed as requested */}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Search Button - Enhanced */}
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 text-gray-600 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Cart - Enhanced with animation */}
            {isStudent ? (
              <Link href="/cart" className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 text-gray-600 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-105">
                <ShoppingCart className="h-4.5 w-4.5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-[10px] font-bold text-white shadow-sm transition-transform group-hover:scale-110">
                  0
                </span>
              </Link>
            ) : (
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 text-gray-400 cursor-not-allowed opacity-60">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
            )}

            {isStudent ? (
              <Link
                href="/dashboard/students/library"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 text-gray-600 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-105"
                aria-label="Purchased books and videos"
              >
                <LibraryBig className="h-4.5 w-4.5" />
              </Link>
            ) : null}

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen((o) => !o)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                >
                  {session?.user?.image ? (
                    <Image src={session.user.image} alt="Profile" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <UserCircle2 className="h-5.5 w-5.5 text-gray-600" />
                  )}
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 rounded-2xl border border-gray-100/80 bg-white/95 backdrop-blur-xl p-4 shadow-xl"
                    >
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          {session?.user?.image ? (
                            <Image src={session.user.image} alt="Profile" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                          ) : (
                            <UserCircle2 className="h-6 w-6 text-emerald-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
                          <p className="truncate text-xs text-gray-500">{displayEmail}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => signOut({ callbackUrl: "/dashboard/students" })}
                        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>

                      {isStudent ? (
                        <Link
                          href="/dashboard/students/library"
                          className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-100 hover:shadow-sm"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          My Purchased Books
                        </Link>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-100 sm:flex"
              >
                Get Started
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 transition-all duration-200 hover:bg-emerald-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Search Modal - Enhanced Design */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute left-0 top-full z-50 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-100/50"
            >
              <div ref={searchMenuRef} className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
                <div className="overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-gray-100/80 px-5 py-4">
                    <Search className="h-5 w-5 text-emerald-500" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && runSearch()}
                      placeholder="Search pages, professionals, or explore..."
                      className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => runSearch()}
                      className="rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                    >
                      Search
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {searchResults.length === 0 ? (
                      <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                        <Search className="h-10 w-10 text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">Type something to search pages and professionals.</p>
                      </div>
                    ) : (
                      <div className="grid gap-1">
                        {searchResults.map((item, idx) => (
                          <motion.button
                            key={`${item.href}-${item.label}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => { router.push(item.href); setSearchOpen(false); setSearchQuery(""); }}
                            className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 hover:bg-linear-to-r hover:from-emerald-50/50 hover:to-teal-50/50"
                          >
                            <div>
                              <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.type}</p>
                            </div>
                            <span className="text-xs font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              Open →
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu - Enhanced with icons and animations */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="overflow-hidden border-t border-gray-100/80 bg-white/95 backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col space-y-1 px-4 py-4">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-linear-to-r hover:from-emerald-50/50 hover:to-teal-50/50 hover:text-emerald-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4.5 w-4.5 text-gray-400 group-hover:text-emerald-500" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-3 px-2"
                  >
                    <Link
                      href="/login"
                      className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-95"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Scroll to top button - Enhanced */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
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