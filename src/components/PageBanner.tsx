"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function PageBanner() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    router.push(query ? `/directory?search=${encodeURIComponent(query)}` : "/directory");
  };

  return (
    <section className="relative overflow-hidden py-20 px-4 md:px-10 lg:px-16"
      style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 55%, #34d399 100%)" }}>

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white mb-6">
          <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
          Trusted by 80,000+ learners
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Find the Best<br />
          <span className="text-yellow-300">Experts</span> Near You
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
          Search and connect with top professionals. Learn from the best in your field.
        </motion.p>

        {/* Search Bar */}
        <motion.form onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl">
          <label className="flex flex-1 items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses, experts, categories..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 text-gray-800" />
          </label>
          <button type="submit"
            className="rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 active:scale-95 shrink-0"
            style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}>
            Search
          </button>
        </motion.form>

        {/* Quick stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: Users, label: "80K+ Students" },
            { icon: BookOpen, label: "1,200+ Courses" },
            { icon: Star, label: "4.8 Avg Rating" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
              <s.icon className="w-4 h-4 text-yellow-300" />
              <span>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
