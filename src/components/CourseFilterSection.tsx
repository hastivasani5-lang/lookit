"use client";

import { SlidersHorizontal, X } from "lucide-react";

type CourseFilterSectionProps = {
  categories: string[];
  selectedCategory: string;
  selectedReview: string;
  selectedRating: string;
  onCategoryChange: (value: string) => void;
  onReviewChange: (value: string) => void;
  onRatingChange: (value: string) => void;
};

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#1ec28e] focus:bg-white focus:ring-2 focus:ring-[#1ec28e]/20 appearance-none cursor-pointer";

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
      {children}
    </div>
  );
}

export default function CourseFilterSection({
  categories,
  selectedCategory,
  selectedReview,
  selectedRating,
  onCategoryChange,
  onReviewChange,
  onRatingChange,
}: CourseFilterSectionProps) {

  const isFiltered = selectedCategory !== "all" || selectedReview !== "all" || selectedRating !== "all";

  const clearAll = () => {
    onCategoryChange("all");
    onReviewChange("all");
    onRatingChange("all");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-md overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#effaf6] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-[#1ec28e]" />
          </div>
          <span className="font-bold text-gray-900 text-base">Filters</span>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-[#1ec28e]" />
          )}
        </div>
        {isFiltered && (
          <button onClick={clearAll}
            className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 transition">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="px-5 py-5 space-y-5">

        {/* Category */}
        <FilterGroup label="Category">
          <div className="relative">
            <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass}>
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </FilterGroup>

        <div className="h-px bg-gray-100" />

        {/* Price - pill buttons */}
        <FilterGroup label="Price">
          <div className="flex gap-2">
            {["All", "Free", "Paid"].map((p) => (
              <button key={p} type="button"
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                  p === "All"
                    ? "bg-[#1ec28e] text-white border-[#1ec28e]"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#1ec28e] hover:text-[#1ec28e]"
                }`}>
                {p}
              </button>
            ))}
          </div>
        </FilterGroup>

        <div className="h-px bg-gray-100" />

        {/* Reviews */}
        <FilterGroup label="Reviews">
          <div className="relative">
            <select value={selectedReview} onChange={(e) => onReviewChange(e.target.value)} className={selectClass}>
              <option value="all">All Reviews</option>
              <option value="100+">100+ Reviews</option>
              <option value="300+">300+ Reviews</option>
              <option value="500+">500+ Reviews</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </FilterGroup>

        <div className="h-px bg-gray-100" />

        {/* Rating - star buttons */}
        <FilterGroup label="Rating">
          <div className="space-y-2">
            {[
              { value: "all",  label: "All Ratings" },
              { value: "4+",   label: "4.0+ ★★★★" },
              { value: "4.5+", label: "4.5+ ★★★★★" },
            ].map((r) => (
              <button key={r.value} type="button"
                onClick={() => onRatingChange(r.value)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border transition ${
                  selectedRating === r.value
                    ? "bg-[#effaf6] border-[#1ec28e] text-[#1ec28e] font-semibold"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#1ec28e]"
                }`}>
                <span>{r.label}</span>
                {selectedRating === r.value && (
                  <span className="w-2 h-2 rounded-full bg-[#1ec28e]" />
                )}
              </button>
            ))}
          </div>
        </FilterGroup>

      </div>
    </div>
  );
}
