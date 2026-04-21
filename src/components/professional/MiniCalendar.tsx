"use client";
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"
        style={{ background: "linear-gradient(135deg, #1ec28e 0%, #17a87a 100%)" }}>
        <button
          onClick={prevMonth}
          className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-white transition hover:bg-white/30"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-white">{monthName} {year}</p>
          <p className="text-[11px] text-white/70">{today.toDateString()}</p>
        </div>
        <button
          onClick={nextMonth}
          className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-white transition hover:bg-white/30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-4 pt-3">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-semibold text-slate-400">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1 px-4 pb-4 pt-1">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center py-0.5">
            {day ? (
              <button
                className={`h-8 w-8 rounded-full text-sm font-medium transition ${
                  isToday(day)
                    ? "bg-[#1ec28e] text-white shadow-md"
                    : "text-slate-700 hover:bg-[#1ec28e]/10 hover:text-[#1ec28e]"
                }`}
              >
                {day}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Today badge */}
      <div className="border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#1ec28e]" />
          <span className="text-xs text-slate-500">Today: <span className="font-semibold text-slate-700">{today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span></span>
        </div>
      </div>
    </div>
  );
}
