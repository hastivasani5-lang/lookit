"use client";
import React from "react";
import { Bell, BookOpen, CreditCard, Star, Users, Video } from "lucide-react";
import type { DashboardSection } from "@/components/professional/DashboardTypes";

type NotifFollow = { studentId: string; studentName?: string; followedAt: string };
type NotifPurchase = { id: string; studentName: string; items?: Array<{ title: string; contentType: string }>; amount: string; paidAt: string; professionalId: string };
type NotifReview = { id: string; studentName: string; rating: number; review: string; createdAt: string; professionalId: string };

type NotificationDrawerProps = {
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
  notifLoading: boolean;
  notifFollows: NotifFollow[];
  notifPurchases: NotifPurchase[];
  notifReviews: NotifReview[];
  setActiveSection: (s: DashboardSection) => void;
};

export default function NotificationDrawer({
  notifOpen,
  setNotifOpen,
  notifLoading,
  notifFollows,
  notifPurchases,
  notifReviews,
  setActiveSection,
}: NotificationDrawerProps) {
  const totalCount = notifFollows.length + notifPurchases.length + notifReviews.length;

  return (
    <>
      {/* Backdrop */}
      {notifOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setNotifOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          notifOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-slate-100 px-5 py-4"
          style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 100%)" }}
        >
          <div>
            <h2 className="text-base font-bold text-white">Notifications</h2>
            <p className="text-[11px] text-white/70">{totalCount} new activity</p>
          </div>
          <button
            onClick={() => setNotifOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white transition hover:bg-white/30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {notifLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1ec28e] border-t-transparent" />
            </div>
          ) : totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
              <Bell className="h-10 w-10 opacity-30" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {/* Follows */}
              {notifFollows.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-slate-50 px-5 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      New Followers ({notifFollows.length})
                    </p>
                  </div>
                  {notifFollows.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-slate-50">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#effaf6] text-[#1ec28e]">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {f.studentName || "A student"} started following you
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {new Date(f.followedAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1ec28e]" />
                    </div>
                  ))}
                </div>
              )}

              {/* Purchases */}
              {notifPurchases.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-slate-50 px-5 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Purchases ({notifPurchases.length})
                    </p>
                  </div>
                  {notifPurchases.map((p) => (
                    <div key={p.id} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-slate-50">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#effaf6] text-[#1ec28e]">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">{p.studentName} purchased</p>
                        {Array.isArray(p.items) && p.items.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {p.items.map((item, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-[#effaf6] px-2 py-0.5 text-[11px] font-medium text-[#1ec28e]">
                                {item.contentType === "book" ? <BookOpen className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                                {item.title}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-1 text-xs text-slate-400">
                          {p.amount} · {new Date(p.paidAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1ec28e]" />
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews */}
              {notifReviews.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-slate-50 px-5 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Reviews ({notifReviews.length})
                    </p>
                  </div>
                  {notifReviews.map((r) => (
                    <div key={r.id} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-slate-50">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#effaf6] text-[#1ec28e]">
                        <Star className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{r.studentName}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{r.review}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(r.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1ec28e]" />
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-3">
          <button
            onClick={() => { setActiveSection("overview"); setNotifOpen(false); }}
            className="w-full rounded-xl bg-[#effaf6] py-2.5 text-sm font-semibold text-[#1ec28e] transition hover:bg-[#d8f5ec]"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
