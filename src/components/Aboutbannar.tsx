

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="w-full py-16 px-4 md:px-10 bg-[#eef5f3] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-5 hidden md:block">
        <img src="/leaf.png" alt="" className="w-12 h-12 opacity-60" />
      </div>
      <div className="absolute top-10 right-5 hidden md:block">
        <Image src="/wave.png" alt="" width={80} height={80} className="opacity-40" />
      </div>
      <Image
        src="/books.png"
        alt=""
        width={110}
        height={110}
        className="absolute bottom-5 right-5 hidden md:block opacity-60"
      />

      <div className="container mx-auto px-2 md:px-4">
        {/* About text + image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* Left - text */}
          <motion.div
            data-aos="fade-right"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#effaf6] px-4 py-1.5 text-sm font-semibold text-[#1ec28e] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#1ec28e]" />
              About Us
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              <span className="bg-gradient-to-r from-[#1ec28e] to-[#0d7a57] bg-clip-text text-transparent">
                Educate Online
              </span>
              <br />
              Platform
            </h2>

            <p className="text-gray-600 text-base leading-7 mb-6 max-w-lg">
              Educate is the ultimate destination for knowledge seekers and educators alike.
              We transform education systems globally with modern and scalable learning solutions.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                "Innovative Learning System",
                "Worldwide Intelligent Learner",
                "Expert-Led Courses",
                "Flexible Scheduling",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-[#effaf6] border border-[#1ec28e] text-[#1ec28e] text-xs font-bold">
                    ✔
                  </span>
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
          <motion.div
            data-aos="fade-left"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="relative w-[28rem] md:w-[38rem]">
              <Image
                src="/aboutban.png"
                alt="about"
                width={600}
                height={500}
                className="w-full h-auto object-contain relative z-10 drop-shadow-xl"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[90%] h-[88%] border-2 border-dashed border-[#1ec28e]/30 rounded-full animate-spin-slow" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
