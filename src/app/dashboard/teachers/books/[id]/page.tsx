"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";

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
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function TeacherBookDetailsPage() {
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
    if (!bookId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/profile/library/books/${bookId}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        book?: BookDetail;
        purchases?: PurchaseRow[];
        purchasedUsersCount?: number;
      };

      if (!response.ok || !payload.book) {
        setError(payload.message || "Unable to load book details.");
        return;
      }

      setBook(payload.book);
      setForm({
        name: payload.book.name,
        category: payload.book.category,
        mrp: payload.book.mrp,
        imageUrl: payload.book.imageUrl,
        url: payload.book.url,
      });
      setPurchases(Array.isArray(payload.purchases) ? payload.purchases : []);
      setPurchasedUsersCount(typeof payload.purchasedUsersCount === "number" ? payload.purchasedUsersCount : 0);
    } catch {
      setError("Unable to load book details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [bookId]);

  const handleSave = async () => {
    if (!bookId) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/profile/library/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string; book?: BookDetail };

      if (!response.ok || !payload.book) {
        setError(payload.message || "Unable to update book.");
        return;
      }

      setBook(payload.book);
      setEditing(false);
    } catch {
      setError("Unable to update book.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!bookId) return;
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/profile/library/books/${bookId}`, { method: "DELETE" });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setError(payload.message || "Unable to delete book.");
        return;
      }

      router.push("/dashboard/teachers");
    } catch {
      setError("Unable to delete book.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef5f3] px-3 pb-12 pt-28 sm:px-4 md:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-[1600px] gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProfessionalSidebar />

        <div className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Book Details</h1>
          <Link href="/dashboard/teachers" className="rounded-xl bg-[#effaf6] px-4 py-2 text-sm font-semibold text-[#1ec28e]">
            Back
          </Link>
        </div>

        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

        {!loading && book ? (
          <>
            <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <img src={editing ? form.imageUrl || book.imageUrl : book.imageUrl} alt={book.name} className="h-52 w-full rounded-2xl object-cover" />

              <div className="space-y-3">
                {editing ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" />
                    <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Category" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" />
                    <input value={form.mrp} onChange={(e) => setForm((f) => ({ ...f, mrp: e.target.value }))} placeholder="MRP" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" />
                    <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="Image URL" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" />
                    <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="Book URL" className="h-11 rounded-xl border border-slate-200 px-3 text-sm md:col-span-2" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-slate-900">{book.name}</h2>
                    <p className="text-sm text-slate-500">{book.category}</p>
                    <p className="text-sm font-semibold text-[#1ec28e]">MRP ₹{book.mrp}</p>
                    <p className="text-xs text-slate-500">{book.source === "amazon" ? "Amazon Link" : book.fileName} • {book.sizeLabel}</p>
                    <a href={book.url} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-[#effaf6] px-3 py-1.5 text-xs font-semibold text-[#1ec28e]">
                      View
                    </a>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => (editing ? void handleSave() : setEditing(true))}
                    disabled={saving}
                    className="rounded-xl bg-[#1ec28e] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    {editing ? (saving ? "Saving..." : "Save") : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-xl bg-[#fff1f1] px-4 py-2 text-sm font-semibold text-[#cc2a2a] disabled:opacity-70"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-base font-semibold text-slate-900">Purchase Insights</h3>
              <p className="mt-1 text-sm text-slate-600">Users purchased: {purchasedUsersCount}</p>

              {purchases.length === 0 ? (
                <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">No purchase data available yet.</p>
              ) : (
                <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[680px] text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Username</th>
                        <th className="px-3 py-2">Timeline</th>
                        <th className="px-3 py-2">Payment Status</th>
                        <th className="px-3 py-2">Amount</th>
                        <th className="px-3 py-2">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase, index) => (
                        <tr key={`${purchase.studentId}-${purchase.transactionId}-${index}`} className="border-t border-slate-100 text-slate-700">
                          <td className="px-3 py-2">{purchase.username}</td>
                          <td className="px-3 py-2">{formatDate(purchase.timeline)}</td>
                          <td className="px-3 py-2">{purchase.paymentStatus}</td>
                          <td className="px-3 py-2">{purchase.amount}</td>
                          <td className="px-3 py-2">{purchase.transactionId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}
        </div>
      </section>
    </main>
  );
}
