"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import products from "./products.json";

// Extract unique categories from products
const allCategories = [
  "All",
  ...Array.from(new Set(products.map((p) => p.title.split(" ")[0])))
];

const allRatings = [5, 4, 3];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "Above ₹1000", min: 1000, max: Infinity },
];

export default function ProductGrid({ items }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter products by selected filters
  const filteredProducts = (items || products).filter((product) => {
    if (selectedCategory !== "All" && !product.title.startsWith(selectedCategory)) return false;
    if (selectedRating && product.rating !== selectedRating) return false;
    if (selectedPrice && !(product.price >= selectedPrice.min && product.price < selectedPrice.max)) return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to first page when filters change
  React.useEffect(() => { setCurrentPage(1); }, [selectedCategory, selectedRating, selectedPrice]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-1 flex gap-8">
      {/* Sidebar (slide bar) */}
      <aside className={`bg-white rounded-2xl shadow-md p-6 min-w-[220px] h-fit transition-transform duration-300 z-20
        fixed top-0 left-0 h-full w-72 lg:static lg:w-auto lg:h-auto lg:block
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ boxShadow: sidebarOpen ? "0 0 0 9999px rgba(0,0,0,0.2)" : undefined }}
      >
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="font-bold text-lg">Filters</span>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 text-2xl">×</button>
        </div>
        <div className="space-y-8">
          {/* Category Filter */}
          <div>
            <h4 className="font-semibold mb-2">Category</h4>
            <ul className="space-y-2">
              {allCategories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg font-thin transition
                      ${selectedCategory === cat ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-[#e6faf4]"}`}
                    onClick={() => { setSelectedCategory(cat); setSidebarOpen(false); }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Price Filter */}
          <div>
            <h4 className="font-semibold mb-2">Price</h4>
            <ul className="space-y-2">
              {priceRanges.map((range) => (
                <li key={range.label}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg font-thin transition
                      ${selectedPrice.label === range.label ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-[#e6faf4]"}`}
                    onClick={() => { setSelectedPrice(range); setSidebarOpen(false); }}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Rating Filter */}
          <div>
            <h4 className="font-semibold mb-2">Rating</h4>
            <ul className="flex gap-2">
              {allRatings.map((rating) => (
                <li key={rating}>
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg font-thin transition
                      ${selectedRating === rating ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-[#e6faf4]"}`}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  >
                    {Array.from({ length: rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Sidebar toggle button for mobile */}
      <button
        className="fixed top-24 left-4 z-30 p-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-lg lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open filters"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>

      {/* Product grid */}
      <div className="flex-1">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0">
          {paginatedProducts.map(product => (
            <li key={product.id} className="flex">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-400 py-12 text-lg">No products found for selected filters.</div>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
