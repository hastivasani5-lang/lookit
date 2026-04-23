"use client";

import { SlidersHorizontal } from "lucide-react";

type SidebarProps = {
  minPrice: number;
  maxPrice: number;
  selectedMaxPrice: number;
  onPriceChange: (value: number) => void;
};

const categories = [
  { name: "Historical Fiction",    count: 18 },
  { name: "Mystery and Thriller",  count: 15 },
  { name: "Biography and Memoir",  count: 10 },
  { name: "Business and Finance",  count: 9 },
  { name: "Non-Fiction",           count: 5 },
  { name: "Poetry",                count: 2 },
];

const Sidebar = ({ minPrice, maxPrice, selectedMaxPrice, onPriceChange }: SidebarProps) => {
  return (
    <div className="w-full lg:w-[260px] rounded-2xl border border-gray-100 bg-white shadow-md overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-[#effaf6] flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-[#1ec28e]" />
        </div>
        <span className="font-bold text-gray-900">Filters</span>
      </div>

      <div className="px-5 py-5 space-y-6">

        {/* Categories */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Categories</p>
          <ul className="space-y-1">
            {categories.map((cat, i) => (
              <li key={i}
                className="flex justify-between items-center px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-[#effaf6] hover:text-[#1ec28e] cursor-pointer transition group">
                <span className="group-hover:font-semibold transition">{cat.name}</span>
                <span className="text-xs bg-gray-100 group-hover:bg-[#1ec28e]/10 group-hover:text-[#1ec28e] px-2 py-0.5 rounded-full transition">
                  {cat.count}
                </span>
              </li>
            ))}
            <li className="text-center text-[#1ec28e] text-sm font-semibold cursor-pointer hover:underline pt-1">
              More...
            </li>
          </ul>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Price Filter */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range</p>

          <input
            type="range"
            min={minPrice ?? 0}
            max={Math.max(maxPrice ?? 0, minPrice ?? 0)}
            value={Math.min(selectedMaxPrice ?? 0, Math.max(maxPrice ?? 0, minPrice ?? 0))}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            disabled={(maxPrice ?? 0) <= (minPrice ?? 0)}
            className="w-full accent-[#1ec28e] h-2 rounded-full"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              ₹{(minPrice ?? 0).toFixed(0)}
            </span>
            <span className="text-xs text-gray-400">to</span>
            <span className="text-xs font-semibold text-[#1ec28e] bg-[#effaf6] px-2 py-1 rounded-lg">
              ₹{Math.max(selectedMaxPrice ?? 0, minPrice ?? 0).toFixed(0)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
