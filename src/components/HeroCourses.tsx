"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Headphones, BookOpen, Users } from "lucide-react";

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
    <section className="bg-[#f3f7f6] px-6 md:px-12 lg:px-20 py-14 md:py-20 overflow-hidden relative">
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1ec28e]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1e2a55]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* ================= LEFT CONTENT (Enhanced) ================= */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Small badge */}
          <div className="inline-flex items-center gap-2 bg-[#1ec28e]/10 text-[#1ec28e] px-3 py-1 rounded-full text-xs font-medium mb-5">
            <BookOpen className="w-3 h-3" />
            Online learning platform
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-[#1e2a55] leading-tight">
            Start learning from the{" "}
            <span className="bg-gradient-to-r from-[#1ec28e] to-[#18a97a] bg-clip-text text-transparent">
              world’s best
            </span>{" "}
            institutions
          </h1>

          {/* Description */}
          <p className="text-gray-500 mt-4 text-base md:text-lg max-w-lg leading-relaxed">
            Flexible easy to access learning opportunities can bring a significant
            change in how individuals prefer to learn. Ellen offers you the beauty of eLearning!
          </p>

          {/* ================= MODERN GLASS SEARCH BAR ================= */}
          <div className="mt-8">
            <form onSubmit={handleSearch} className="relative">
              <div
                className={`flex items-center backdrop-blur-md bg-white/70 border border-[#e0f2ef] shadow-xl rounded-2xl transition-all duration-300 ${
                  isFocused ? "ring-2 ring-[#1ec28e]/30 shadow-[#1ec28e]/10" : ""
                }`}
              >
                {/* Icon section with divider */}
                <div className="flex items-center justify-center h-14 w-14 bg-[#e6faf4] rounded-l-2xl border-r border-[#d1f5e7]">
                  <Search className="w-6 h-6 text-[#1ec28e]" />
                </div>
                {/* Input */}
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="flex-1 py-4 px-4 text-base outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
                />
                {/* Button section with gradient */}
                <button
                  type="submit"
                  className="h-14 px-8 rounded-r-2xl bg-gradient-to-r from-[#1ec28e] to-[#18a97a] text-white font-bold text-base flex items-center gap-2 transition-all duration-200 hover:from-[#18a97a] hover:to-[#1ec28e]"
                >
                  Search Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* ================= SUPPORT (Enhanced) ================= */}
          <div className="mt-8 flex items-center gap-4 flex-wrap">
            {/* Avatars with animation */}
            <div className="flex -space-x-2">
              {["/person.png", "/pro1.jpeg", "/pro2.jpeg"].map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="relative"
                >
                  <Image
                    src={src}
                    alt="Student"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-white shadow-sm"
                  />
                </motion.div>
              ))}
            </div>

            {/* Text with icon */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Headphones className="w-4 h-4 text-[#1ec28e]" />
              <p>
                Need help?{" "}
                <span className="text-[#1ec28e] font-medium cursor-pointer hover:underline">
                  Contact our support
                </span>
              </p>
            </div>
          </div>

 
        </motion.div>

        {/* ================= RIGHT IMAGE SECTION (Enhanced) ================= */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex justify-center items-center min-h-[400px]"
        >
          {/* Animated dotted background box */}
          <motion.div
            animate={{ rotate: [0, 2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-80 h-80 border-2 border-dashed border-[#1ec28e]/30 rounded-3xl -z-10"
          />

          {/* Main Center Image with hover effect */}
          <motion.div
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative z-10 shadow-xl rounded-3xl overflow-hidden"
          >
            <Image
              src="/banner-img1.jpg"
              alt="Student learning"
              width={280}
              height={340}
              className="rounded-3xl object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </motion.div>

          {/* Top Right Image with floating animation */}
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="absolute top-0 right-0 shadow-xl rounded-2xl overflow-hidden"
          >
            <Image
              src="/banner-img2.jpg"
              alt="Student"
              width={170}
              height={130}
              className="rounded-2xl object-cover"
            />
          </motion.div>

          {/* Bottom Right Image with floating animation */}
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="absolute bottom-0 right-0 shadow-xl rounded-2xl overflow-hidden"
          >
            <Image
              src="/banner-img3.jpg"
              alt="Student"
              width={170}
              height={170}
              className="rounded-2xl object-cover"
            />
          </motion.div>

          {/* Floating badge on main image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -left-4 bg-white rounded-full shadow-lg px-3 py-1.5 flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-[#1ec28e]" />
            <span className="text-xs font-semibold text-gray-700">10k+ active learners</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}