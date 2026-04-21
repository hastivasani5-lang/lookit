"use client";

import { Suspense, useEffect, useState } from "react";
import { Bell, RefreshCcw, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import DashboardSidebar from "@/components/DashboardSidebar";

type Follower = {
  studentId: string;
  professionalId: string;
  followedAt: string;
  studentName?: string | null;
  studentEmail?: string | null;
  studentImage?: string | null;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
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
    if (!q) return true;
    return (
      (f.studentName ?? "").toLowerCase().includes(q) ||
      (f.studentEmail ?? "").toLowerCase().includes(q) ||
      f.studentId.toLowerCase().includes(q)
    );
  });

  const todayCount = followers.filter((f) => Date.now() - new Date(f.followedAt).getTime() < 86400000).length;
  const weekCount  = followers.filter((f) => Date.now() - new Date(f.followedAt).getTime() < 604800000).length;

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
              { label: "Total Followers", value: followers.length, bg: "bg-[#effaf6]", color: "text-[#1ec28e]" },
              { label: "This Week",       value: weekCount,         bg: "bg-blue-50",   color: "text-blue-600" },
              { label: "Today",           value: todayCount,        bg: "bg-amber-50",  color: "text-amber-600" },
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

          {/* Followers list */}
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
            {/* Table header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">All Followers</h2>
                <p className="text-xs text-slate-400">{followers.length} student{followers.length !== 1 ? "s" : ""} following you</p>
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#1ec28e] sm:w-60"
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
                <p className="text-sm font-medium">{search ? "No followers match your search." : "No followers yet."}</p>
                {!search && <p className="text-xs">Share your profile to get followers.</p>}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map((f, i) => {
                  const name  = f.studentName  ?? "Unknown Student";
                  const email = f.studentEmail ?? "";
                  const img   = f.studentImage;
                  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

                  return (
                    <div key={`${f.studentId}-${f.followedAt}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition">

                      {/* Serial */}
                      <span className="hidden w-6 shrink-0 text-center text-xs text-slate-400 sm:block">{i + 1}</span>

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {img ? (
                          <Image src={img} alt={name} width={44} height={44}
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-[#1ec28e]/20" />
                        ) : (
                          <div className="grid h-11 w-11 place-items-center rounded-full bg-[#effaf6] text-sm font-bold text-[#1ec28e] ring-2 ring-[#1ec28e]/20">
                            {initials}
                          </div>
                        )}
                        {/* Online dot - show if followed today */}
                        {Date.now() - new Date(f.followedAt).getTime() < 86400000 && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#1ec28e]" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
                        {email && (
                          <p className="truncate text-xs text-slate-400">{email}</p>
                        )}
                        <p className="mt-0.5 text-xs text-slate-400 sm:hidden">{formatDate(f.followedAt)}</p>
                      </div>

                      {/* Followed at - desktop */}
                      <div className="hidden shrink-0 text-right sm:block">
                        <p className="text-xs font-medium text-slate-600">{timeAgo(f.followedAt)}</p>
                        <p className="text-[11px] text-slate-400">{formatDate(f.followedAt)}</p>
                      </div>

                      {/* Badge */}
                      <span className="shrink-0 rounded-full bg-[#effaf6] px-2.5 py-1 text-[11px] font-semibold text-[#1ec28e]">
                        Following
                      </span>
                    </div>
                  );
                })}
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
