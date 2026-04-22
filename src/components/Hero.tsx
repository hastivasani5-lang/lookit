

"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const rotatingWords = ["Learning", "Teaching", "Growing", "Exploring", "Achieving"];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e9f7ef] via-[#e6f4f1] to-[#eef5ff] px-4 py-14 sm:px-6 sm:py-20 lg:px-16">

      {/* ANIMATED BACKGROUND SHAPES */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute w-125 h-125 bg-[#1ec28e]/15 rounded-full blur-3xl -top-37.5 -left-37.5" />
        <div className="absolute w-112.5 h-112.5 bg-blue-200/20 rounded-full blur-3xl -bottom-30 -right-30" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">

        {/* LEFT CONTENT */}
        <div className="mx-auto w-full md:max-w-2xl md:text-center lg:max-w-none lg:text-left">

          {/* TAG */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e8f9f3] px-4 py-2 text-sm font-medium text-[#1ec28e] md:justify-center"
          >
            ✔ 100% SATISFACTION GUARANTEE
          </motion.div>

          {/* HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-xl font-bold leading-tight text-gray-900 md:text-2xl lg:text-[48px]"
          >
            Growup Your{" "}
            <span className="relative inline-block min-w-[220px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="inline-block bg-gradient-to-r from-[#1ec28e] to-[#0d7a57] bg-clip-text text-transparent"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            Skills with Educate
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-lg text-gray-600 md:mx-auto lg:mx-0"
          >
            <span className="font-semibold text-gray-800">Educate</span> the
            ultimate destination for knowledge seekers and educators alike.
            We are committed to transforming education.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 mb-10 flex flex-wrap items-center gap-4 sm:mb-16 sm:gap-6 md:justify-center lg:justify-start"
          >
            <button className=" bg-linear-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full font-medium transition flex items-center gap-2">
              GET STARTED →
            </button>

            <button className="text-gray-700 font-medium border-b border-gray-400 hover:text-[#1ec28e] transition">
              FIND COURSE →
            </button>
          </motion.div>

          {/* RATING */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 md:justify-center lg:justify-start"
          >
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full">
              ★
            </div>

            <div className="bg-[#1ec28e] text-white px-4 py-2 rounded-full text-sm font-medium">
              1k+
            </div>

            <div>
              <div className="text-orange-500 text-sm">
                ★★★★★ <span className="text-gray-500">(4.7 Ratings)</span>
              </div>
              <p className="text-gray-600 text-sm">
                Students learn daily with educate platform
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center">

          {/* MAIN IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <Image
              src="/hero.png"
              alt="hero"
              width={420}
              height={520}
              priority
              className="object-contain"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-[36px] left-0 z-20 hidden items-center gap-4 rounded-2xl bg-white/70 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex md:-left-5 md:px-6 md:py-4"
          >
            <div className="flex -space-x-2">
              <Image
                src="/hero-autor.png"
                width={100}
                height={35}
                className="rounded-full border-2 border-white"
                alt=""
              />
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">130+</h4>
              <p className="text-sm text-gray-600">Expert Instructor</p>
            </div>
          </motion.div>

          {/* TOP ROTATING SHAPE */}
          <motion.div
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute left-6 top-2 hidden md:block"
          >
            <Image src="/hero-arrow.png" width={70} height={70} alt="" />
          </motion.div>

          {/* DOT GRID */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute right-0 top-24 hidden md:block"
          >
            <Image src="/hero-dot.png" width={70} height={70} alt="" />
          </motion.div>

          {/* SCRIBBLE LINE */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="absolute left-0 top-1/2 hidden md:block"
          >
            <Image src="/start.png" width={60} height={60} alt="" />
          </motion.div>

          {/* TOP SMALL LEAF */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute right-20 top-0 hidden md:block"
          >
            <Image src="/mini1.png" width={50} height={50} alt="" />
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;