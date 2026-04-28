"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Bell, Calendar, Clock3, RefreshCcw, Users, CheckCircle, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import DashboardSidebar from "@/components/DashboardSidebar";
import type { AdvanceBooking } from "@/lib/advance-bookings-store";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AdvanceBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const ITEMS_PER_PAGE = 10;

  const [bookings, setBookings] = useState<AdvanceBooking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const loadBookings = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/advance-bookings", { cache: "no-store" });
      const payload = (await res.json().catch(() => ({}))) as { bookings?: AdvanceBooking[]; message?: string };
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) { setError(payload.message || "Unable to load."); return; }
      setBookings(Array.isArray(payload.bookings) ? payload.bookings : []);
    } catch {
      setError("Unable to load booking data.");
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadBookings();
    const interval = setInterval(() => void loadBookings(true), 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setCurrentPage(1); }, [bookings]);

  const handleStatusUpdate = async (id: string, status: AdvanceBooking["status"]) => {
    setUpdatingId(id);
    try {
      await fetch("/api/advance-bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    } catch {
      // silently ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const paginated = bookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => [
    { label: "Total Bookings",  value: bookings.length,                                          bg: "bg-[#effaf6]", color: "text-[#1ec28e]",   icon: Calendar },
    { label: "Pending",         value: bookings.filter((b) => b.status === "pending").length,    bg: "bg-amber-50",  color: "text-amber-600",   icon: Clock3 },
    { label: "Confirmed",       value: bookings.filter((b) => b.status === "confirmed").length,  bg: "bg-blue-50",   color: "text-blue-600",    icon: CheckCircle },
    { label: "Unique Students", value: new Set(bookings.map((b) => b.studentEmail)).size,        bg: "bg-purple-50", color: "text-purple-600",  icon: Users },
  ], [bookings]);

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
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Advance Bookings</h1>
              <p className="mt-1 text-sm text-slate-500">Students who have booked your upcoming classes in advance.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void loadBookings()}
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
                <h2 className="text-base font-bold text-slate-900">Booking Requests</h2>
                <p className="text-sm text-slate-500">Student name, class, contact info and booking status.</p>
              </div>
            </div>

            {error && (
              <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {loading ? (
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
                    {paginated.map((b) => (
                      <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-900">{b.studentName}</p>
                          <p className="text-xs text-slate-400">{b.studentEmail}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-700 max-w-[160px]">
                          <p className="truncate font-medium">{b.classTitle}</p>
                          <p className="text-xs text-slate-400">{b.platform}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5 text-[#1ec28e]" />
                            <span>{b.classDate} {b.classTime}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-500 text-xs">
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
                                title="Confirm booking"
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
                                title="Cancel booking"
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

            {!loading && bookings.length > ITEMS_PER_PAGE && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                <p className="text-xs text-slate-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, bookings.length)} of {bookings.length}
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

        </div>
      </section>
    </main>
  );
}
