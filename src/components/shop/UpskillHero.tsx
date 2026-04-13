"use client";
import Image from "next/image";

export default function UpskillHero() {
  return (
    <section className="w-full py-16 px-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-xl mb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left */}
        <div className="flex-1 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Faster Way For Your <br /> Grow & Upskill
          </h1>
          <div className="flex gap-4 mt-6">
            <button className="bg-[#1ec28e] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-[#18ab7d] transition">Subscribe</button>
            <button className="bg-[#1ec28e] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-[#18ab7d] transition">Learn Now</button>
          </div>
        </div>
        {/* Right */}
        <div className="flex-1 flex justify-center">
          <Image src="/illustration-laptop-man.png" alt="Man working on laptop" width={340} height={340} className="rounded-2xl object-contain" />
        </div>
      </div>
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
}