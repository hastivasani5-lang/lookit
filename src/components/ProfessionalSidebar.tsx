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

    <aside className="flex h-full flex-col rounded-[24px] bg-[#eef5f3] p-5 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff] lg:sticky lg:top-3 lg:h-[calc(100vh-2.5rem)]">
        <div>
      </div>
          const Icon = item.icon;
            isActive = isOverviewActive && !activeSection;
            isActive = pathname === "/dashboard/teachers" && activeSection === "add";
                  ? "bg-[#2d6a4f] text-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]"
// This component is now deprecated and replaced by DashboardSidebar.
// File kept for reference. Safe to delete if not used elsewhere.
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