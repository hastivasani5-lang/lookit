"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Star } from "lucide-react";

export type SidebarFilters = {
  category: string;
  priceType: "all" | "free" | "paid";
  minRating: number; // 0 = all, 4 = 4+, 4.5 = 4.5+
};

type SidebarProps = {
  minPrice: number;
  maxPrice: number;
  selectedMaxPrice: number;
  onPriceChange: (value: number) => void;
  categories: string[];
  filters: SidebarFilters;
  onFiltersChange: (f: SidebarFilters) => void;
};

const Sidebar = ({
  minPrice,
  maxPrice,
  selectedMaxPrice,
  onPriceChange,
  categories,
  filters,
  onFiltersChange,
}: SidebarProps) => {
  const hasActiveFilter =
    filters.category !== "" ||
    filters.priceType !== "all" ||
    filters.minRating !== 0 ||
    selectedMaxPrice !== maxPrice;

  const handleClear = () => {
    onFiltersChange({ category: "", priceType: "all", minRating: 0 });
    onPriceChange(maxPrice);
  };

  return (
    <div className="w-full lg:w-[220px] rounded-2xl border border-gray-100 bg-white shadow-md overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#effaf6] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-[#1ec28e]" />
          </div>
          <span className="font-bold text-gray-900">Filters</span>
          {hasActiveFilter && <span className="w-2 h-2 rounded-full bg-[#1ec28e]" />}
        </div>
        {hasActiveFilter && (
          <button onClick={handleClear} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-semibold transition">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="px-5 py-5 space-y-6">

        {/* Category */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Category</p>
          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#1ec28e]/30"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Price Type */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Price</p>
          <div className="flex gap-2">
            {(["all", "free", "paid"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onFiltersChange({ ...filters, priceType: type })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition border ${
                  filters.priceType === type
                    ? "bg-[#1ec28e] text-white border-[#1ec28e]"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#1ec28e] hover:text-[#1ec28e]"
                }`}
              >
                {type === "all" ? "All" : type === "free" ? "Free" : "Paid"}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Price Range */}
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

        <div className="h-px bg-gray-100" />

        {/* Rating */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Rating</p>
          <div className="space-y-1.5">
            {[
              { label: "All Ratings", value: 0 },
              { label: "4.0+", value: 4 },
              { label: "4.5+", value: 4.5 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onFiltersChange({ ...filters, minRating: opt.value })}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition border ${
                  filters.minRating === opt.value
                    ? "bg-[#effaf6] border-[#1ec28e] text-[#1ec28e] font-semibold"
                    : "bg-gray-50 border-gray-100 text-gray-600 hover:border-[#1ec28e] hover:text-[#1ec28e]"
                }`}
              >
                {opt.value === 0 ? (
                  <span>{opt.label}</span>
                ) : (
                  <>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className="h-3 w-3"
                          fill={opt.value >= s ? "#f59e0b" : "none"}
                          stroke={opt.value >= s ? "#f59e0b" : "#d1d5db"}
                        />
                      ))}
                    </div>
                    <span>{opt.label}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
