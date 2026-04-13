"use client";

import Image from "next/image";

const ShopWhyChoose = () => {
  const features = [
    { text: "Secure Payment", bg: "bg-[#dff3ec]", iconColor: "text-[#1ec28e]" },
    { text: "Fast Delivery", bg: "bg-[#f3e7db]", iconColor: "text-orange-500" },
    { text: "Easy Returns", bg: "bg-[#eae4f8]", iconColor: "text-purple-500" },
    { text: "24/7 Support", bg: "bg-[#dff0f7]", iconColor: "text-blue-500" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f7f9fb] px-6 md:px-16 ">

      {/* BACKGROUND */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#1ec28e]/10 to-transparent blur-3xl opacity-60"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* ================= LEFT ================= */}
        <div className="max-w-2xl">

               {/* ✅ FIXED HEADING */}
          <h2 className="mb-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1e2a55] leading-tight">
            <span className="block lg:inline">
              Discover quality products
            </span>{" "}
            <span className="block lg:inline">
              at the best prices
            </span>
          </h2>

    
          {/* FEATURES */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 rounded-lg ${feature.bg} px-4 py-3 text-sm font-medium`}
              >
                <span className={feature.iconColor}>✔</span>
                {feature.text}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex items-center gap-6">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition">
              Shop Now →
            </button>

            <button className="bg-blue-50 text-blue-600 px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-100 transition">
              View Products
            </button>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="relative flex flex-col justify-end min-h-[400px] h-full">
          {/* Animated Spinning Ring BG */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <span className="block w-[480px] h-[480px] rounded-full border-8 border-dashed border-[#1ec28e]/30 animate-spin-slow"></span>
          </div>

          {/* Floating Animated Icons */}
          <div className="absolute left-10 top-10 animate-bounce z-10">
            <Image src="/start.png" alt="icon1" width={48} height={48}  />
          </div>
          <div className="absolute right-10 top-32 animate-pulse z-10">
            <Image src="/hero-arrow.png" alt="icon2" width={40} height={40} />
          </div>
          <div className="absolute left-20 bottom-24 animate-bounce z-10">
            <Image src="/wave.png" alt="icon3" width={45} height={45}  />
          </div>

          {/* DISCOUNT BADGE */}
          <div className="absolute top-6 right-24 bg-orange-500 text-white px-3 py-1 rounded-full text-xs shadow z-20">
            50% OFF
          </div>

 

          {/* MAIN IMAGE - moved to bottom, larger, no gap below */}
          <div className="relative z-10 h-[420px] w-[420px] sm:h-[520px] sm:w-[520px] mt-auto">
            <Image
              src="/shopban.png"
              alt="product"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>


      </div>
    </section>
  );
};

export default ShopWhyChoose;