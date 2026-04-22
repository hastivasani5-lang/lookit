"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="w-full bg-[#f5f7f6] py-16 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        
        {/* ================= LEFT CONTENT ================= */}
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold text-[#ff6b6b] uppercase mb-2">
            About Us
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#0b1c39] leading-tight mb-4">
            About Passion <br /> Language School
          </h2>

          <p className="text-gray-500 leading-relaxed mb-6">
            Passion Language School offers English and Online Foreign Language
            Courses at various proficiency levels. Our English program stands
            out due to our innovative approach, which combines creativity,
            enjoyment, and a supportive learning atmosphere.
          </p>

          <p className="text-gray-500 leading-relaxed mb-6">
            We employ unique assessment methods to evaluate each candidate’s
            progress. Our comprehensive training ensures that students learn the
            language effortlessly.
          </p>

          {/* Highlight Point */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-6 h-6 flex items-center justify-center bg-[#e6f9f3] text-[#1ec28e] rounded-full text-sm">
              ✔
            </div>
            <p className="text-gray-700 font-medium">
              Discover a New Language with Online Courses – Unlock New Career
              Opportunities!
            </p>
          </div>

          {/* Button */}
          <button className="bg-[#2b3a67] hover:bg-[#1f2a4d] text-white px-6 py-3 rounded-md transition">
            Read More
          </button>
        </div>

        {/* ================= RIGHT IMAGE SECTION ================= */}
        <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
          
          {/* Background Shape */}
          <div className="absolute w-[320px] h-[320px] bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[60%_40%_60%_40%] right-0 top-10 -z-10"></div>

          {/* Orange Pattern */}
          <div className="absolute left-10 top-20 w-[120px] h-[120px] border-r-[6px] border-[#f59e0b] border-dashed rotate-45"></div>

          {/* Dots Pattern */}
          <div className="absolute bottom-10 left-20 grid grid-cols-6 gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="w-2 h-2 bg-[#ff6b6b] rounded-full opacity-60"
              ></span>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative z-10">
            <Image
              src="/img2.png"
              alt="student"
              width={420}
              height={500}
              className="object-contain"
            />
          </div>

          {/* Floating Cards */}
          <div className="absolute right-0 top-20 bg-white shadow-lg px-5 py-3 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">235K</h3>
            <p className="text-sm text-gray-500">Worldwide Students</p>
          </div>

          <div className="absolute left-0 top-28 bg-white shadow-lg px-5 py-3 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-1">
              4.7 <span className="text-yellow-400">★</span>
            </h3>
            <p className="text-sm text-gray-500">Worldwide Review</p>
          </div>

          <div className="absolute bottom-0 left-10 bg-white shadow-lg px-5 py-3 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">3.5K</h3>
            <p className="text-sm text-gray-500">Free Pro Courses</p>
          </div>
        </div>

      </div>
    </section>
  );
}