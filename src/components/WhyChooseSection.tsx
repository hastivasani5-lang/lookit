"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyChooseSection() {
  return (
    <section className="bg-[#f3f8f6] py-20 px-4 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* ================= LEFT GRID ================= */}
        <div className="grid grid-cols-2 gap-6">

          {/* CARD 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#dff3ec] rounded-2xl p-6 flex flex-col justify-center"
          >
            <div className="bg-[#cceee3] w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              🎥
            </div>
            <h2 className="text-3xl font-bold text-[#1ec28e]">+600h</h2>
            <p className="text-gray-600 mt-2">
              Popular <br /> Courses & Video
            </p>
          </motion.div>

          {/* IMAGE 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/reason.png"
              alt="student"
              width={300}
              height={300}
              className="rounded-2xl object-cover"
            />
          </motion.div>

          {/* IMAGE 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/reason1.png"
              alt="student"
              width={300}
              height={300}
              className="rounded-2xl object-cover"
            />
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#f2e8e3] rounded-2xl p-6 flex flex-col justify-center"
          >
            <div className="bg-[#ead5cb] w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              🔲
            </div>
            <h2 className="text-3xl font-bold text-[#1ec28e]">+1000h</h2>
            <p className="text-gray-600 mt-2">
              Talentful <br /> Certified Students
            </p>
          </motion.div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#e6f2ee] rounded-3xl p-10 relative overflow-hidden"
        >

          {/* FLOATING PLUS ICONS */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-6 right-6 text-[#1ec28e] text-xl"
          >
            ✚ ✚
          </motion.div>

          <p className="text-sm text-[#1ec28e] font-semibold mb-3">
            REASON FOR CHOOSE
          </p>

          <h2 className="text-3xl font-bold text-gray-800 leading-snug mb-6">
            Thriving Through Growth and Knowledge Community
          </h2>

          {/* LIST */}
          <div className="space-y-4 mb-6">
            {[
              "Flex Your Schedule",
              "Comfort of Anywhere",
              "Achieve More with Flexible Classes",
              "Flex Your Schedule",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm"
              >
                <span className="text-[#1ec28e]">✔</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <button className="bg-[#1ec28e] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#159a6b] transition">
            GET STARTED →
          </button>
        </motion.div>
      </div>

      {/* ================= FLOATING BOOKS ================= */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute left-[-30px] bottom-[-20px] hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Image
            src="/book2.png"
            alt="books"
            width={130}
            height={130}
            className="object-contain"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}