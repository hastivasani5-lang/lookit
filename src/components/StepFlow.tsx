"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Search for Experts",
    desc: "Use our smart search to find top professionals by skill, location, or industry.",
  },
  {
    step: "02",
    title: "Filter & Compare",
    desc: "Refine by ratings, experience, price, and availability – see who fits best.",
  },
  {
    step: "03",
    title: "View Profiles",
    desc: "Check portfolios, reviews, and credentials before making a decision.",
  },
  {
    step: "04",
    title: "Connect & Chat",
    desc: "Send messages, schedule calls, and discuss your project requirements.",
  },
  {
 step: "05",
    title: "Get Certified",
    desc: "Complete expert-led training and earn a verified certificate to showcase your skills.",
  },
];

export default function FindExpertsFlow() {
  return (
    <section className="py-20 bg-[#eef5f3]">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING & SUBHEADING */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a55] mb-3">
            Find the Best Experts
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Search and connect with top professionals near you – trusted, verified, and ready to help.
          </p>
        </div>

        {/* STEPS */}
        <div className="relative">

 

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute left-4 bottom-0 hidden md:block"
          >
            <Image src="/leaf.png" width={40} height={40} alt="" />
          </motion.div>

          {/* RIGHT mini images */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute right-0 -top-48 hidden md:block"
          >
            <Image src="/book2.png" width={100} height={100} alt="" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3.5 }}
            className="absolute right-4 bottom-0 hidden md:block"
          >
            <Image src="/mini1.png" width={42} height={42} alt="" />
          </motion.div>

          {/* Vertical line (mobile view) */}
          <div className="absolute left-1/2 top-0 w-[2px] h-full bg-gray-200 -translate-x-1/2 md:hidden"></div>

          <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-5 md:gap-6">

            {steps.map((item, index) => {
              const isTop = index % 2 === 0;

              return (
                <div key={index} className="relative flex flex-col items-center">

                  {/* CONNECTOR LINE (desktop) */}
                  {index !== steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-[2px] bg-gray-200 z-0"></div>
                  )}

                  {/* CARD */}
                  <div
                    className={`relative z-10 w-full max-w-[220px] bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center
                    ${isTop ? "md:mb-20" : "md:mt-20"}`}
                  >
                    {/* STEP BADGE */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1ec28e] text-white w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold shadow">
                      {item.step}
                    </div>

                    <h3 className="mt-6 font-semibold text-[#1e2a55]">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-400 mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}