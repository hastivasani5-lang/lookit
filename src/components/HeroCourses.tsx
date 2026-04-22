"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, BookOpen, Users, Star, Award } from "lucide-react";

export default function HeroCourses() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchText.trim();
    router.push(query ? `/directory?search=${encodeURIComponent(query)}` : "/directory");
  };

  return (
    <section className="px-6 md:px-12 lg:px-20 py-14 md:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* ===== LEFT CONTENT ===== */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600/10 text-[#1ec28e] px-3 py-1 rounded-full text-xs font-medium mb-5">
            <BookOpen className="w-3 h-3" />
            Online learning platform
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1e2a55] leading-tight">
            Explore Top{" "}
            <span className="bg-gradient-to-r from-[#1ec28e] to-[#18a97a] bg-clip-text text-transparent">
              Categories
            </span>{" "}
            & Start Learning
          </h1>

          {/* Description */}
          <p className="text-gray-500 mt-4 text-base md:text-lg max-w-lg leading-relaxed">
            Browse through hundreds of expert-led courses across all categories.
            Find the right skill, the right instructor, and the right path — all in one place.
          </p>

          {/* Search Bar */}
          <div className="mt-8">
            <form onSubmit={handleSearch} className="relative">
              <div
                className={`flex items-center bg-white border border-gray-200 shadow-xl rounded-2xl transition-all duration-300 ${
                  isFocused ? "ring-2 ring-[#1ec28e]/30" : ""
                }`}
              >
                <div className="flex items-center justify-center h-14 w-14 bg-[#e6faf4] rounded-l-2xl border-r border-[#d1f5e7]">
                  <Search className="w-5 h-5 text-[#1ec28e]" />
                </div>
                <input
                  type="text"
                  placeholder="Search categories, courses..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="flex-1 py-4 px-4 text-base outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="h-14 px-6 rounded-r-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center gap-2 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="mt-8 flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#1ec28e]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1e2a55]">6k+</p>
                <p className="text-xs text-gray-400">Students</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-[#1ec28e]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1e2a55]">30+</p>
                <p className="text-xs text-gray-400">Expert Instructors</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-[#1ec28e]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1e2a55]">4.8★</p>
                <p className="text-xs text-gray-400">Avg Rating</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== RIGHT IMAGE ===== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex justify-center items-center min-h-[400px]"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.04 }}
            className="relative z-10"
          >
            <Image
              src="/image.webp"
              alt="Explore categories"
              width={520}
              height={460}
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
