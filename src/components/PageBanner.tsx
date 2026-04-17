"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function PageBanner() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();

    router.push(
      query
        ? `/directory?search=${encodeURIComponent(query)}`
        : "/directory"
    );
  };

  return (
    <section className="relative bg-[#e6efed] py-20 px-4 md:px-10 lg:px-16 overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-20%] top-0 w-[120%] h-full bg-[radial-gradient(circle_at_left,rgba(30,194,142,0.15),transparent_60%)]"></div>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10 text-center">

        {/* ICON (UPDATED) */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Image
              src="/book-hand.png"
              alt="book"
              width={90}
              height={60}
              className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
            />
          </motion.div>
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-3"
        >
          Find the Best Experts
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-gray-500 text-sm md:text-base"
        >
          Search and connect with top professionals near you
        </motion.p>

        {/* SEARCH BAR */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="mx-auto mt-8 flex w-full max-w-4xl items-center gap-3 rounded-2xl border border-white/70 bg-white p-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
        >
          <label className="flex flex-1 items-center gap-2 rounded-xl bg-[#f4f6f5] px-4 py-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search experts..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </label>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text- bg-[#e6efed] transition hover:bg-[#18ab7d]"
          >
            Search
          </motion.button>
        </motion.form>

      </div>

      {/* DOT PATTERN */}
      <div className="hidden md:grid grid-cols-8 gap-2 absolute right-16 top-1/2 -translate-y-1/2">
        {Array(64)
          .fill(0)
          .map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: i * 0.02 }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            ></motion.span>
          ))}
      </div>

    </section>
  );
}