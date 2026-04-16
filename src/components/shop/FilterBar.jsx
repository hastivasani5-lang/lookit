"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const categories = ["All", "Parent Support", "ADHD", "Dyslexia", "Speech Therapy", "Consultation", "School Support"];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("shopPriceRange");
      if (saved) return JSON.parse(saved);
    }
    return [0, 1000];
  });
  const [sort, setSort] = useState("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("shopPriceRange", JSON.stringify(price));
    }
  }, [price]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-20 mx-auto max-w-5xl px-4 md:px-0"
    >
      <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-lg flex flex-wrap items-center gap-4 p-6 mt-[-3rem] border border-gray-100">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white shadow-sm"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="w-full flex justify-center">
          <div className="flex items-center gap-2 w-full max-w-md justify-center">
            <span className="text-gray-500 text-sm">₹{price[0]}</span>
            <input
              type="range"
              min={0}
              max={1500}
              value={price[0]}
              onChange={e => setPrice([+e.target.value, price[1]])}
              className="accent-indigo-500"
            />
            <input
              type="range"
              min={0}
              max={1500}
              value={price[1]}
              onChange={e => setPrice([price[0], +e.target.value])}
              className="accent-indigo-500"
            />
            <span className="text-gray-500 text-sm">₹{price[1]}</span>
          </div>
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </motion.div>
  );
}
