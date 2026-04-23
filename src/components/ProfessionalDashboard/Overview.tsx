"use client";

import { useEffect, useState } from "react";
import { BookOpen, DollarSign, Star, TrendingUp, Users, Video } from "lucide-react";

type Stats = {
  booksCount: number;
  videosCount: number;
  followersCount: number;
  totalEarnings: string;
  reviewsCount: number;
  avgRating: string;
  recentPurchases: {
    id: string;
    studentName: string;
    studentEmail: string;
    plan: string;
    amount: string;
    paidAt: string;
  }[];
  weeklyLabels: string[];
  weeklyEarnings: number[];
};

const statCards = (s: Stats) => [
  { label: "Books Uploaded",  value: s.booksCount,      icon: BookOpen,      color: "text-blue-600",    bg: "bg-blue-50" },
  { label: "Videos Uploaded", value: s.videosCount,     icon: Video,         color: "text-purple-600",  bg: "bg-purple-50" },
  { label: "Followers",       value: s.followersCount,  icon: Users,         color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Total Earnings",  value: `₹${s.totalEarnings}`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Reviews",         value: s.reviewsCount,    icon: Star,          color: "text-rose-600",    bg: "bg-rose-50" },
  { label: "Avg Rating",      value: `${s.avgRating} ★`, icon: TrendingUp,   color: "text-teal-600",    bg: "bg-teal-50" },
];

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/professional-stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Stats;
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#2c5a48]">Overview</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#2c5a48]">Overview</h1>
        <p className="text-sm text-gray-500">Could not load stats. Please refresh.</p>
      </div>
    );
  }

  const cards = statCards(stats);
  const maxEarning = Math.max(...stats.weeklyEarnings, 1);
  const chartH = 120;
  const chartW = 400;
  const pad = { t: 10, r: 10, b: 30, l: 36 };
  const innerW = chartW - pad.l - pad.r;
  const innerH = chartH - pad.t - pad.b;
  const barW = innerW / stats.weeklyLabels.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2c5a48]">Overview</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </span>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-[#2c5a48]">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly earnings chart */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Weekly Earnings (₹)</h2>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: 140 }}>
          {/* Y-axis labels */}
          {[0, 0.5, 1].map((frac) => {
            const y = pad.t + innerH - frac * innerH;
            return (
              <g key={frac}>
                <line x1={pad.l} y1={y} x2={chartW - pad.r} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={pad.l - 4} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="9">
                  {Math.round(maxEarning * frac)}
                </text>
              </g>
            );
          })}
          {/* Bars */}
          {stats.weeklyEarnings.map((val, i) => {
            const barH = (val / maxEarning) * innerH;
            const x = pad.l + i * barW + barW * 0.15;
            const y = pad.t + innerH - barH;
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW * 0.7} height={barH} rx="4" fill="#1ec28e" opacity="0.85" />
                <text x={x + barW * 0.35} y={chartH - pad.b + 14} textAnchor="middle" fill="#64748b" fontSize="9">
                  {stats.weeklyLabels[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Recent purchases */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Recent Purchases</h2>
        {stats.recentPurchases.length === 0 ? (
          <p className="text-sm text-gray-400">No purchases yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="pb-2 pr-4">Student</th>
                  <th className="pb-2 pr-4">Plan</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPurchases.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 text-slate-700">
                    <td className="py-2 pr-4">
                      <p className="font-medium">{p.studentName}</p>
                      <p className="text-xs text-slate-400">{p.studentEmail}</p>
                    </td>
                    <td className="py-2 pr-4 text-xs">{p.plan}</td>
                    <td className="py-2 pr-4 font-semibold text-emerald-600">{p.amount}</td>
                    <td className="py-2 text-xs text-slate-400">{new Date(p.paidAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
