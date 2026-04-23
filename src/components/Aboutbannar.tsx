"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Star, Clock, Award, Users, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <section className="w-full py-16 px-4 md:px-10 bg-[#eef5f3] relative overflow-hidden">

      {/* BG decorations */}
      <div className="absolute top-10 left-5 hidden md:block">
        <img src="/leaf.png" alt="" className="w-12 h-12 opacity-60" />
      </div>
      <div className="absolute top-10 right-5 hidden md:block">
        <Image src="/wave.png" alt="" width={80} height={80} className="opacity-40" />
      </div>
      <Image src="/books.png" alt="" width={110} height={110}
        className="absolute bottom-5 right-5 hidden md:block opacity-60" />

      <div className="mx-auto max-w-7xl">

        {/* ── TOP: About text ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

          {/* Left - text */}
          <motion.div data-aos="fade-right" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#effaf6] px-4 py-1.5 text-sm font-semibold text-[#1ec28e] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#1ec28e]" />
              About Us
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              <span className="bg-gradient-to-r from-[#1ec28e] to-[#0d7a57] bg-clip-text text-transparent">
                Educate Online
              </span><br />
              Platform
            </h2>

            <p className="text-gray-600 text-base leading-7 mb-6 max-w-lg">
              Educate is the ultimate destination for knowledge seekers and educators alike.
              We transform education systems globally with modern and scalable learning solutions.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {["Innovative Learning System", "Worldwide Intelligent Learner",
                "Expert-Led Courses", "Flexible Scheduling"].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-[#effaf6] border border-[#1ec28e] text-[#1ec28e] text-xs font-bold">✔</span>
                  <p className="text-gray-800 text-sm font-medium">{f}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-10">
              <div>
                <h3 className="text-3xl font-extrabold text-[#1ec28e]">30+</h3>
                <p className="text-gray-500 text-sm">Expert Instructors</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-[#1ec28e]">6k+</h3>
                <p className="text-gray-500 text-sm">Students Worldwide</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-[#1ec28e]">4.8★</h3>
                <p className="text-gray-500 text-sm">Avg Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right - image */}
          <motion.div data-aos="fade-left" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center">
            <div className="relative w-[22rem] md:w-[30rem]">
              <Image src="/aboutban.png" alt="about" width={600} height={500}
                className="w-full h-auto object-contain relative z-10 drop-shadow-xl" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[90%] h-[88%] border-2 border-dashed border-[#1ec28e]/30 rounded-full animate-spin-slow" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM: Course Banner ────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#f0faf6] via-white to-[#f0f7ff] border border-gray-100">

          <div className="grid md:grid-cols-[1.1fr_1fr] gap-0 items-stretch">

            {/* Left - video preview */}
            <div className="group relative min-h-[260px] md:min-h-[300px] overflow-hidden">
              <Image src="/offer-video.png" alt="Course preview" fill
                className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/95 shadow-2xl flex items-center justify-center transition hover:scale-110">
                <Play className="ml-1 w-7 h-7 text-[#1ec28e]" fill="currentColor" />
              </button>
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
                Preview
              </div>
            </div>

            {/* Right - course info */}
            <div className="relative p-7 md:p-8 flex flex-col justify-center overflow-hidden">
              {/* Discount badge */}
              <div className="absolute -right-2 top-6 rounded-l-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                10% OFF
              </div>

              {/* Category */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e] w-fit mb-3">
                <TrendingUp className="w-3 h-3" />
                Designing
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
                Creative Graphic Design<br />
                <span className="text-[#1ec28e]">with Adobe Suite</span>
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-800">4.5</span>
                <span className="text-xs text-gray-400">(3.1k ratings)</span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Master Photoshop, Illustrator & InDesign. Create stunning visuals, logos, and marketing materials.
              </p>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#1ec28e]">$35</span>
                  <span className="text-base text-gray-400 line-through">$60</span>
                  <span className="rounded-full bg-[#effaf6] px-2.5 py-0.5 text-xs font-bold text-[#1ec28e]">42% OFF</span>
                </div>
                <button className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}>
                  Enrol Now →
                </button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4 border-t border-gray-100 pt-4">
                {[
                  { icon: Clock,  label: "20+ hrs" },
                  { icon: Award,  label: "Certificate" },
                  { icon: Users,  label: "Beginner" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <f.icon className="w-3.5 h-3.5 text-[#1ec28e]" />
                    {f.label}
                  </div>
                ))}
              </div>

              {/* Decorative girl */}
              <div className="absolute bottom-0 right-0 w-24 md:w-28 pointer-events-none opacity-90">
                <Image src="/girls.png" alt="" width={140} height={180} className="h-auto w-full object-contain" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
