

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e9f7ef] via-[#e6f4f1] to-[#eef5ff] px-6 lg:px-16 py-20">

      {/* ANIMATED BACKGROUND SHAPES - Clean & Non-redundant */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        
        {/* Floating Green Blob */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[500px] h-[500px] bg-[#1ec28e]/15 rounded-full blur-3xl top-[-150px] left-[-150px]"
        />

        {/* Floating Blue Blob */}
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute w-[450px] h-[450px] bg-blue-200/20 rounded-full blur-3xl bottom-[-120px] right-[-120px]"
        />

        {/* Subtle Center Glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[300px] h-[300px] bg-[#1ec28e]/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center relative z-10">

        {/* LEFT CONTENT */}
        <div>

          {/* TAG */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8f9f3] text-[#1ec28e] text-sm font-medium mb-6"
          >
            ✔ 100% SATISFACTION GUARANTEE
          </motion.div>

          {/* HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-xl md:text-2xl lg:text-[48px] font-bold leading-tight text-gray-900"
          >
            Growup Your Learning <br />
            Skills with Educate
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-600 max-w-lg"
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
            className="flex items-center gap-6 mt-8 mb-16"
          >
            <button className="bg-[#1ec28e] hover:bg-[#18ab7d] text-white px-6 py-3 rounded-full font-medium transition flex items-center gap-2">
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
            className="flex items-center gap-4"
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

        <div className="relative flex justify-center items-center">

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
              className="object-contain"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute left-[-20px] bottom-[40px] z-20 bg-white/70 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4"
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
            className="absolute top-0 left-10"
          >
            <Image src="/hero-arrow.png" width={70} height={70} alt="" />
          </motion.div>

          {/* DOT GRID */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute top-24 right-0"
          >
            <Image src="/hero-dot.png" width={70} height={70} alt="" />
          </motion.div>

          {/* SCRIBBLE LINE */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="absolute left-0 top-1/2"
          >
            <Image src="/start.png" width={60} height={60} alt="" />
          </motion.div>

          {/* TOP SMALL LEAF */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-0 right-20"
          >
            <Image src="/mini1.png" width={50} height={50} alt="" />
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;