"use client";

import AdminCalendarWidget from "@/components/admin/AdminCalendarWidget";

type TrendSeries = { label: string; color: string; values: number[] };

type DashboardRow = {
  id: string;
  name: string;
  email: string;
  meta: string;
  status: string;
  updated: string;
};

type Props = {
  stats: { studentCount: string; professionalCount: string; transactionCount: string };
  trendLabels: string[];
  trendSeries: TrendSeries[];
  todayTableActiveTab: "Student" | "Teacher" | "Notification";
  onTabChange: (tab: "Student" | "Teacher" | "Notification") => void;
  paginatedRows: DashboardRow[];
  totalRows: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const W = 470, H = 220;
const PAD = { top: 18, right: 20, bottom: 34, left: 42 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

export default function AdminDashboardPanel({
  stats,
  trendLabels,
  trendSeries,
  todayTableActiveTab,
  onTabChange,
  paginatedRows,
  totalRows,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const trendMax = Math.max(...trendSeries.flatMap((s) => s.values), 1);

  const trendPoints = trendSeries.map((series) =>
    series.values.map((v, i) => ({
      x: PAD.left + (CW / (trendLabels.length - 1)) * i,
      y: PAD.top + CH - (v / trendMax) * CH,
      value: v,
    })),
  );

  const trendPaths = trendPoints.map((points) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
  );

  return (
    <div className="rounded-2xl neumorph-admin-card p-4 sm:p-5">
      <h2 className="text-3xl font-semibold text-slate-800">Welcome.</h2>
      <p className="mb-4 text-sm text-slate-500">Navigate the future of education with Schooli.</p>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl neumorph-admin-stat p-4">
          <p className="text-xs text-[#2c5a48]">Students</p>
          <p className="text-3xl font-bold text-[#0f2c21]">{stats.studentCount}</p>
        </div>
        <div className="rounded-2xl neumorph-admin-stat p-4">
          <p className="text-xs text-[#2c5a48]">Teachers</p>
          <p className="text-3xl font-bold text-[#0f2c21]">{stats.professionalCount}</p>
        </div>
        <div className="rounded-2xl neumorph-admin-stat p-4">
          <p className="text-xs text-[#2c5a48]">Awards</p>
          <p className="text-3xl font-bold text-[#0f2c21]">{stats.transactionCount}</p>
        </div>
      </div>

      {/* Chart + Calendar */}
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {/* Trend chart */}
        <div className="space-y-4">
          <div className="h-90 rounded-2xl neumorph-admin-card border border-transparent p-4 bg-white!">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">User & Teacher Registrations</h3>
                <p className="text-xs text-slate-500">New students and teachers joined over the last 7 days.</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {trendSeries.map((s) => (
                  <span key={s.label} className="inline-flex items-center gap-2">
                    <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2.5 w-2.5">
                      <circle cx="5" cy="5" r="5" fill={s.color} />
                    </svg>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-61.25 w-full">
              {[0, 20, 40, 60, 80, 100].map((tick) => {
                const y = PAD.top + CH - (tick / 100) * CH;
                return (
                  <g key={tick}>
                    <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    <text x={10} y={y + 4} fill="#94a3b8" fontSize="10">{tick}</text>
                  </g>
                );
              })}
              {trendLabels.map((label, i) => {
                const x = PAD.left + (CW / (trendLabels.length - 1)) * i;
                return (
                  <text key={label} x={x} y={H - 10} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500">{label}</text>
                );
              })}
              {trendPaths.map((path, si) => (
                <path key={trendSeries[si].label} d={path} fill="none" stroke={trendSeries[si].color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {trendPoints.map((points, si) =>
                points.map((p, pi) => (
                  <g key={`${trendSeries[si].label}-${pi}`}>
                    <circle cx={p.x} cy={p.y} r="4" fill={trendSeries[si].color} />
                    <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
                  </g>
                )),
              )}
            </svg>
            <p className="mt-1 text-center text-xs text-slate-500">Month</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="space-y-4">
          <div className="h-90 rounded-2xl neumorph-admin-card border border-transparent p-4">
            <style>{`
              .neumorph-admin-main { background:#eef5f3; box-shadow:20px 20px 40px #d0dbd6,-20px -20px 40px #ffffff; }
              .neumorph-admin-content { background:#eef5f3; }
              .neumorph-admin-card { background:#eef5f3; box-shadow:12px 12px 24px #d0dbd6,-12px -12px 24px #ffffff; transition:all 0.25s cubic-bezier(0.2,0,0,1); }
              .neumorph-admin-stat { background:#eef5f3; box-shadow:8px 8px 16px #d0dbd6,-8px -8px 16px #ffffff; transition:all 0.2s; }
              .neumorph-admin-stat:active { box-shadow:1px 1px 2px #d0dbd6,-1px -1px 2px #ffffff; }
            `}</style>
            <div className="h-full rounded-xl border border-slate-200 bg-white p-3">
              <AdminCalendarWidget />
            </div>
          </div>
        </div>
      </div>

      {/* Today table */}
      <div className="mt-4 rounded-2xl neumorph-admin-card border border-transparent p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Today</h3>
          <div className="flex items-center gap-2">
            {(["Student", "Teacher", "Notification"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                  todayTableActiveTab === tab
                    ? "border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">
                  {todayTableActiveTab === "Student" && "Grade"}
                  {todayTableActiveTab === "Teacher" && "Specialization"}
                  {todayTableActiveTab === "Notification" && "Type"}
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.meta}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      todayTableActiveTab === "Notification"
                        ? "bg-[#e7f4ff] text-[#2c6fb8]"
                        : "bg-[#e8f9ee] text-[#178c43]"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.updated}</td>
                </tr>
              ))}
              {totalRows === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-sm text-slate-500">No records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalRows > 0 && (
          <div className="mt-3 flex justify-end">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45">
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} type="button" onClick={() => onPageChange(page)}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                    page === currentPage ? "border-[#178c43] bg-[#178c43] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                  {page}
                </button>
              ))}
              <button type="button" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
