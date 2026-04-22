"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Bell, BookOpen, Calendar, CheckCircle, Clock3, RefreshCcw, Users, Video, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import DashboardSidebar from "@/components/DashboardSidebar";
import type { AdvanceBooking } from "@/lib/advance-bookings-store";

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

  const [activeTab, setActiveTab] = useState<"purchases" | "bookings">("purchases");

  // ── Purchases state ──────────────────────────────────────────────────────
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

  // ── Bookings state ───────────────────────────────────────────────────────
  const [bookings, setBookings] = useState<AdvanceBooking[]>([]);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch("/api/advance-bookings", { cache: "no-store" });
      const payload = (await res.json().catch(() => ({}))) as { bookings?: AdvanceBooking[] };
      setBookings(Array.isArray(payload.bookings) ? payload.bookings : []);
    } catch { /* ignore */ }
    finally { setBookingsLoading(false); }
  };

  useEffect(() => {
    void loadPurchases();
    void loadBookings();
    const interval = setInterval(() => {
      void loadPurchases(true);
      void loadBookings();
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setCurrentPage(1); }, [purchases]);
  useEffect(() => { setBookingsPage(1); }, [bookings]);

  const totalPages = Math.max(1, Math.ceil(purchases.length / ITEMS_PER_PAGE));
  const paginated = purchases.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const bookingsTotalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const paginatedBookings = bookings.slice((bookingsPage - 1) * ITEMS_PER_PAGE, bookingsPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => [
    { label: "Students",  value: uniqueStudentsCount, icon: Users,      bg: "bg-[#effaf6]", color: "text-[#1ec28e]" },
    { label: "Purchases", value: totalPurchases,       icon: RefreshCcw, bg: "bg-blue-50",   color: "text-blue-600" },
    { label: "Books",     value: booksCount,           icon: BookOpen,   bg: "bg-amber-50",  color: "text-amber-600" },
    { label: "Videos",    value: videosCount,          icon: Video,      bg: "bg-purple-50", color: "text-purple-600" },
  ], [uniqueStudentsCount, totalPurchases, booksCount, videosCount]);

  const handleStatusUpdate = async (id: string, status: AdvanceBooking["status"]) => {
    setUpdatingId(id);
    try {
      await fetch("/api/advance-bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    } catch { /* ignore */ }
    finally { setUpdatingId(null); }
  };

  const statusBadge = (status: AdvanceBooking["status"]) => {
    if (status === "confirmed") return "bg-blue-50 text-blue-600";
    if (status === "cancelled") return "bg-red-50 text-red-500";
    return "bg-amber-50 text-amber-600";
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-[#f0f4f8]" suppressHydrationWarning>
      <section className="flex h-full flex-col lg:flex-row">
        <Suspense fallback={null}>
          <DashboardSidebar
            profileName={session?.user?.name ?? "Professional User"}
            profileEmail={session?.user?.email ?? ""}
            avatarSrc={session?.user?.image ?? "/person.png"}
          />
        </Suspense>

        <div className="flex-1 overflow-y-auto bg-[#f0f4f8] px-4 py-5 md:px-6 lg:px-7 lg:h-full">

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
                onClick={() => { void loadPurchases(); void loadBookings(); }}
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

          {/* Tab switcher */}
          <div className="mb-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("purchases")}
              className={`inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                activeTab === "purchases"
                  ? "bg-[#1ec28e] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Student Purchases
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                activeTab === "bookings"
                  ? "bg-[#1ec28e] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Upcoming Bookings
              {bookings.filter((b) => b.status === "pending").length > 0 && (
                <span className="ml-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-xs font-bold text-white">
                  {bookings.filter((b) => b.status === "pending").length}
                </span>
              )}
            </button>
          </div>

          {/* ── PURCHASES TABLE ─────────────────────────────────────────── */}
          {activeTab === "purchases" && (
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
          )}

          {/* ── UPCOMING BOOKINGS TABLE ──────────────────────────────────── */}
          {activeTab === "bookings" && (
            <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
              <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Upcoming Class Bookings</h2>
                  <p className="text-sm text-slate-500">Students who booked your upcoming classes in advance.</p>
                </div>
                <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">
                  {bookings.length} total
                </span>
              </div>

              {bookingsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1ec28e] border-t-transparent" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                  <Calendar className="h-10 w-10 opacity-30" />
                  <p className="text-sm">No advance bookings yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Class</th>
                        <th className="px-5 py-3">Date & Time</th>
                        <th className="px-5 py-3">Contact</th>
                        <th className="px-5 py-3">Booked At</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBookings.map((b) => (
                        <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                          <td className="px-5 py-3">
                            <p className="font-medium text-slate-900">{b.studentName}</p>
                            <p className="text-xs text-slate-400">{b.studentEmail}</p>
                          </td>
                          <td className="px-5 py-3 max-w-[160px]">
                            <p className="truncate font-medium text-slate-700">{b.classTitle}</p>
                            <p className="text-xs text-slate-400">{b.platform}</p>
                          </td>
                          <td className="px-5 py-3 text-slate-600">
                            <div className="flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5 text-[#1ec28e]" />
                              <span>{b.classDate} {b.classTime}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-500">
                            {b.studentPhone || "—"}
                            {b.message && (
                              <p className="mt-0.5 text-slate-400 italic line-clamp-1">"{b.message}"</p>
                            )}
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-500">{formatDate(b.bookedAt)}</td>
                          <td className="px-5 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadge(b.status)}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {b.status !== "confirmed" && (
                                <button
                                  type="button"
                                  disabled={updatingId === b.id}
                                  onClick={() => handleStatusUpdate(b.id, "confirmed")}
                                  className="inline-flex h-7 items-center gap-1 rounded-lg bg-blue-50 px-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition disabled:opacity-50"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Confirm
                                </button>
                              )}
                              {b.status !== "cancelled" && (
                                <button
                                  type="button"
                                  disabled={updatingId === b.id}
                                  onClick={() => handleStatusUpdate(b.id, "cancelled")}
                                  className="inline-flex h-7 items-center gap-1 rounded-lg bg-red-50 px-2.5 text-xs font-semibold text-red-500 hover:bg-red-100 transition disabled:opacity-50"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!bookingsLoading && bookings.length > ITEMS_PER_PAGE && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                  <p className="text-xs text-slate-500">
                    Showing {(bookingsPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(bookingsPage * ITEMS_PER_PAGE, bookings.length)} of {bookings.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={bookingsPage === 1}
                      onClick={() => setBookingsPage((p) => Math.max(1, p - 1))}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                      Previous
                    </button>
                    <span className="text-xs font-semibold text-slate-600">Page {bookingsPage} / {bookingsTotalPages}</span>
                    <button type="button" disabled={bookingsPage === bookingsTotalPages}
                      onClick={() => setBookingsPage((p) => Math.min(bookingsTotalPages, p + 1))}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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
