"use client";

import Image from "next/image";

const WhyChoose = () => {
  return (
    <section className="py-24 bg-[#eef5f3] relative overflow-hidden px-4 md:px-8 lg:px-16">
<div className="absolute top-10 right-10 hidden md:block animate-float-slow">
  <Image
    src="/shape.png"
    alt="shape"
    width={80}
    height={100}
    className="opacity-90"
  />
</div>
      {/* BACKGROUND GRADIENT */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-100 to-transparent rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ================= LEFT ================= */}
        <div data-aos="fade-right" className="max-w-xl">

          <p className="text-xs tracking-widest text-gray-500 flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            WHY CHOOSE US?
          </p>

          <h2 className="text-4xl md:text-[44px] font-bold text-gray-900 leading-[1.2] mb-5">
            Innovative and effective <br />
            learning approaches
          </h2>

          <p className="text-gray-500 text-[15px] leading-[1.8] mb-8">
            Educate the ultimate destination for knowledge seekers and educators alike.
            We are committed to transforming special education impact global channels
            without standards compliant systems
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-2 gap-4 mb-6">

            <div className="bg-[#dff3ec] px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
              <span className="text-green-600">✔</span>
              Course Management
            </div>

            <div className="bg-[#f3e7db] px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
              <span className="text-orange-500">✔</span>
              Students Progress Tracking
            </div>

            <div className="bg-[#eae4f8] px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
              <span className="text-purple-500">✔</span>
              Interactive Live Class
            </div>

            <div className="bg-[#dff0f7] px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
              <span className="text-blue-500">✔</span>
              Quiz and Assignments
            </div>

          </div>

          <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <span className="text-green-500 text-lg">*</span>
            24/7 Hrs Ready to our support team
          </p>

          <div className="flex items-center gap-6">

            <button className="bg-green-500 hover:bg-green-600 text-white px-7 py-3 rounded-full text-sm font-medium transition">
              GET STARTED →
            </button>

            {/* WAVE */}
            <div className="flex flex-col gap-1">
              <div className="w-12 h-1 bg-green-400 rounded-full"></div>
              <div className="w-10 h-1 bg-orange-400 rounded-full"></div>
              <div className="w-12 h-1 bg-green-400 rounded-full"></div>
            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div
          className="relative w-full h-[520px] flex items-center justify-center"
          data-aos="fade-left"
        >

          {/* MAIN IMAGE */}
          <div className="relative w-[420px] h-[420px] animate-float">
            <Image
              src="/img1.png"
              alt="students"
              fill
              className="object-contain"
            />
          </div>

          {/* DOTS */}
          <div className="absolute top-16 right-20 grid grid-cols-4 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            ))}
          </div>

          {/* STAR */}
          <div className="absolute left-10 bottom-24 w-12 h-12 border border-green-400 rounded-full flex items-center justify-center text-green-500 text-xl animate-pulse">
            *
          </div>

          {/* EXPERIENCE CARD */}
          <div className="absolute right-0 bottom-16 bg-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-float">

            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
              ★
            </div>

            <div>
              <p className="font-bold text-lg text-gray-900">26+</p>
              <p className="text-xs text-gray-500">Years of Experiences</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChoose;