"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const instructors = [
  {
    name: "John D. Alexon",
    role: "UI/UX Designer",
    img: "/ins1.jpg",
    bg: "bg-[#eaf4fb]",
    roleColor: "text-blue-500 bg-blue-100",
  },
  {
    name: "Anjelina Watson",
    role: "Finance Specialist",
    img: "/ins2.jpg",
    bg: "bg-[#eaf7f3]",
    roleColor: "text-[#1ec28e] bg-[#1ec28e]/10",
  },
  {
    name: "Jakulin Farnandez",
    role: "Data Analyst",
    img: "/ins3.jpg",
    bg: "bg-[#f7efe8]",
    roleColor: "text-orange-500 bg-orange-100",
  },
  {
    name: "David X. Watson",
    role: "WP Developer",
    img: "/ins4.jpg",
    bg: "bg-[#f1eaf7]",
    roleColor: "text-purple-500 bg-purple-100",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const Instructors = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden px-4 md:px-8 lg:px-16">

      <div className="max-w-7xl mx-auto">

        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-16 gap-6">

          {/* LEFT */}
          <div>
            <p className="text-xs tracking-[0.25em] text-gray-500 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#1ec28e] rounded-full"></span>
              INSTRUCTOR
            </p>
            <div className="w-44 h-[1px] bg-gray-200"></div>
          </div>

          {/* RIGHT */}
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-gray-900 max-w-xl leading-tight">
            Introducing the Educators and Professional Instructor
          </h2>
        </div>

        {/* CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">

          {instructors.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className={`${item.bg} rounded-2xl p-6 text-center transition duration-300 
              hover:-translate-y-3 hover:shadow-xl group`}
            >

              {/* IMAGE */}
              <div className="relative w-full h-[220px] mb-5 rounded-xl overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              {/* NAME */}
              <h3 className="font-semibold text-gray-900 text-lg">
                {item.name}
              </h3>

              {/* ROLE */}
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${item.roleColor}`}
              >
                {item.role}
              </span>

              {/* RATING */}
              <div className="mt-4 flex justify-center items-center gap-1 text-orange-500 text-sm">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                <span className="text-gray-500 ml-1">(4.5)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LEFT DECOR */}
      <div className="absolute left-6 top-24 hidden lg:block">
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="w-1 h-6 bg-orange-400 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* RIGHT CHARACTER */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 right-6 hidden lg:block"
      >
        <Image
          src="/character.png"
          alt="char"
          width={160}
          height={160}
          className="animate-bounce"
        />
      </motion.div>

    </section>
  );
};

export default Instructors;