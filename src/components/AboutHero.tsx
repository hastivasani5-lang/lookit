"use client";

import Image from "next/image";
import Link from "next/link";

const AboutHero = () => {
  return (
    <section className="w-full py-24 px-4 md:px-10 bg-[#f8f9fb] overflow-hidden" data-aos="fade-up" data-aos-duration="900">
      
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 items-center gap-12">

        {/* LEFT CONTENT */}
        <div data-aos="fade-right" data-aos-duration="900" className="mt-10 lg:mt-0">

          {/* SMALL TITLE */}
          <p className="text-sm text-[#ff5a3c] font-semibold tracking-widest mb-3 uppercase">
            About Us
          </p>

          {/* HEADING */}
          <h2 className="text-3xl md:text-5xl font-bold text-[#0b1c39] leading-tight mb-5">
            About Passion <br />
            Language School
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-500 text-base leading-7 mb-6 max-w-xl">
            Passion Language School offers English and Online Foreign Language
            Courses at various proficiency levels. Our English program stands
            out due to our innovative approach, combining creativity, enjoyment,
            and a supportive learning atmosphere.
          </p>

          {/* HIGHLIGHT POINT */}
          <div className="flex items-start gap-3 mb-6">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-sm">
              ✔
            </span>
            <p className="text-gray-700 font-medium">
              Discover a New Language with Online Courses & Unlock Career Opportunities!
            </p>
          </div>

          {/* BUTTON */}
          <Link href="/about" className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium transition hover:scale-105 hover:shadow-md">
            Read More
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center lg:justify-end" data-aos="fade-left" data-aos-duration="900">

          {/* MAIN IMAGE */}
          <Image
            src="/img2.png"
            alt="student"
            width={500}
            height={600}
            className="relative z-10"
          />

          {/* GREEN SHAPE */}
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-green-800 rounded-[40%] -z-0"></div>

          {/* LIGHT BACKGROUND BLOCK */}
          <div className="absolute bottom-0 left-0 w-64 h-40 bg-[#f3eaea] -z-10 rounded-md"></div>

          {/* ORANGE STRIPES */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_4px,transparent_4px,transparent_10px)] opacity-60"></div>

          {/* DOT PATTERN */}
          <div className="absolute bottom-6 left-16 grid grid-cols-8 gap-2">
            {[...Array(32)].map((_, i) => (
              <span
                key={i}
                className="w-2 h-2 bg-[#ff5a3c] rounded-full opacity-60"
              ></span>
            ))}
          </div>

        
          <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg px-4 py-2 text-sm animate-float" data-aos="zoom-in" data-aos-delay="200">
            <h4 className="font-bold text-lg">235K</h4>
            <p className="text-gray-500 text-xs">Worldwide Students</p>
          </div>

          <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg px-4 py-2 text-sm animate-float-slow" data-aos="zoom-in" data-aos-delay="400">
            <h4 className="font-bold text-lg">4.7 ⭐</h4>
            <p className="text-gray-500 text-xs">Review</p>
          </div>

          <div className="absolute bottom-16 right-10 bg-white shadow-lg rounded-lg px-4 py-2 text-sm animate-float z-20" data-aos="zoom-in" data-aos-delay="600">
            <h4 className="font-bold text-lg">3.5K</h4>
            <p className="text-gray-500 text-xs">Free Courses</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutHero;