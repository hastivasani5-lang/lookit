"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ShopHero() {
  return (
    <section className="relative w-full py-20 md:py-32 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Shop Our Premium Products
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8">
          Discover high-quality products curated for you
        </p>
        <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-200">
          Shop Now
        </button>
      </motion.div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-blue-200 to-indigo-100 rounded-full blur-3xl opacity-30" />
      </div>
    </section>
  );
}
