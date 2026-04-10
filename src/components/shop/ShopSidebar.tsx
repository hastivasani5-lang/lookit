"use client";
import React from "react";

interface ShopSidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  minPrice: number;
  maxPrice: number;
  price: number;
  setPrice: (price: number) => void;
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  maxPrice,
  price,
  setPrice,
}) => (
  <aside className="sticky top-24 self-start rounded-2xl border border-[#dbe8e4] bg-white p-5 h-fit">
    <h3 className="mb-4 text-lg font-semibold text-gray-900">Filter</h3>
    <div className="mb-6">
      <p className="mb-2 text-sm font-medium text-gray-700">Category</p>
      <select
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">Max Price: <span className="font-semibold">₹{price}</span></p>
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>₹{minPrice}</span>
        <span>₹{maxPrice}</span>
      </div>
    </div>
  </aside>
);

export default ShopSidebar;
