"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Bell, BookOpen, Clock3, RefreshCcw, Users, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import DashboardSidebar from "@/components/DashboardSidebar";

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
  const { data: session } = useSession();
  const ITEMS_PER_PAGE = 10;

  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueStudentsCount, setUniqueStudentsCount] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadPurchases = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile/purchases", { cache: "no-store" });
      const payload = (await res.json().catch(() => ({}))) as PurchasePayload;
      if (!res.ok) { setError(payload.message || "Unable to load."); return; }
      setPurchases(Array.isArray(payload.purchases) ? payload.purchases : []);
      setUniqueStudentsCount(payload.uniqueStudentsCount ?? 0);
      setTotalPurchases(payload.totalPurchases ?? 0);
      setBooksCount(payload.booksCount ?? 0);
      setVideosCount(payload.videosCount ?? 0);
      setLastUpdated(payload.lastUpdated ?? null);
    } catch { setError("Unable to load purchase data."); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => {
    void loadPurchases();
    const interval = setInterval(() => void loadPurchases(true), 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setCurrentPage(1); }, [purchases]);

  const totalPages = Math.max(1, Math.ceil(purchases.length / ITEMS_PER_PAGE));
  const paginated = purchases.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => [
    { label: "Students",  value: uniqueStudentsCount, icon: Users,      bg: "bg-[#effaf6]", color: "text-[#1ec28e]" },
    { label: "Purchases", value: totalPurchases,       icon: RefreshCcw, bg: "bg-blue-50",   color: "text-blue-600" },
    { label: "Books",     value: booksCount,           icon: BookOpen,   bg: "bg-amber-50",  color: "text-amber-600" },
    { label: "Videos",    value: videosCount,          icon: Video,      bg: "bg-purple-50", color: "text-purple-600" },
  ], [uniqueStudentsCount, totalPurchases, booksCount, videosCount]);

  return (
    <main className="min-h-screen w-full bg-[#f0f4f8]">
      <section className="flex min-h-screen flex-col lg:flex-row">
        <Suspense fallback={null}>
          <DashboardSidebar
            profileName={session?.user?.name ?? "Professional User"}
            profileEmail={session?.user?.email ?? ""}
            avatarSrc={session?.user?.image ?? "/person.png"}
          />
        </Suspense>

        <div className="flex-1 overflow-y-auto bg-[#f0f4f8] px-4 py-5 md:px-6 lg:px-7">

          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1ec28e]">Professional Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Live Purchases</h1>
              <p className="mt-1 text-sm text-slate-500">Track every student purchase of your books and videos in real time.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void loadPurchases()}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1ec28e] px-4 text-sm font-semibold text-white transition hover:bg-[#17a87a]"
              >
                <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-[#1ec28e]">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Student Purchases</h2>
                <p className="text-sm text-slate-500">Student name, purchased book/video, and purchase time.</p>
              </div>
              <p className="text-xs text-slate-400">
                {lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : "Waiting for live updates..."}
              </p>
            </div>

            {error && (
              <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1ec28e] border-t-transparent" />
              </div>
            ) : purchases.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                <Users className="h-10 w-10 opacity-30" />
                <p className="text-sm">No student purchases yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Purchased Item</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Purchase Time</th>
                      <th className="px-5 py-3">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((p) => (
                      <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-medium text-slate-900">{p.studentName}</td>
                        <td className="px-5 py-3 text-slate-700">{p.itemTitle}</td>
                        <td className="px-5 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            p.contentType === "book" ? "bg-[#effaf6] text-[#1ec28e]" : "bg-purple-50 text-purple-600"
                          }`}>
                            {p.contentType}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock3 className="h-4 w-4 text-[#1ec28e]" />
                            {formatDate(p.purchaseTime)}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{p.transactionId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && purchases.length > ITEMS_PER_PAGE && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                <p className="text-xs text-slate-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, purchases.length)} of {purchases.length}
                </p>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-slate-600">Page {currentPage} / {totalPages}</span>
                  <button type="button" disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5">
            <Link href="/dashboard/teachers"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
