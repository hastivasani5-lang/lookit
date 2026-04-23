"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { BookOpen, CreditCard, LayoutGrid, LogOut, Menu, Settings, Star, Upload, Users, X } from "lucide-react";
import Image from "next/image";

const sidebarItems = [
  { label: "Overview",          href: "/dashboard/teachers",                  icon: LayoutGrid },
  { label: "Add",               href: "/dashboard/teachers?section=add",      icon: Upload },
  { label: "Upgrade Profile",   href: "/dashboard/teachers?section=upgrade",  icon: CreditCard },
  { label: "Purchases",         href: "/dashboard/teachers/purchases",        icon: Users },
  { label: "Advance Bookings",  href: "/dashboard/teachers/advance-bookings", icon: BookOpen },
  { label: "Followers",         href: "/dashboard/teachers/followers",        icon: Users },
  { label: "Reviews",           href: "/dashboard/teachers/reviews",          icon: Star },
  { label: "Settings",          href: "/dashboard/teachers?section=settings", icon: Settings },
];

interface DashboardSidebarProps {
  profileName?: string;
  profileEmail?: string;
  avatarSrc?: string;
}

// Inner component that uses useSearchParams — must be inside Suspense
function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const activeSection = searchParams?.get("section") ?? "";

  return (
    <nav className="mt-6 flex-1 space-y-1">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard/teachers"
            ? pathname === "/dashboard/teachers" && !activeSection
            : item.href.includes("?section=")
              ? activeSection === item.href.split("?section=")[1]
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
              isActive
                ? "bg-white text-[#1ec28e] shadow-lg"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Static fallback nav (no active state) — used during SSR/Suspense
function SidebarNavFallback({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="mt-6 flex-1 space-y-1">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardSidebar({ profileName, profileEmail, avatarSrc }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change (mobile)
  const pathname = usePathname();
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarContent = (onNavigate?: () => void) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 pb-7">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wide text-white">LearnFlow</h1>
          <p className="text-[11px] text-white/60">Professional Dashboard</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={avatarSrc || "/person.png"}
              alt="Profile"
              width={46}
              height={46}
              className="h-[46px] w-[46px] rounded-full object-cover ring-2 ring-white/40"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#15a374] bg-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{profileName || "Professional User"}</p>
            <p className="truncate text-[11px] text-white/60">@{(profileEmail || "professional").split("@")[0]}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <Suspense fallback={<SidebarNavFallback onNavigate={onNavigate} />}>
        <SidebarNav onNavigate={onNavigate} />
      </Suspense>

      {/* Logout */}
      <button
        onClick={async () => { await signOut({ callbackUrl: "/" }); }}
        className="mt-4 flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1ec28e] shadow-lg transition hover:bg-white/90"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Log Out
      </button>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 lg:hidden"
        style={{ background: "linear-gradient(160deg, #0d7a57 0%, #15a374 40%, #1ec28e 100%)" }}
      >
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white">LearnFlow</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg bg-white/15 p-2 text-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col px-5 py-6 transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "linear-gradient(160deg, #0d7a57 0%, #15a374 40%, #1ec28e 100%)" }}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 rounded-lg bg-white/15 p-1.5 text-white"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>

        {sidebarContent(() => setMobileOpen(false))}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[260px] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-white/10 lg:px-5 lg:py-6"
        style={{ background: "linear-gradient(160deg, #0d7a57 0%, #15a374 40%, #1ec28e 100%)" }}
      >
        {sidebarContent()}
      </aside>
    </>
  );
}
