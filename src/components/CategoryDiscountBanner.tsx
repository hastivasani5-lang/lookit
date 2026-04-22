"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// Countdown timer hook
function useCountdown(hours: number, minutes: number, seconds: number) {
  const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function Pad(n: number) { return String(n).padStart(2, "0"); }

export default function CategoryDiscountBanner() {
  const time = useCountdown(5, 47, 30);

  return (
    <section className="px-4 md:px-8 lg:px-16 py-10 bg-[#f8fafb]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 50%, #34d399 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 py-10 md:px-12 md:py-12">

            {/* LEFT - Text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white mb-4">
                <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                Limited Time Offer
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
                Get <span className="text-yellow-300">50% OFF</span><br />
                on All Courses!
              </h2>

              <p className="text-white/80 text-base md:text-lg mb-6 max-w-md">
                Unlock premium books, videos and live classes from top professionals. Learn at your own pace.
              </p>

              {/* Countdown */}
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
                <Clock className="w-5 h-5 text-white/70" />
                <span className="text-white/70 text-sm font-medium">Offer ends in:</span>
                {[
                  { label: "HRS",  val: time.h },
                  { label: "MIN",  val: time.m },
                  { label: "SEC",  val: time.s },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[52px]">
                      <span className="text-2xl font-bold text-white leading-none">{Pad(t.val)}</span>
                      <span className="text-[10px] text-white/60 font-medium mt-0.5">{t.label}</span>
                    </div>
                    {i < 2 && <span className="text-white/60 text-xl font-bold">:</span>}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-emerald-700 px-7 py-3 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all no-underline"
                >
                  Claim Offer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 text-white px-7 py-3 text-sm font-bold hover:bg-white/10 transition-all no-underline"
                >
                  Browse Courses
                </Link>
              </div>
            </div>

            {/* RIGHT - Image + floating cards */}
            <div className="relative flex-shrink-0 w-full lg:w-auto flex justify-center">
              <div className="relative w-64 h-64 md:w-72 md:h-72">
                {/* Main image */}
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/students2.png"
                    alt="Students learning"
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/about1.png"; }}
                  />
                </div>

                {/* Floating card - top left */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">📚</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">500+ Courses</p>
                    <p className="text-[10px] text-gray-400">Available now</p>
                  </div>
                </motion.div>

                {/* Floating card - bottom right */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -right-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center text-lg">⭐</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">4.9 Rating</p>
                    <p className="text-[10px] text-gray-400">10k+ reviews</p>
                  </div>
                </motion.div>

                {/* Discount pill */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg rotate-6">
                  50% OFF
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
