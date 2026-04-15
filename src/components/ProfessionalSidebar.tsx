"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { CreditCard, LayoutGrid, LogOut, Settings, Star, Upload, Users } from "lucide-react";

const sidebarItems = [
  { label: "Overview", href: "/dashboard/teachers", icon: LayoutGrid },
  { label: "Add", href: "/dashboard/teachers?section=add", icon: Upload },
  { label: "Upgrade Profile", href: "/dashboard/teachers?section=upgrade", icon: CreditCard },
  { label: "Purchases", href: "/dashboard/teachers/purchases", icon: Users },
  { label: "Reviews", href: "/dashboard/teachers/reviews", icon: Star },
  { label: "Settings", href: "/dashboard/teachers?section=settings", icon: Settings },
];

export default function ProfessionalSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section");

  const isOverviewActive =
    pathname === "/dashboard/teachers" ||
    pathname.startsWith("/dashboard/teachers/books") ||
    pathname.startsWith("/dashboard/teachers/videos");

  return (
    <aside className="flex flex-col rounded-[24px] bg-[#eef5f3] p-5 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff] lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1ec28e]/10 text-[#1ec28e]">
          <div className="h-5 w-5 rounded-full border-4 border-current border-r-transparent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">LearnFlow</h2>
          <p className="text-xs text-slate-500">Professional dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          let isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          if (item.label === "Overview") {
            isActive = isOverviewActive && !activeSection;
          }

          if (item.label === "Add") {
            isActive = pathname === "/dashboard/teachers" && activeSection === "add";
          }

          if (item.label === "Upgrade Profile") {
            isActive = pathname === "/dashboard/teachers" && activeSection === "upgrade";
          }

          if (item.label === "Settings") {
            isActive = pathname === "/dashboard/teachers" && activeSection === "settings";
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-[#2d6a4f] text-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]"
                  : "bg-[#eef5f3] text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={async () => {
          await fetch("/api/professionals/session", { method: "DELETE" }).catch(() => undefined);
          await signOut({ callbackUrl: "/" });
        }}
        className="mt-6 flex items-center gap-3 rounded-xl bg-[#eef5f3] px-4 py-3 text-sm font-medium text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] transition hover:shadow-inner"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </aside>
  );
}