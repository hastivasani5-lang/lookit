"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Star, TrendingUp } from "lucide-react";

const FeaturedCourse = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30 px-4 py-12 md:px-8 md:py-16 lg:px-16">
      {/* Background decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-stretch">
          {/* LEFT SIDE - VIDEO THUMBNAIL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative h-56 sm:h-64 md:h-72 lg:h-80 min-h-full overflow-hidden rounded-xl shadow-md"
          >
            <Image
              src="/offer-video.png"
              alt="Course preview"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white">
              <Play className="ml-0.5 h-5 w-5 text-emerald-600" fill="currentColor" />
            </button>
            <div className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white">
              Preview
            </div>
          </motion.div>

          {/* RIGHT SIDE - COURSE CARD (no text overlap with image) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl bg-white shadow-lg h-56 sm:h-64 md:h-72 lg:h-80 min-h-full flex flex-col"
          >
            <div className="relative z-10 p-5 sm:p-6 md:p-7">
              {/* Category */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                <span>Designing</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                Creative Graphic Design <br />
                <span className="text-emerald-600">with Adobe Suite</span>
              </h2>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">4.5</span>
                <span className="text-xs text-gray-500">(3.1k ratings)</span>
              </div>

              {/* Short description */}
              <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
                Master Photoshop, Illustrator & InDesign. Create stunning visuals, logos, marketing materials.
              </p>

              {/* Price & CTA */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-600">$35</span>
                  <span className="text-sm text-gray-400 line-through">$60</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    42% OFF
                  </span>
                </div>
                <button className="group flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:scale-105 hover:opacity-90 hover:shadow-md">
                  Enrol Now
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {/* Features row - compact */}
              <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>20+ hrs</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Certificate</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Beginner</span>
                </div>
              </div>
            </div>

            {/* DECORATIVE IMAGE - properly positioned, no text overlap */}
            <div className="absolute bottom-0 right-0 w-20 sm:w-24 md:w-28 pointer-events-none opacity-80">
              <Image
                src="/girls.png"
                alt=""
                width={160}
                height={200}
                className="h-auto w-full object-contain"
              />
            </div>

            {/* Discount badge - moved further right to avoid text */}
            <div className="absolute -right-1 top-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-bold text-white shadow-md rotate-6">
              10% OFF
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourse;