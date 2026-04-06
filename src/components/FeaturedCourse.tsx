"use client";

import Image from "next/image";

const FeaturedCourse = () => {
  return (
    <section className="py-20 px-4 bg-white">
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE - VIDEO IMAGE */}
        <div className="relative group rounded-2xl overflow-hidden">
          
    {/* LEFT SIDE - YOUTUBE VIDEO */}
<div className="relative rounded-2xl overflow-hidden">

  <iframe
    className="w-full h-[420px] rounded-2xl"
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    title="YouTube video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>

</div>

        </div>

        {/* RIGHT SIDE CARD */}
        <div className="bg-[#e8f3f1] rounded-2xl p-8 relative overflow-hidden">

          {/* CATEGORY */}
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-green-100 text-green-600 mb-4">
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
            <span className="text-green-600 text-2xl font-bold">$35</span>
            <span className="line-through text-gray-400">$60</span>
          </div>

          {/* BUTTON */}
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition">
            ENROL NOW →
          </button>

          {/* DISCOUNT BADGE */}
          <div className="absolute top-8 right-32 bg-orange-400 text-white text-sm px-4 py-2 rounded-full shadow">
            10% OFF
          </div>

          {/* RIGHT IMAGE */}
          <div className="absolute bottom-0 right-0">
            <Image
              src="/girl.png"
              alt="girl"
              width={220}
              height={300}
              className="object-contain"
            />
          </div>

        </div>

      </div>

    </section>
  );
};

export default FeaturedCourse;