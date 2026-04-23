"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

import type { PublicProfessional } from "@/lib/professional-display";

const bgColors = ["bg-[#eaf4fb]", "bg-[#f7efe8]", "bg-[#f1eaf7]", "bg-[#eaf7f0]"];
const roleColors = [
  "text-blue-500 bg-blue-100",
  "text-orange-500 bg-orange-100",
  "text-purple-500 bg-purple-100",
  "text-emerald-600 bg-emerald-100",
];

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23e6f4ef'/%3E%3Ccircle cx='200' cy='170' r='78' fill='%2398b8ab'/%3E%3Crect x='90' y='270' width='220' height='170' rx='85' fill='%2398b8ab'/%3E%3C/svg%3E";

const Instructors = () => {
  const [professionals, setProfessionals] = useState<PublicProfessional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/professionals")
      .then((r) => r.json())
      .then((data: { professionals?: PublicProfessional[] }) => {
        const list = data.professionals ?? [];
        // Only show professionals with active "top" upgrade - same as Top Rated Experts
        const now = new Date();
        const topRated = list.filter((p) => {
          if (p.profileUpgradeTier !== "top" || !p.profileBoostedUntil) return false;
          const boostedUntil = new Date(p.profileBoostedUntil);
          return !Number.isNaN(boostedUntil.getTime()) && boostedUntil > now;
        });
        setProfessionals(topRated.sort((a, b) => b.rating - a.rating));
      })
      .catch(() => setProfessionals([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mx-auto mb-16 max-w-7xl text-center lg:text-left">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">
            <div className="w-full lg:w-1/2" data-aos="fade-right">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
                <span className="w-2 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></span>
                INSTRUCTORS
              </div>
              <div className="mt-3 w-full h-px bg-gray-300"></div>
            </div>
            <div className="w-full lg:w-1/2" data-aos="fade-left">
              <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-right">
                Introducing the Educators and<br />Professional Instructor
              </h2>
            </div>
          </div>
        </div>

        {/* SLIDER */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#1ec28e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : professionals.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">
            No featured instructors yet.
          </div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              loop={professionals.length > 1}
              autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              navigation={{ nextEl: ".instructors-swiper-next", prevEl: ".instructors-swiper-prev" }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
            >
              {professionals.map((item, i) => {
                // Stable color based on id so Swiper loop duplicates get same color
                const colorIdx = item.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % bgColors.length;
                const roleColorIdx = item.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % roleColors.length;
                return (
                <SwiperSlide key={item.id}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    data-aos="zoom-in-up"
                    data-aos-delay={i * 100}
                    className={`${bgColors[colorIdx]} group rounded-2xl p-6 text-center transition duration-300 shadow-sm hover:shadow-xl lg:text-left`}
                  >
                    {/* IMAGE */}
                    <div className="relative mb-5 h-[220px] w-full overflow-hidden rounded-xl sm:h-[240px] lg:h-[220px]">
                      <Image
                        src={item.image || PLACEHOLDER_SVG}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain transition duration-500 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_SVG; }}
                      />
                    </div>

                    {/* NAME */}
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>

                    {/* ROLE */}
                    <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${roleColors[roleColorIdx]}`}>
                      {item.specialization}
                    </span>

                    {/* RATING */}
                    <div className="mt-4 flex items-center justify-center gap-1 text-sm text-orange-500 lg:justify-start">
                      {Array(5).fill(0).map((_, si) => (
                        <span key={si} className={si < Math.round(item.rating) ? "text-orange-400" : "text-gray-300"}>★</span>
                      ))}
                      <span className="text-gray-500 ml-1">({item.rating.toFixed(1)})</span>
                    </div>
                  </motion.div>
                </SwiperSlide>
                );
              })}
            </Swiper>

            {/* LEFT ARROW */}
            <button
              type="button"
              className="instructors-swiper-prev absolute left-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#1ec28e]/25 bg-white text-[#1ec28e] shadow-lg transition hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white md:flex md:-left-4 lg:-left-6"
            >
              <ArrowLeft size={23} />
            </button>

            {/* RIGHT ARROW */}
            <button
              type="button"
              className="instructors-swiper-next absolute right-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#1ec28e]/25 bg-white text-[#1ec28e] shadow-lg transition hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white md:flex md:-right-4 lg:-right-6"
            >
              <ArrowRight size={23} />
            </button>
          </div>
        )}
      </div>

      {/* LEFT DECOR */}
      <div className="absolute left-6 top-24 hidden md:block lg:left-6">
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="w-1 h-6 bg-orange-400 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* RIGHT FLOATING ICON */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-0 right-6 hidden md:block lg:right-6"
      >
        <Image src="/start.png" alt="icon" width={180} height={180} className="h-auto w-auto" />
      </motion.div>
    </section>
  );
};

export default Instructors;
