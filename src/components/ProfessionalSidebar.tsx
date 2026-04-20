"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const currentPath = pathname ?? "";

  return (
    <aside className="flex h-full flex-col rounded-[24px] bg-[#eef5f3] p-5 shadow-lg lg:sticky lg:top-3 lg:h-[calc(100vh-2.5rem)]">
      <div className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || currentPath.startsWith(item.href);
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#2d6a4f] text-white shadow-md"
                  : "text-[#2c5a48] hover:bg-[#d9eae5]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={async () => {
          await fetch("/api/professionals/session", { method: "DELETE" }).catch(() => undefined);
          await signOut({ callbackUrl: "/" });
        }}
        className="mt-6 flex items-center gap-3 rounded-lg bg-[#eef5f3] px-4 py-3 text-sm font-medium text-[#2c5a48] transition-all hover:bg-red-100 hover:text-red-700"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </aside>
  );
}