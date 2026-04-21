"use client";

import { Suspense, useEffect, useState } from "react";
import { Bell, RefreshCcw, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import DashboardSidebar from "@/components/DashboardSidebar";

type Follower = {
  studentId: string;
  professionalId: string;
  followedAt: string;
  studentName?: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function FollowersPage() {
  const { data: session } = useSession();
  const professionalId = session?.user?.id ?? null;

  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadFollowers = async (isRefresh = false) => {
    if (!professionalId) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/follows?professionalId=${professionalId}`, { cache: "no-store" });
      if (!res.ok) { setError("Unable to load followers."); return; }
      const data = (await res.json()) as Follower[];
      setFollowers(Array.isArray(data) ? data : []);
    } catch { setError("Unable to load followers."); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { void loadFollowers(); }, [professionalId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = followers.filter((f) => {
    const q = search.trim().toLowerCase();
    return !q || (f.studentName ?? f.studentId).toLowerCase().includes(q);
  });

  const todayCount = followers.filter((f) => Date.now() - new Date(f.followedAt).getTime() < 86400000).length;
  const weekCount  = followers.filter((f) => Date.now() - new Date(f.followedAt).getTime() < 604800000).length;

  return (
    <main className="h-screen w-full overflow-hidden bg-[#f0f4f8]">
      <section className="grid h-full w-full lg:grid-cols-[260px_minmax(0,1fr)]">
        <Suspense fallback={null}>
          <DashboardSidebar
            profileName={session?.user?.name ?? "Professional User"}
            profileEmail={session?.user?.email ?? ""}
            avatarSrc={session?.user?.image ?? "/person.png"}
          />
        </Suspense>

        <div className="h-full overflow-y-auto bg-[#f0f4f8] px-4 py-5 md:px-6 lg:px-7">

          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1ec28e]">Professional Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Followers</h1>
              <p className="mt-1 text-sm text-slate-500">Students who are following your profile.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void loadFollowers(true)}
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
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Followers", value: followers.length,  bg: "bg-[#effaf6]", color: "text-[#1ec28e]" },
              { label: "This Week",       value: weekCount,          bg: "bg-blue-50",   color: "text-blue-600" },
              { label: "Today",           value: todayCount,         bg: "bg-amber-50",  color: "text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.color}`}>
                  <Users className="h-5 w-5" />
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-bold text-slate-900">All Followers</h2>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#1ec28e] sm:w-56"
              />
            </div>

            {error && (
              <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1ec28e] border-t-transparent" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                <Users className="h-10 w-10 opacity-30" />
                <p className="text-sm">{search ? "No followers match your search." : "No followers yet."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">#</th>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Student ID</th>
                      <th className="px-5 py-3">Followed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f, i) => (
                      <tr key={`${f.studentId}-${f.followedAt}`} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3 text-slate-400">{i + 1}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#effaf6] text-xs font-bold text-[#1ec28e]">
                              {(f.studentName ?? f.studentId).charAt(0).toUpperCase()}
                            </span>
                            <span className="font-medium text-slate-900">{f.studentName ?? "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-400">{f.studentId.slice(0, 8)}…</td>
                        <td className="px-5 py-3 text-slate-500">{formatDate(f.followedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
