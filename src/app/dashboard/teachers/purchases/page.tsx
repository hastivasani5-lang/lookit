"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, BookOpen, Clock3, RefreshCcw, Video, Users } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import { Suspense } from "react";

type PurchaseRow = {
  id: string;
  studentId: string;
  studentName: string;
  itemTitle: string;
  contentType: "book" | "video";
  purchaseTime: string;
  transactionId: string;
  amount: string;
};

type PurchasePayload = {
  purchases?: PurchaseRow[];
  uniqueStudentsCount?: number;
  totalPurchases?: number;
  booksCount?: number;
  videosCount?: number;
  lastUpdated?: string;
  message?: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function TeacherPurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [uniqueStudentsCount, setUniqueStudentsCount] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadPurchases = async (isBackgroundRefresh = false) => {
    if (isBackgroundRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await fetch("/api/profile/purchases", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as PurchasePayload;

      if (!response.ok) {
        setError(payload.message || "Unable to load purchase data.");
        return;
      }

      setPurchases(Array.isArray(payload.purchases) ? payload.purchases : []);
      setUniqueStudentsCount(typeof payload.uniqueStudentsCount === "number" ? payload.uniqueStudentsCount : 0);
      setTotalPurchases(typeof payload.totalPurchases === "number" ? payload.totalPurchases : 0);
      setBooksCount(typeof payload.booksCount === "number" ? payload.booksCount : 0);
      setVideosCount(typeof payload.videosCount === "number" ? payload.videosCount : 0);
      setLastUpdated(payload.lastUpdated ?? null);
    } catch {
      setError("Unable to load purchase data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadPurchases();

    const interval = setInterval(() => {
      void loadPurchases(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: "Students", value: uniqueStudentsCount, icon: Users, tone: "text-[#178c43]" },
      { label: "Purchases", value: totalPurchases, icon: RefreshCcw, tone: "text-[#2d6a4f]" },
      { label: "Books", value: booksCount, icon: BookOpen, tone: "text-[#1ec28e]" },
      { label: "Videos", value: videosCount, icon: Video, tone: "text-[#cc2a2a]" },
    ],
    [booksCount, totalPurchases, uniqueStudentsCount, videosCount],
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef5f3] px-3 pb-12 pt-28 sm:px-4 md:px-6 lg:px-8">
        <section className="mx-auto grid w-full max-w-[1600px] gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Suspense>
            <ProfessionalSidebar />
          </Suspense>

          <div className="rounded-[28px] bg-[#eef5f3] p-4 shadow-[20px_20px_40px_#d0dbd6,-20px_-20px_40px_#ffffff] md:p-6">
          <div className="flex flex-col gap-4 rounded-[24px] bg-[#eef5f3] px-5 py-4 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2c5a48]">Professional Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Live Purchases</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                Track every student purchase of your books and videos in real time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void loadPurchases()}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1ec28e] px-4 text-sm font-semibold text-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff] transition hover:bg-[#18ab7d]"
              >
                <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#f6fefb] text-[#1ec28e] shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]">
                <Bell className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-[24px] bg-[#eef5f3] p-5 shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">{card.label}</p>
                      <p className={`mt-2 text-3xl font-bold ${card.tone}`}>{card.value}</p>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f6fefb] text-[#1ec28e] shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-[24px] bg-[#eef5f3] p-5 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff]">
            <div className="flex flex-col gap-2 border-b border-white/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Student Purchases</h2>
                <p className="text-sm text-slate-500">Student name, purchased book/video, and purchase time.</p>
              </div>
              <div className="text-xs text-slate-500">
                {lastUpdated ? (
                  <span>Last updated: {formatDate(lastUpdated)}</span>
                ) : (
                  <span>Waiting for live updates...</span>
                )}
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            {loading ? (
              <div className="mt-4 rounded-2xl bg-[#f6fefb] px-4 py-6 text-sm text-slate-500 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff]">
                Loading live purchase data...
              </div>
            ) : purchases.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-[#f6fefb] px-4 py-6 text-sm text-slate-500 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff]">
                No student purchases yet.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-white/80 bg-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-[#f6fefb] text-left text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Purchased Item</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Purchase Time</th>
                      <th className="px-4 py-3">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-t border-slate-100 text-slate-700">
                        <td className="px-4 py-3 font-medium text-slate-900">{purchase.studentName}</td>
                        <td className="px-4 py-3">{purchase.itemTitle}</td>
                        <td className="px-4 py-3 capitalize">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${purchase.contentType === "book" ? "bg-[#e8f9ee] text-[#178c43]" : "bg-[#fff1f1] text-[#cc2a2a]"}`}>
                            {purchase.contentType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock3 className="h-4 w-4 text-[#1ec28e]" />
                            {formatDate(purchase.purchaseTime)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{purchase.transactionId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard/teachers" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#2c5a48] shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff] transition hover:shadow-inner">
              Back to Dashboard
            </Link>
          </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
