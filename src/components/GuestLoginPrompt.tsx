"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function GuestLoginPrompt() {
  const pathname = usePathname();
  const { status } = useSession();
  const [visible, setVisible] = useState(false);

  const isExcludedRoute = useMemo(() => {
    if (!pathname) return true;
    return ["/login", "/signup", "/dashboard/teachers", "/dashboard/adminpanel", "/admin"].some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);

  useEffect(() => {
    if (status !== "unauthenticated" || isExcludedRoute) {
      return;
    }

    let lastShownAt = 0;
    const cooldownMs = 6000;

    const onClick = () => {
      const now = Date.now();
      if (now - lastShownAt < cooldownMs) return;

      lastShownAt = now;
      setVisible(true);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, [isExcludedRoute, status]);

  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 3600);

    return () => window.clearTimeout(timer);
  }, [visible]);

  if (status !== "unauthenticated" || isExcludedRoute) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-[120] w-[min(92vw,380px)] rounded-2xl border border-[#b6ead7] bg-white/95 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.18)] backdrop-blur"
        >
          <p className="text-sm font-semibold text-slate-900">Login required</p>
          <p className="mt-1 text-sm text-slate-600">Please log in first to continue using website actions.</p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-full bg-[#1ec28e] px-4 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
            >
              Go to Login
            </Link>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="inline-flex h-9 items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
