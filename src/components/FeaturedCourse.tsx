"use client";

import Image from "next/image";

const FeaturedCourse = () => {
  return (
    <section className="py-20  relative overflow-hidden px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-stretch">
        {/* LEFT SIDE - YOUTUBE VIDEO */}
        <div className="relative rounded-2xl overflow-hidden h-105">
          <Image
            src="/offer-video.png"
            alt="offer-video"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="bg-[#e8f3f1] rounded-2xl p-8 relative overflow-hidden h-105 flex items-center">
          <div className="max-w-[58%]">
            {/* CATEGORY */}
            <span className="inline-block px-4 py-1 text-sm rounded-full bg-[#1ec28e]/10 text-[#1ec28e] mb-4">
              Designing
            </span>

            {/* TITLE */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug">
              Creative Graphic Design <br /> With Adobe Suite
            </h2>

            {/* RATING */}
            <p className="text-orange-500 mb-4">
              ★★★★★ <span className="text-gray-500 text-sm">(4.5/3 Ratings)</span>
            </p>

            {/* PRICE */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#1ec28e] text-2xl font-bold">$35</span>
              <span className="line-through text-gray-400">$60</span>
            </div>

            {/* BUTTON */}
            <button className="bg-[#1ec28e] hover:bg-[#18ab7d] text-white px-6 py-3 rounded-full transition">
              ENROL NOW →
            </button>
          </div>

          {/* DISCOUNT BADGE */}
          <div className="absolute top-8 right-32 bg-orange-400 text-white text-sm px-4 py-2 rounded-full shadow">
            10% OFF
          </div>

          {/* RIGHT IMAGE */}
          <div className="absolute bottom-0 right-0 w-36 sm:w-40 md:w-44 lg:w-48">
            <Image
              src="/girls.png"
              alt="girl"
              width={200}
              height={250}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default FeaturedCourse;
