"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: ShieldCheck, text: "Secure Payment",  bg: "bg-emerald-50",  color: "text-emerald-600" },
  { icon: Zap,         text: "Fast Delivery",   bg: "bg-orange-50",   color: "text-orange-500" },
  { icon: RefreshCw,   text: "Easy Returns",    bg: "bg-purple-50",   color: "text-purple-500" },
  { icon: Headphones,  text: "24/7 Support",    bg: "bg-blue-50",     color: "text-blue-500" },
];

const ShopWhyChoose = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f0faf6] via-white to-[#f0f7ff] px-6 md:px-16 py-14">

      {/* BG blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#1ec28e]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#effaf6] px-4 py-1.5 text-sm font-semibold text-[#1ec28e] mb-5">
            🛍️ Premium Shop
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1e2a55] leading-tight mb-4">
            Discover Quality<br />
            <span className="bg-gradient-to-r from-[#1ec28e] to-[#0d7a57] bg-clip-text text-transparent">
              Books & Videos
            </span>
          </h2>

          <p className="text-gray-500 text-base mb-8 max-w-md">
            Explore premium learning content from top professionals. Get the best resources at unbeatable prices.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={`flex items-center gap-3 rounded-2xl ${f.bg} px-4 py-3`}>
                  <div className={`w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{f.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}>
              Shop Now →
            </button>
            <button className="flex items-center gap-2 rounded-full border-2 border-[#1ec28e] bg-white px-7 py-3 text-sm font-bold text-[#1ec28e] transition hover:bg-[#effaf6]">
              View Products
            </button>
          </div>
        </motion.div>

        {/* RIGHT - image centered */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="relative flex items-center justify-center min-h-[380px]">

          {/* Spinning ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="block w-[380px] h-[380px] rounded-full border-8 border-dashed border-[#1ec28e]/20 animate-spin-slow" />
          </div>

          {/* Floating icons */}
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-8 left-8 z-10">
            <Image src="/start.png" alt="" width={44} height={44} />
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            className="absolute top-16 right-8 z-10">
            <Image src="/hero-arrow.png" alt="" width={36} height={36} />
          </motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-16 left-12 z-10">
            <Image src="/wave.png" alt="" width={40} height={40} />
          </motion.div>

          {/* Discount badge */}
          <div className="absolute top-4 right-16 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg rotate-6">
            50% OFF
          </div>

          {/* Main image - centered */}
          <div className="relative z-10 w-[360px] h-[360px] sm:w-[420px] sm:h-[420px]">
            <Image src="/shopban.png" alt="Shop" fill className="object-contain drop-shadow-2xl" priority />
          </div>

          {/* Floating card */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
            className="absolute bottom-4 right-0 z-20 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#effaf6] flex items-center justify-center text-lg">📚</div>
            <div>
              <p className="text-xs font-bold text-gray-800">1,200+ Items</p>
              <p className="text-[10px] text-gray-400">Books & Videos</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default ShopWhyChoose;
