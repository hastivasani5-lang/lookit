"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Star, Clock, Award, Users } from "lucide-react";

const FeaturedCourse = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f7f0] via-[#f0faf6] to-white px-4 py-12 md:px-8 md:py-16 lg:px-16">
      
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-center">
          
          {/* LEFT - Video/Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative h-64 sm:h-72 md:h-80 overflow-hidden rounded-2xl shadow-xl"
          >
            <Image
              src="/offer-video.png"
              alt="Course preview"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            
            {/* Play button */}
            <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-2xl transition-all hover:scale-110 hover:bg-white">
              <Play className="ml-1 h-7 w-7 text-emerald-600" fill="currentColor" />
            </button>

            {/* Preview badge */}
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
              Preview
            </div>
          </motion.div>

          {/* RIGHT - Course Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-white shadow-xl p-6 sm:p-8 flex flex-col"
          >
            {/* Discount badge */}
            <div className="absolute -right-2 top-6 rounded-l-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
              10% OFF
            </div>

            {/* Category tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 w-fit mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Designing
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">
              Creative Graphic Design<br />
              <span className="text-emerald-600">with Adobe Suite</span>
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800">4.5</span>
              <span className="text-xs text-gray-400">(3.1k ratings)</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Master Photoshop, Illustrator & InDesign. Create stunning visuals, logos, and marketing materials.
            </p>

            {/* Price & CTA */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">$35</span>
                <span className="text-base text-gray-400 line-through">$60</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  42% OFF
                </span>
              </div>
              <button className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
                Enrol Now
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Clock className="h-3.5 w-3.5 text-emerald-500" />
                <span>20+ hrs</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Award className="h-3.5 w-3.5 text-emerald-500" />
                <span>Certificate</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Users className="h-3.5 w-3.5 text-emerald-500" />
                <span>Beginner</span>
              </div>
            </div>

            {/* Decorative girl image */}
            <div className="absolute bottom-0 right-0 w-24 sm:w-28 md:w-32 pointer-events-none opacity-90">
              <Image src="/girls.png" alt="" width={160} height={200} className="h-auto w-full object-contain" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedCourse;
