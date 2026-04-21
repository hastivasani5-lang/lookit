"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import { ArrowLeft, BookOpen, Edit2, Save, Trash2, Users, X } from "lucide-react";

import DashboardSidebar from "@/components/DashboardSidebar";

type BookDetail = {
  id: string;
  name: string;
  category: string;
  mrp: string;
  imageUrl: string;
  url: string;
  source: "file" | "amazon";
  fileName: string;
  sizeLabel: string;
  createdAt: string;
};

type PurchaseRow = {
  studentId: string;
  username: string;
  timeline: string;
  paymentStatus: string;
  amount: string;
  transactionId: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TeacherBookDetailsPage() {
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [purchasedUsersCount, setPurchasedUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", mrp: "", imageUrl: "", url: "" });

  const bookId = useMemo(() => (typeof params?.id === "string" ? params.id : ""), [params?.id]);

  const load = async () => {
    if (!bookId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/profile/library/books/${bookId}`, { cache: "no-store" });
      const payload = (await res.json().catch(() => ({}))) as {
        message?: string;
        book?: BookDetail;
        purchases?: PurchaseRow[];
        purchasedUsersCount?: number;
      };
      if (!res.ok || !payload.book) { setError(payload.message || "Unable to load book details."); return; }
      setBook(payload.book);
      setForm({ name: payload.book.name, category: payload.book.category, mrp: payload.book.mrp, imageUrl: payload.book.imageUrl, url: payload.book.url });
      setPurchases(Array.isArray(payload.purchases) ? payload.purchases : []);
      setPurchasedUsersCount(typeof payload.purchasedUsersCount === "number" ? payload.purchasedUsersCount : 0);
    } catch { setError("Unable to load book details."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [bookId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!bookId) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/profile/library/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await res.json().catch(() => ({}))) as { message?: string; book?: BookDetail };
      if (!res.ok || !payload.book) { setError(payload.message || "Unable to update book."); return; }
      setBook(payload.book);
      setEditing(false);
    } catch { setError("Unable to update book."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!bookId || !confirm("Delete this book? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/profile/library/books/${bookId}`, { method: "DELETE" });
      const payload = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) { setError(payload.message || "Unable to delete book."); return; }
      router.push("/dashboard/teachers?section=add");
    } catch { setError("Unable to delete book."); }
    finally { setDeleting(false); }
  };

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
          <div className="mb-6 flex items-center gap-4">
            <Link href="/dashboard/teachers?section=add"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-[#1ec28e]">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1ec28e]">Professional Dashboard</p>
              <h1 className="mt-0.5 text-2xl font-bold text-slate-900">Book Details</h1>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1ec28e] border-t-transparent" />
            </div>
          ) : !book ? null : (
            <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">

              {/* ── Left: Book card ── */}
              <div className="space-y-5">
                {/* Cover image */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                  <div className="relative h-56 w-full bg-slate-100">
                    {book.imageUrl ? (
                      <Image src={editing ? (form.imageUrl || book.imageUrl) : book.imageUrl}
                        alt={book.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    {/* Status badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-[#1ec28e] px-3 py-1 text-xs font-bold text-white shadow">
                      Published
                    </span>
                  </div>

                  <div className="p-5">
                    {editing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Title</label>
                          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-500">Category</label>
                            <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]" />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-500">Price (₹)</label>
                            <input value={form.mrp} onChange={(e) => setForm((f) => ({ ...f, mrp: e.target.value }))}
                              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]" />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Image URL</label>
                          <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Book URL</label>
                          <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-lg font-bold text-slate-900">{book.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e]">{book.category}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{book.sizeLabel}</span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-[#1ec28e]">₹{book.mrp}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {book.source === "amazon" ? "Amazon Link" : book.fileName} · Added {formatDate(book.createdAt)}
                        </p>
                        {book.url && (
                          <a href={book.url} target="_blank" rel="noreferrer"
                            className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl bg-[#effaf6] px-4 text-sm font-semibold text-[#1ec28e] transition hover:bg-[#1ec28e] hover:text-white">
                            View Book
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  {editing ? (
                    <>
                      <button type="button" onClick={() => void handleSave()} disabled={saving}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1ec28e] py-2.5 text-sm font-bold text-white transition hover:bg-[#17a87a] disabled:opacity-60">
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button type="button" onClick={() => setEditing(false)}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => setEditing(true)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1ec28e] bg-white py-2.5 text-sm font-bold text-[#1ec28e] transition hover:bg-[#effaf6]">
                        <Edit2 className="h-4 w-4" />
                        Edit Book
                      </button>
                      <button type="button" onClick={() => void handleDelete()} disabled={deleting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60">
                        <Trash2 className="h-4 w-4" />
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* ── Right: Purchase insights ── */}
              <div className="space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#effaf6] text-[#1ec28e]">
                      <Users className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{purchasedUsersCount}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Students Purchased</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{purchases.length}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Total Transactions</p>
                  </div>
                </div>

                {/* Purchase table */}
                <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-base font-bold text-slate-900">Purchase History</h3>
                    <p className="text-xs text-slate-400">Students who purchased this book</p>
                  </div>

                  {purchases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                      <Users className="h-10 w-10 opacity-30" />
                      <p className="text-sm">No purchases yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-5 py-3">Student</th>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Amount</th>
                            <th className="px-5 py-3">Transaction ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchases.map((p, i) => (
                            <tr key={`${p.studentId}-${p.transactionId}-${i}`}
                              className="border-t border-slate-100 hover:bg-slate-50 transition">
                              <td className="px-5 py-3 font-medium text-slate-900">{p.username}</td>
                              <td className="px-5 py-3 text-slate-500">{formatDate(p.timeline)}</td>
                              <td className="px-5 py-3">
                                <span className="rounded-full bg-[#effaf6] px-2.5 py-1 text-xs font-semibold text-[#1ec28e]">
                                  {p.paymentStatus}
                                </span>
                              </td>
                              <td className="px-5 py-3 font-semibold text-slate-900">{p.amount}</td>
                              <td className="px-5 py-3 font-mono text-xs text-slate-400">{p.transactionId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
