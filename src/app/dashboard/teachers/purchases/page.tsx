"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Award, Bell, BookOpen, Calendar, CheckCircle, Clock3, RefreshCcw, Users, Video, X, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import DashboardSidebar from "@/components/DashboardSidebar";
import type { AdvanceBooking } from "@/lib/advance-bookings-store";
import { groupPurchases, type StudentGroup } from "@/lib/group-purchases";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const ITEMS_PER_PAGE = 10;

  const [activeTab, setActiveTab] = useState<"purchases" | "bookings">("purchases");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

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

  // ── Certificate state ────────────────────────────────────────────────────
  const [certSent, setCertSent] = useState<boolean | null>(null);
  const [certSending, setCertSending] = useState(false);
  const [certError, setCertError] = useState("");
  const [certSuccess, setCertSuccess] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certMessage, setCertMessage] = useState("");
  const [certImageDataUrl, setCertImageDataUrl] = useState<string | null>(null);

  // ── Bookings state ───────────────────────────────────────────────────────
  const [bookings, setBookings] = useState<AdvanceBooking[]>([]);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const loadPurchases = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    if (!isRefresh) setError("");
    try {
      const res = await fetch("/api/profile/purchases", { cache: "no-store" });
      const payload = (await res.json().catch(() => ({}))) as PurchasePayload;
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        if (!isRefresh) setError(payload.message || "Unable to load.");
        return;
      }
      setPurchases(Array.isArray(payload.purchases) ? payload.purchases : []);
      setUniqueStudentsCount(payload.uniqueStudentsCount ?? 0);
      setTotalPurchases(payload.totalPurchases ?? 0);
      setBooksCount(payload.booksCount ?? 0);
      setVideosCount(payload.videosCount ?? 0);
      setLastUpdated(payload.lastUpdated ?? null);
    } catch { if (!isRefresh) setError("Unable to load purchase data."); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch("/api/advance-bookings", { cache: "no-store" });
      if (!res.ok) { setBookingsLoading(false); return; } // silently ignore auth errors
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
    }, 30000); // reduced from 5s to 30s to avoid hammering session
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setCurrentPage(1); }, [purchases]);
  useEffect(() => { setBookingsPage(1); }, [bookings]);

  useEffect(() => {
    if (!selectedStudentId) {
      setCertSent(null);
      setCertSending(false);
      setCertError("");
      setCertSuccess(false);
      setCertModalOpen(false);
      setCertMessage("");
      setCertImageDataUrl(null);
      return;
    }
    setCertSent(null); // show spinner while loading
    void (async () => {
      try {
        const res = await fetch(`/api/profile/certificates?studentId=${selectedStudentId}`, { cache: "no-store" });
        if (!res.ok) { setCertSent(false); return; }
        const data = (await res.json().catch(() => ({ certificates: [] }))) as { certificates: unknown[] };
        setCertSent(Array.isArray(data.certificates) && data.certificates.length > 0);
      } catch {
        setCertSent(false);
      }
    })();
  }, [selectedStudentId]);

  const handleSendCertificate = async () => {
    if (!selectedStudentId) return;
    const studentName = purchases.find((p) => p.studentId === selectedStudentId)?.studentName ?? "";
    setCertSending(true);
    setCertError("");
    try {
      const res = await fetch("/api/profile/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          studentName,
          message: certMessage,
          imageDataUrl: certImageDataUrl ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setCertError(data.message ?? "Failed to send certificate. Please try again.");
      } else {
        setCertSent(true);
        setCertSuccess(true);
        setCertModalOpen(false);
        setCertMessage("");
        setCertImageDataUrl(null);
      }
    } catch {
      setCertError("Failed to send certificate. Please try again.");
    } finally {
      setCertSending(false);
    }
  };

  const bookingsTotalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const paginatedBookings = bookings.slice((bookingsPage - 1) * ITEMS_PER_PAGE, bookingsPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => [
    { label: "Students",  value: uniqueStudentsCount, icon: Users,      bg: "bg-[#effaf6]", color: "text-[#1ec28e]" },
    { label: "Purchases", value: totalPurchases,       icon: RefreshCcw, bg: "bg-blue-50",   color: "text-blue-600" },
    { label: "Books",     value: booksCount,           icon: BookOpen,   bg: "bg-amber-50",  color: "text-amber-600" },
    { label: "Videos",    value: videosCount,          icon: Video,      bg: "bg-purple-50", color: "text-purple-600" },
  ], [uniqueStudentsCount, totalPurchases, booksCount, videosCount]);

  const studentGroups = useMemo(() => groupPurchases(purchases), [purchases]);

  const totalPages = Math.max(1, Math.ceil(studentGroups.length / ITEMS_PER_PAGE));
  const paginated = studentGroups.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
                        <th className="px-5 py-3">Purchases</th>
                        <th className="px-5 py-3">Last Purchase Time</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((g) => (
                        <tr key={g.studentId} className="border-t border-slate-100 hover:bg-slate-50 transition">
                          <td className="px-5 py-3 font-medium text-slate-900">{g.studentName}</td>
                          <td className="px-5 py-3 text-slate-700">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              {g.purchaseCount} {g.purchaseCount === 1 ? "purchase" : "purchases"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock3 className="h-4 w-4 text-[#1ec28e]" />
                              {formatDate(g.latestPurchaseTime)}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <button
                              type="button"
                              onClick={() => setSelectedStudentId(g.studentId)}
                              className="rounded-lg bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e] hover:bg-[#d4f5ea] transition"
                            >
                              View All
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && studentGroups.length > ITEMS_PER_PAGE && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                  <p className="text-xs text-slate-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, studentGroups.length)} of {studentGroups.length}
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

        </div>
      </section>

      {/* ── STUDENT PURCHASES DRAWER ─────────────────────────────────── */}
      {selectedStudentId && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedStudentId(null)}
          />
          <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">{purchases.find((p) => p.studentId === selectedStudentId)?.studentName ?? ""}</h2>
                <p className="text-xs text-slate-500">
                  {purchases.filter((p) => p.studentId === selectedStudentId).length} purchases
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentId(null)}
                className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {purchases
                .filter((p) => p.studentId === selectedStudentId)
                .map((p) => (
                  <div key={p.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900 text-sm">{p.itemTitle}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        p.contentType === "book" ? "bg-[#effaf6] text-[#1ec28e]" : "bg-purple-50 text-purple-600"
                      }`}>
                        {p.contentType}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock3 className="h-3.5 w-3.5 text-[#1ec28e]" />
                      {formatDate(p.purchaseTime)}
                    </div>
                    <p className="mt-1 font-mono text-xs text-slate-400">{p.transactionId}</p>
                  </div>
                ))}
            </div>
            {/* Certificate footer */}
            <div className="border-t border-slate-100 px-5 py-4">
              {certSuccess && (
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#effaf6] px-4 py-2.5 text-sm font-semibold text-[#1ec28e]">
                  <Award className="h-4 w-4" />
                  Certificate sent successfully
                </div>
              )}
              {certError && (
                <p className="mb-3 text-xs text-red-500">{certError}</p>
              )}
              {certSent === null ? (
                <div className="flex items-center justify-center py-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1ec28e] border-t-transparent" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCertModalOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1ec28e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17a87a]"
                >
                  <Award className="h-4 w-4" />
                  {certSent ? "Send Another Certificate" : "Send Certificate"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
      {/* ── CERTIFICATE MODAL ────────────────────────────────────── */}
      {certModalOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => setCertModalOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Send Certificate</h3>
              <button
                type="button"
                onClick={() => setCertModalOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Image upload */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Certificate Image (optional)</label>
              {certImageDataUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={certImageDataUrl} alt="Certificate preview" className="h-32 w-full rounded-xl object-cover border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => setCertImageDataUrl(null)}
                    className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-slate-500 shadow hover:text-red-500 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:border-[#1ec28e] hover:text-[#1ec28e] transition">
                  <Award className="h-6 w-6" />
                  <span className="text-xs font-medium">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => setCertImageDataUrl(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              )}
            </div>

            {/* Message */}
            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Message (optional)</label>
              <textarea
                value={certMessage}
                onChange={(e) => setCertMessage(e.target.value)}
                placeholder="e.g. Congratulations on completing the course!"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e] transition"
              />
            </div>

            {certError && <p className="mb-3 text-xs text-red-500">{certError}</p>}

            <button
              type="button"
              disabled={certSending}
              onClick={() => void handleSendCertificate()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1ec28e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17a87a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {certSending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Award className="h-4 w-4" />
              )}
              {certSending ? "Sending..." : "Send Certificate"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
