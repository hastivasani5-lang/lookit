"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

// ✅ SWIPER
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

// ✅ AOS
import AOS from "aos";
import "aos/dist/aos.css";

const instructors = [
  {
    name: "John D. Alexon",
    role: "UI/UX Designer",
    img: "/pro1.jpeg",
    bg: "bg-[#eaf4fb]",
    roleColor: "text-blue-500 bg-blue-100",
  },
  {
    name: "Anjelina Watson",
    role: "Finance Specialist",
    img: "/pro2.jpeg",
    bg: "bg-[#eaf7f3]",
    roleColor: "text-[#1ec28e] bg-[#1ec28e]/10",
  },
  {
    name: "Jakulin Farnandez",
    role: "Data Analyst",
    img: "/pro3.jpeg",
    bg: "bg-[#f7efe8]",
    roleColor: "text-orange-500 bg-orange-100",
  },
  {
    name: "David X. Watson",
    role: "WP Developer",
    img: "/pro4.jpeg",
    bg: "bg-[#f1eaf7]",
    roleColor: "text-purple-500 bg-purple-100",
  },
  {
    name: "John D. Alexon",
    role: "UI/UX Designer",
    img: "/pro1.jpeg",
    bg: "bg-[#eaf4fb]",
    roleColor: "text-blue-500 bg-blue-100",
  },
];

const Instructors = () => {

  // ✅ AOS INIT
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden px-4 md:px-8 lg:px-16">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
    <div className="max-w-7xl mx-auto mb-16">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          {/* LEFT */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-[#1ec28e] rounded-full"></span>
              INSTRUCTORS
            </div>

            {/* LINE */}
            <div className="mt-3 w-full h-px bg-gray-300"></div>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight text-left lg:text-right">
            Introducing the Educators and
 <br />
Professional Instructor
            </h2>
          </div>

        </div>

      </div>

        {/* ================= SLIDER WRAPPER ================= */}
        <div className="relative">

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".instructors-swiper-next",
              prevEl: ".instructors-swiper-prev",
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {instructors.map((item, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  whileHover={{ y: -10 }}
                  data-aos="zoom-in-up"
                  data-aos-delay={i * 100}
                  className={`${item.bg} rounded-2xl p-6 text-center transition duration-300 shadow-sm hover:shadow-xl group`}
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
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ✅ LEFT ARROW */}
          <button
            type="button"
            className="instructors-swiper-prev absolute left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#1ec28e]/25 bg-white text-[#1ec28e] shadow-lg transition hover:bg-[#1ec28e] hover:text-white"
          >
            <ArrowLeft size={23} />
          </button>

          {/* ✅ RIGHT ARROW */}
          <button
            type="button"
            className="instructors-swiper-next absolute right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#1ec28e]/25 bg-white text-[#1ec28e] shadow-lg transition hover:bg-[#1ec28e] hover:text-white"
          >
            <ArrowRight size={23} />
          </button>

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

      {/* RIGHT FLOATING ICON */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-0 right-6 hidden lg:block"
      >
        <Image
          src="/start.png"
          alt="icon"
          width={60}
          height={60}
        />
      </motion.div>

    </section>
  );
};

export default Instructors;