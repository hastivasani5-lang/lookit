"use client";

import React from "react";

type TimelineStat = {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
};

type StatsGridProps = {
  stats: TimelineStat[];
  counterValues: Record<string, number>;
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats, counterValues }) => {
  return (
    <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {stats.map((stat) => (
        <article key={stat.id} className="flex flex-col items-center justify-center">
          <div className="mb-4 flex h-[64px] w-[64px] items-center justify-center rounded-[10px] bg-[#6366f1] text-white shadow-[0_8px_18px_rgba(99,102,241,0.24)]">
            {stat.icon}
          </div>
          <h3 className="text-[24px] font-semibold leading-tight text-[#21254a] md:text-[28px]">{stat.label}</h3>
          <p className="mt-2 text-[42px] font-bold leading-none text-[#1d2240] md:text-[50px]">
            {counterValues[stat.id] ?? 0}
          </p>
        </article>
      ))}
    </div>
  );
};

export type { TimelineStat, StatsGridProps };
export default StatsGrid;
