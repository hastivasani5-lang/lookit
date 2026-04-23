"use client";

import { ArrowUp, Bell, LogOut, Menu, X, Search, ShoppingCart, UserCircle2, Compass, Briefcase, Layers, Store, Info, Mail, Home } from "lucide-react";
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
  const notifRef = useRef<HTMLDivElement | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: string; read: boolean; createdAt: string }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (searchMenuRef.current && !searchMenuRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false); };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 180);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen || professionalResultsLoaded) return;
    const load = async () => {
      try {
        const res = await fetch("/api/professionals", { cache: "no-store" });
        const payload = (await res.json().catch(() => ({}))) as { professionals?: SearchProfessional[] };
        if (res.ok && Array.isArray(payload.professionals)) setProfessionalResults(payload.professionals);
      } catch {
        setProfessionalResults([]);
      } finally {
        setProfessionalResultsLoaded(true);
      }
    };
    void load();
  }, [professionalResultsLoaded, searchOpen]);

  const displayName = session?.user?.name?.trim() || "Student";
  const displayEmail = session?.user?.email?.trim() || "";
  const isAuthenticated = status === "authenticated";
  const isStudent = session?.user?.role === "student";

  useEffect(() => {
    if (!isStudent) return;
    const load = async () => {
      try {
        const res = await fetch("/api/student/notifications", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          notifications: Array<{ id: string; message: string; type: string; read: boolean; createdAt: string }>;
          unreadCount: number;
        };
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch { /* ignore */ }
    };
    void load();
    const interval = setInterval(() => { void load(); }, 30_000);
    return () => clearInterval(interval);
  }, [isStudent]);

  // Load cart count from localStorage
  useEffect(() => {
    if (!isStudent) { setCartCount(0); return; }
    const updateCount = () => {
      try {
        const raw = window.localStorage.getItem("lookit-cart-items");
        const items = raw ? JSON.parse(raw) : [];
        setCartCount(Array.isArray(items) ? items.length : 0);
      } catch { setCartCount(0); }
    };
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, [isStudent]);

  const openNotifications = async () => {
    setNotifOpen((o) => !o);
    if (unreadCount > 0) {
      try {
        await fetch("/api/student/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markAllRead: true }),
        });
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch { /* ignore */ }
    }
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    const pages = navItems
      .filter((item) => item.name.toLowerCase().includes(query))
      .map((item) => ({ label: item.name, href: item.href, type: "Page" }));
    const pros = professionalResults
      .filter((p) => `${p.name} ${p.specialization}`.toLowerCase().includes(query))
      .map((p) => ({ label: p.name, href: `/professionals/${p.id}`, type: p.specialization }));
    return [...pages, ...pros].slice(0, 6);
  }, [professionalResults, searchQuery]);

  const runSearch = (value?: string) => {
    const query = (value ?? searchQuery).trim();
    if (!query) return;
    const q = query.toLowerCase();
    const page = navItems.find((item) => item.name.toLowerCase().includes(q));
    if (page) { router.push(page.href); }
    else {
      const pro = professionalResults.find((p) => p.name.toLowerCase().includes(q));
      router.push(pro ? `/professionals/${pro.id}` : `/professionals?search=${encodeURIComponent(query)}`);
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
          <Link href="/" className="group flex items-center">
            <SiteLogo size="nav" priority />
          </Link>

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
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 text-gray-600 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {isStudent ? (
              <Link href="/cart" className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 text-gray-600 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-105">
                <ShoppingCart className="h-4.5 w-4.5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-[10px] font-bold text-white shadow-sm transition-transform group-hover:scale-110">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              </Link>
            ) : (
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 text-gray-400 cursor-not-allowed opacity-60">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
            )}

            {isStudent ? (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={openNotifications}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 text-gray-600 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  aria-label="Notifications"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-100/80 bg-white/95 shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                        <div className="flex items-center gap-2">
                          {notifications.length > 0 && (
                            <span className="text-xs text-gray-400">{notifications.length} total</span>
                          )}
                          <button
                            onClick={() => setNotifOpen(false)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            aria-label="Close notifications"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                            <Bell className="mb-2 h-8 w-8 text-gray-200" />
                            <p className="text-sm text-gray-400">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`flex gap-3 border-b border-gray-50 px-4 py-3 last:border-0 transition-colors ${!n.read ? "bg-emerald-50/60" : "bg-white"}`}
                            >
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                <Bell className="h-3.5 w-3.5 text-emerald-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm leading-snug text-gray-800">{n.message}</p>
                                <p className="mt-1 text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                              </div>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  try {
                                    await fetch("/api/student/notifications", {
                                      method: "DELETE",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ id: n.id }),
                                    });
                                    setNotifications((prev) => prev.filter((x) => x.id !== n.id));
                                    setUnreadCount((c) => !n.read ? Math.max(0, c - 1) : c);
                                  } catch { /* ignore */ }
                                }}
                                className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-red-100 hover:text-red-500"
                                aria-label="Dismiss notification"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => {
                    if (isStudent) { router.push("/dashboard/students/profile"); return; }
                    setProfileMenuOpen((o) => !o);
                  }}
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
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
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

            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/80 transition-all duration-200 hover:bg-emerald-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

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
                            <span className="text-xs font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
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

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="overflow-hidden border-t border-gray-100/80 bg-white/95 backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col space-y-1 px-4 py-4">
                {navItems.map((item, idx) => (
                  <motion.div key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-linear-to-r hover:from-emerald-50/50 hover:to-teal-50/50 hover:text-emerald-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4.5 w-4.5 text-gray-400" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                {!isAuthenticated && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-3 px-2">
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
