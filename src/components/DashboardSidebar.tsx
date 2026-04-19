"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { CreditCard, LayoutGrid, LogOut, Settings, Star, Upload, Users } from "lucide-react";
import Image from "next/image";

const sidebarItems = [
  { label: "Overview", href: "/dashboard/teachers", icon: LayoutGrid },
  { label: "Add", href: "/dashboard/teachers?section=add", icon: Upload },
  { label: "Upgrade Profile", href: "/dashboard/teachers?section=upgrade", icon: CreditCard },
  { label: "Purchases", href: "/dashboard/teachers/purchases", icon: Users },
  { label: "Reviews", href: "/dashboard/teachers/reviews", icon: Star },
  { label: "Settings", href: "/dashboard/teachers?section=settings", icon: Settings },
];

interface DashboardSidebarProps {
  profileName?: string;
  profileEmail?: string;
  avatarSrc?: string;
}

export default function DashboardSidebar({ profileName, profileEmail, avatarSrc }: DashboardSidebarProps) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const activeSection = searchParams?.get("section") ?? "";

  return (
    <aside className="flex flex-col border-b border-slate-200/70 bg-[#eef5f3] px-5 py-6 lg:sticky lg:top-0 lg:h-full lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1ec28e]/10 text-[#1ec28e]">
          <div className="h-5 w-5 rounded-full border-4 border-current border-r-transparent" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">LearnFlow</h1>
          <p className="text-xs text-slate-500">Professional dashboard</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#eef5f3] p-4 shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]">
        <div className="flex items-center gap-3">
          <Image src={avatarSrc || "/person.png"} alt="Profile" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{profileName || "Professional User"}</p>
            <p className="truncate text-xs text-slate-500">@{(profileEmail || "professional").split("@")[0]}</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.label} href={item.href} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${isActive ? "bg-[#2d6a4f] text-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]" : "bg-[#eef5f3] text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner"}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={async () => {
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
