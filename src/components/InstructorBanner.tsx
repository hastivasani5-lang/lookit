

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden  bg-gradient-to-br from-[#e9f7ef] via-[#e6f4f1] to-[#eef5ff] px-4 py-14 sm:px-6 sm:py-20 lg:px-16">

      {/* ANIMATED BACKGROUND SHAPES - Clean & Non-redundant */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        
      

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
          className="absolute w-[300px] h-[300px] bg-gradient-to-r from-emerald-600 to-teal-600/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
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
            Growup Your Learning <br />
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

            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium">
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
              src="/students2.png"
              alt="hero"
              width={420}
              height={520}
              className="object-contain"
            />
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