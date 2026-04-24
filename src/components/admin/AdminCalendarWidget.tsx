"use client";

import { useState } from "react";

export default function AdminCalendarWidget() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("default", { month: "long" }).toUpperCase();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; muted?: boolean; today?: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    cells.push({ day: d, today: isToday });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, muted: true });

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="text-sm font-semibold text-slate-500">{year}</span>
        <div className="flex items-center gap-3 text-slate-700">
          <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="text-lg leading-none text-slate-400 hover:text-slate-700 transition">&lt;</button>
          <p className="text-sm font-semibold tracking-wide">{monthName}</p>
          <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="text-lg leading-none text-slate-400 hover:text-slate-700 transition">&gt;</button>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-7 border border-slate-100 bg-slate-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="border-r border-slate-100 px-2 py-1.5 text-[11px] font-medium text-slate-500 last:border-r-0">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-x border-b border-slate-100 bg-white text-[11px]">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`min-h-8 border-r border-t border-slate-100 px-1 py-0.5 ${cell.today ? "bg-[#eef9ff]" : "bg-white"} ${i % 7 === 6 ? "border-r-0" : ""}`}
          >
            <p className={`text-[10px] font-medium ${cell.muted ? "text-slate-300" : cell.today ? "text-emerald-600" : "text-slate-500"}`}>{cell.day}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
