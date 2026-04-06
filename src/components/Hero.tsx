"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const Hero = () => {
  return (
    <section className="w-full min-h-screen pt-28 px-4 md:px-8 bg-linear-to-r from-green-100 via-white to-pink-100 overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10"
      >

        {/* LEFT */}
        <motion.div
          variants={item}
          className="text-center lg:text-left"
        >
          <motion.p
            variants={item}
            whileHover={{ scale: 1.04 }}
            className="inline-block text-green-600 border border-green-300 px-4 py-1 rounded-full text-sm mb-4"
          >
            ✔ 100% SATISFACTION GUARANTEE
          </motion.p>

          <motion.h1 variants={item} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Growup Your Learning <br className="hidden md:block"/> 
            Skills with Educate
          </motion.h1>

          <motion.p variants={item} className="text-gray-600 mt-4 max-w-lg mx-auto lg:mx-0">
            Educate the ultimate destination for knowledge seekers and educators alike.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6">
            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-green-500 transition text-white px-6 py-3 rounded-full"
            >
              GET STARTED →
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="text-gray-700 font-medium transition"
            >
              FIND COURSE →
            </motion.button>
          </motion.div>

        </motion.div>

        {/* RIGHT */}
        <motion.div variants={item} className="relative flex justify-center">

          {/* FLOATING SHAPE 1 */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-10 left-10 w-12 h-12 bg-green-400 rounded-full opacity-30 blur-xl"
          />

          {/* FLOATING SHAPE 2 */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute top-20 right-10 w-10 h-10 border-4 border-green-400 rounded-full"
          />

          {/* FLOATING SHAPE 3 */}
          <motion.div
            animate={{ x: [0, 14, 0], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
            className="absolute bottom-16 right-16 w-14 h-14 rounded-2xl bg-pink-300/40 blur-lg"
          />

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="relative w-70 sm:w-87.5 md:w-105 lg:w-125"
          >
            <Image
              src="/hero.png"
              alt="hero"
              width={500}
              height={500}
              priority
              loading="eager"
              style={{ width: "100%", height: "auto" }}
              className="rounded-3xl"
            />

            {/* GLASS CARD */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="absolute bottom-5 left-5 bg-white/30 backdrop-blur-lg border border-white/40 px-4 py-3 rounded-xl shadow-lg"
            >
              <p className="text-lg font-bold">130+</p>
              <p className="text-xs text-gray-700">Expert Instructor</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.45 }}
              className="absolute -top-4 right-3 rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow"
            >
              Live classes daily
            </motion.div>

          </motion.div>

        </motion.div>

      </motion.div>
    </section>
  );
};

export default Hero;