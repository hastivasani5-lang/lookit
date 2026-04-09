"use client";

import Image from "next/image";

const WhyChoose = () => {
  return (
    <section className="relative overflow-hidden bg-[#eef5f3] px-4 py-12 sm:py-16 md:px-8 lg:px-16 lg:py-20">
      <div className="absolute right-4 top-6 hidden animate-float-slow sm:right-8 sm:top-8 md:block lg:right-10 lg:top-10">
        <Image
          src="/wave.png"
          alt="decorative wave"
          width={80}
          height={100}
          className="h-auto w-14 opacity-90 sm:w-16 lg:w-20"
        />
      </div>
      {/* BACKGROUND GRADIENT */}
      <div className="absolute right-0 top-0 h-[320px] w-[320px] rounded-full bg-gradient-to-tr from-[#1ec28e]/12 to-transparent blur-3xl opacity-50 sm:h-[440px] sm:w-[440px] lg:h-[600px] lg:w-[600px]"></div>

      <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-16">

        {/* ================= LEFT ================= */}
        <div data-aos="fade-right" className="max-w-xl">

          <p className="text-xs tracking-widest text-gray-500 flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-[#1ec28e] rounded-full"></span>
            WHY CHOOSE US?
          </p>

          <h2 className="mb-5 text-3xl font-bold leading-[1.2] text-gray-900 sm:text-4xl md:text-[44px]">
            Innovative and effective <br />
            learning approaches
          </h2>

          <p className="mb-8 text-sm leading-[1.8] text-gray-500 sm:text-[15px]">
            Educate the ultimate destination for knowledge seekers and educators alike.
            We are committed to transforming special education impact global channels
            without standards compliant systems
          </p>

          {/* FEATURES */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

            <div className="flex items-center gap-2 rounded-lg bg-[#dff3ec] px-4 py-3 text-sm font-medium">
              <span className="text-[#1ec28e]">✔</span>
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

          <p className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <span className="text-[#1ec28e] text-lg">*</span>
            24/7 Hrs Ready to our support team
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">

            <button className="rounded-full bg-[#1ec28e] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#18ab7d] sm:px-7">
              GET STARTED →
            </button>

            {/* WAVE */}
            <div className="flex flex-col gap-1">
              <div className="w-12 h-1 bg-[#1ec28e]/70 rounded-full"></div>
              <div className="w-10 h-1 bg-orange-400 rounded-full"></div>
              <div className="w-12 h-1 bg-[#1ec28e]/70 rounded-full"></div>
            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div
          className="relative flex h-[360px] w-full items-center justify-center sm:h-[420px] md:h-[480px] lg:h-[520px]"
          data-aos="fade-left"
        >

          {/* MAIN IMAGE */}
          <div className="relative h-[260px] w-[260px] animate-float sm:h-[320px] sm:w-[320px] md:h-[380px] md:w-[380px] lg:h-[420px] lg:w-[420px]">
            <Image
              src="/img1.png"
              alt="students"
              fill
              sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, (max-width: 1024px) 380px, 420px"
              className="object-contain"
            />
          </div>

          {/* DOTS */}
          <div className="absolute right-3 top-8 grid grid-cols-4 gap-1 sm:right-10 sm:top-12 md:right-16 md:top-16 lg:right-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-[#1ec28e] rounded-full"></span>
            ))}
          </div>

          {/* STAR */}
          <div className="absolute bottom-14 left-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#1ec28e]/55 text-lg text-[#1ec28e] animate-pulse sm:bottom-20 sm:left-6 sm:h-12 sm:w-12 sm:text-xl lg:bottom-24 lg:left-10">
            *
          </div>

          {/* EXPERIENCE CARD */}
          <div className="absolute bottom-4 right-2 flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-lg animate-float sm:bottom-10 sm:right-0 sm:px-6 sm:py-3 lg:bottom-16">

            <div className="w-10 h-10 bg-[#1ec28e] text-white rounded-full flex items-center justify-center">
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