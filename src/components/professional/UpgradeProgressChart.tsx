"use client";
import { CreditCard } from "lucide-react";

export default function UpgradeProgressChart({
  profileBoostedUntil,
  onUpgrade,
}: {
  profileBoostedUntil: string | null;
  onUpgrade: () => void;
}) {
  const now = new Date();

  // Calculate boost progress
  let totalDays = 30;
  let daysUsed = 0;
  let daysLeft = 0;
  let isActive = false;
  let endDate: Date | null = null;

  if (profileBoostedUntil) {
    endDate = new Date(profileBoostedUntil);
    if (endDate > now) {
      isActive = true;
      // Estimate start as 30 days before end (default plan)
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      daysUsed = Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      daysLeft = Math.max(0, totalDays - daysUsed);
    }
  }

  const pctUsed = totalDays > 0 ? Math.min(100, Math.round((daysUsed / totalDays) * 100)) : 0;
  const pctLeft = 100 - pctUsed;

  // SVG donut chart values
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const usedDash = (pctUsed / 100) * circumference;
  const leftDash = (pctLeft / 100) * circumference;

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Profile Boost</h3>
          <p className="text-xs text-slate-500 mt-0.5">Upgrade progress tracker</p>
        </div>
        {!isActive && (
          <button
            onClick={onUpgrade}
            className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 text-xs font-semibold text-white transition hover:opacity-90"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Upgrade
          </button>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130">
            {/* Background track */}
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="14"
            />
            {isActive ? (
              <>
                {/* Used portion (green) */}
                <circle
                  cx="65" cy="65" r={radius}
                  fill="none"
                  stroke="#1ec28e"
                  strokeWidth="14"
                  strokeDasharray={`${usedDash} ${circumference - usedDash}`}
                  strokeDashoffset={circumference * 0.25}
                  strokeLinecap="round"
                />
                {/* Remaining portion (light green) */}
                <circle
                  cx="65" cy="65" r={radius}
                  fill="none"
                  stroke="#d1fae5"
                  strokeWidth="14"
                  strokeDasharray={`${leftDash} ${circumference - leftDash}`}
                  strokeDashoffset={circumference * 0.25 - usedDash}
                  strokeLinecap="round"
                />
              </>
            ) : (
              <circle
                cx="65" cy="65" r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="14"
                strokeDasharray={`${circumference * 0.3} ${circumference * 0.7}`}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
              />
            )}
            {/* Center text */}
            <text x="65" y="60" textAnchor="middle" className="text-slate-900" style={{ fontSize: 22, fontWeight: 700, fill: isActive ? "#1ec28e" : "#94a3b8" }}>
              {isActive ? `${pctUsed}%` : "0%"}
            </text>
            <text x="65" y="78" textAnchor="middle" style={{ fontSize: 10, fill: "#94a3b8" }}>
              {isActive ? "used" : "inactive"}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600" />
              <span className="text-xs text-slate-600">Days Used</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{isActive ? daysUsed : 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#d1fae5]" style={{ border: "1.5px solid #1ec28e" }} />
              <span className="text-xs text-slate-600">Days Left</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{isActive ? daysLeft : 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-200" />
              <span className="text-xs text-slate-600">Total Days</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{isActive ? totalDays : "—"}</span>
          </div>
          {isActive && endDate && (
            <div className="mt-2 rounded-xl bg-[#f0fdf8] px-3 py-2">
              <p className="text-[11px] text-[#1ec28e] font-semibold">
                Expires: {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          )}
          {!isActive && (
            <div className="mt-2 rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-[11px] text-slate-500">No active boost. Upgrade to rank higher!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
