"use client";

import Image from "next/image";

export default function PageBanner() {
  return (
    <section className="relative bg-[#e6efed] py-20 px-4 md:px-10 lg:px-16 overflow-hidden">

      {/* LEFT CURVE BACKGROUND */}
      <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
        <div className="absolute left-[-20%] top-0 w-[120%] h-full bg-[radial-gradient(circle_at_left,rgba(30,194,142,0.15),transparent_60%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">

        {/* TOP ICON */}
        <div className="flex justify-center mb-6">
          <Image
            src="/book-hand.png"
            alt="book"
            width={100}
            height={60}
          />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">
          All Courses
        </h1>

        {/* BREADCRUMB */}
        <div className="flex justify-center items-center gap-2 text-sm font-medium">
          <span className="text-primary">HOME</span>
          <span className="text-primary">→</span>
          <span className="text-gray-700">ALL COURSES</span>
        </div>

        {/* SEARCH */}
        <div className="mx-auto mt-8 flex w-full max-w-2xl items-center rounded-full border border-white/70 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <input
            type="text"
            placeholder="Search your course"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#18ab7d]">
            Search
          </button>
        </div>

      </div>

      {/* RIGHT DOT PATTERN */}
      <div className="hidden md:grid grid-cols-8 gap-2 absolute right-16 top-1/2 -translate-y-1/2">
        {Array(64)
          .fill(0)
          .map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"
            ></span>
          ))}
      </div>

    </section>
  );
}