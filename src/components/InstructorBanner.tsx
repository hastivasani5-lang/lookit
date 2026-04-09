"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function InstructorBanner() {
  return (
    <section className="relative overflow-hidden bg-[#e6efed] pt-3 pb-0 md:pt-4 md:pb-0">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-20%] top-0 h-full w-[120%] bg-[radial-gradient(circle_at_left,rgba(30,194,142,0.15),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
          {/* LEFT CONTENT */}
          <div className="flex-1 text-center lg:self-center">
            {/* ANIMATED BOOK ICON */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, rotate: 3 }}
              >
                <Image
                  src="/book-hand.png"
                  alt="book"
                  width={70}
                  height={48}
                  className="drop-shadow-md"
                />
              </motion.div>
            </motion.div>

            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-3"
            >
              Instructor
            </motion.h1>


            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-2 max-w-md text-sm text-gray-600"
            >
              Learn from industry experts with years of real-world experience.
              Our instructors are passionate about helping you succeed.
            </motion.p>
          </div>

          {/* RIGHT IMAGE - FIXED: NO BOTTOM GAP */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-1 justify-center lg:justify-end lg:self-end lg:pr-6"
          >
            <div className="relative inline-block">
              {/* Glow effect (optional) */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 blur-lg" />
              <div className="relative">
                <Image
                  src="/girls.png"
                  alt="Instructor"
                  width={160}
                  height={160}
                  className="block h-auto w-44 rounded-xl object-cover sm:w-52 md:w-56 lg:w-64"
                  priority
                />
              </div>
              {/* Badge */}
              <div className="absolute -top-2 -right-2 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                Top Expert
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* DOT PATTERN */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 grid-cols-6 gap-1.5 md:grid">
        {Array.from({ length: 48 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: i * 0.01 }}
            className="h-1 w-1 rounded-full bg-primary"
          />
        ))}
      </div>
    </section>
  );
}