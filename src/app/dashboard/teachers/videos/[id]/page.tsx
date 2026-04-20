"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";


type VideoDetail = {
  id: string;
  name: string;
  mrp: string;
  url: string;
  source: "file" | "youtube";
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

export default function TeacherVideoDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [purchasedUsersCount, setPurchasedUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: "", mrp: "", url: "" });

  const videoId = useMemo(() => (typeof params?.id === "string" ? params.id : ""), [params?.id]);

  const load = async () => {
    if (!videoId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/profile/library/videos/${videoId}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        video?: VideoDetail;
        purchases?: PurchaseRow[];
        purchasedUsersCount?: number;
      };

      if (!response.ok || !payload.video) {
        setError(payload.message || "Unable to load video details.");
        return;
      }

      setVideo(payload.video);
      setForm({
        name: payload.video.name,
        mrp: payload.video.mrp,
        url: payload.video.url,
      });
      setPurchases(Array.isArray(payload.purchases) ? payload.purchases : []);
      setPurchasedUsersCount(typeof payload.purchasedUsersCount === "number" ? payload.purchasedUsersCount : 0);
    } catch {
      setError("Unable to load video details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [videoId]);

  const handleSave = async () => {
    if (!videoId) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/profile/library/videos/${videoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string; video?: VideoDetail };

      if (!response.ok || !payload.video) {
        setError(payload.message || "Unable to update video.");
        return;
      }

      setVideo(payload.video);
      setEditing(false);
    } catch {
      setError("Unable to update video.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!videoId) return;
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/profile/library/videos/${videoId}`, { method: "DELETE" });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setError(payload.message || "Unable to delete video.");
        return;
      }

      router.push("/dashboard/teachers");
    } catch {
      setError("Unable to delete video.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef5f3] px-3 pb-12 pt-28 sm:px-4 md:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-[1600px] gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">


        <div className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Video Details</h1>
          <Link href="/dashboard/teachers" className="rounded-xl bg-[#effaf6] px-4 py-2 text-sm font-semibold text-[#1ec28e]">
            Back
          </Link>
        </div>

        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

        {!loading && video ? (
          <>
            <div className="grid gap-4 md:grid-cols-[340px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-2xl bg-black">
                {video.source === "youtube" ? (
                  <iframe
                    className="aspect-video w-full"
                    src={editing ? form.url || video.url : video.url}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={editing ? form.url || video.url : video.url} controls className="aspect-video w-full" />
                )}
              </div>

              <div className="space-y-3">
                {editing ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="h-11 rounded-xl border border-slate-200 px-3 text-sm md:col-span-2" />
                    <input value={form.mrp} onChange={(e) => setForm((f) => ({ ...f, mrp: e.target.value }))} placeholder="MRP" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" />
                    <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="Video URL" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-slate-900">{video.name}</h2>
                    <p className="text-sm font-semibold text-[#1ec28e]">MRP ₹{video.mrp}</p>
                    <p className="text-xs text-slate-500">{video.source === "youtube" ? "YouTube" : "Uploaded File"} • {video.sizeLabel}</p>
                    <a href={video.url} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-[#effaf6] px-3 py-1.5 text-xs font-semibold text-[#1ec28e]">
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
