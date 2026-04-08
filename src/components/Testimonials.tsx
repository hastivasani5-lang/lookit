"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const testimonialSlides = [
  {
    title: "Impressive Learning!",
    description:
      "Educate the ultimate destination for knowledge seekers and educators. We are committed to transforming special education impact through practical and engaging learning methods.",
    name: "Sumona Aktar",
    role: "Students",
    image: "/pro1.jpeg",
    rating: "★★★★★",
  },
  {
    title: "Supportive Mentors!",
    description:
      "The classes are clear and easy to follow. Mentors give quick support and feedback, which helped me improve my confidence and complete projects faster.",
    name: "Anjelina Watson",
    role: "UI/UX Learner",
    image: "/pro2.jpeg",
    rating: "★★★★★",
  },
  {
    title: "Great Course Flow!",
    description:
      "Every module is structured well and explains concepts step by step. I improved my portfolio and got real-world skills that I can apply immediately.",
    name: "David Watson",
    role: "Design Student",
    image: "/pro3.jpeg",
    rating: "★★★★☆",
  },
];

const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const goPrev = () => {
    setActiveSlide((prev) => (prev === 0 ? testimonialSlides.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveSlide((prev) => (prev === testimonialSlides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = testimonialSlides[activeSlide];

  const newLocal = <div className="absolute left-0 bottom-0 w-full h-1/2 bg-white hidden md:block"></div>;
  return (
    <section className="bg-[#e6efed] py-10 px-4 md:px-10 lg:px-16 relative overflow-hidden">

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

   {/* MAIN */}
<div className="grid lg:grid-cols-2 gap-12 items-center mb-9">

  {/* LEFT */}
  <div className="relative flex justify-center" data-aos="fade-right">

    <div className="relative w-full max-w-[420px] h-[420px]">

      {/* MAP */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/testi-map.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-contain"
        />
      </div>

      {/* ✅ GREEN HALF CIRCLE */}
      <div className="absolute w-[300px] h-[300px] bg-[#1ec28e] rounded-full left-1/2 top-[60px] -translate-x-1/2"></div>

      {/* MAIN IMAGE */}
      <Image
        src="/girls.png"
        alt=""
        width={300}
        height={420}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10"
      />

      {/* AVATAR TOP */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30px] left-[10px] w-12 h-12 rounded-full overflow-hidden border-white shadow-md"
      >
        <Image src="/pro1.jpeg" fill sizes="48px" alt="" />
      </motion.div>

      {/* AVATAR LEFT BOTTOM */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30px] left-[20px] w-12 h-12 rounded-full overflow-hidden border-white shadow-md"
      >
        <Image src="/pro2.jpeg" fill sizes="48px" alt="" />
      </motion.div>

      {/* AVATAR RIGHT */}
      <motion.div
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[150px] right-[20px] w-12 h-12 rounded-full overflow-hidden border-white shadow-md"
      >
        <Image src="/pro3.jpeg" fill sizes="48px" alt="" />
      </motion.div>

    </div>
  </div>

  {/* RIGHT */}
  <div className="flex flex-col gap-6 mb-8" data-aos="fade-left" data-aos-delay="120">

    {/* CARD */}
    <motion.div
      key={activeSlide}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-[24px] p-8 shadow-lg hover:shadow-xl w-full max-w-[520px] transition-shadow duration-300"
      data-aos="fade-up"
      data-aos-delay="180"
    >

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#1ec28e] text-2xl">❝</span>
        <h3 className="font-semibold text-lg text-[#0f172a]">
          {currentSlide.title}
        </h3>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {currentSlide.description}
      </p>

      <div className="text-orange-500 text-base font-medium">{currentSlide.rating}</div>

    </motion.div>

    {/* USER */}
    <div className="flex items-center justify-between max-w-[520px]" data-aos="fade-up" data-aos-delay="260">

      <div className="flex items-center gap-3">
        <motion.div
          key={currentSlide.image}
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: [1, 1.06, 1], opacity: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#1ec28e]"
        >
          <Image src={currentSlide.image} width={50} height={50} alt={currentSlide.name} className="h-full w-full object-cover" />
        </motion.div>
        <div>
          <p className="font-semibold text-[#0f172a]">{currentSlide.name}</p>
          <p className="text-sm text-gray-500">{currentSlide.role}</p>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={goPrev}
          aria-label="Previous testimonial"
          className="w-10 h-10 rounded-full border-2 border-[#1ec28e] bg-white text-[#1ec28e] flex items-center justify-center font-bold transition-all duration-300 hover:bg-[#1ec28e] hover:text-white hover:scale-110 active:scale-95"
        >
          ←
        </button>
        <button
          onClick={goNext}
          aria-label="Next testimonial"
          className="w-10 h-10 rounded-full border-2 border-[#1ec28e] bg-white text-[#1ec28e] flex items-center justify-center font-bold transition-all duration-300 hover:bg-[#1ec28e] hover:text-white hover:scale-110 active:scale-95"
        >
          →
        </button>
      </div>

    </div>

  </div>

</div>

        {/* CTA */}
{/* CTA */}
<div className="relative mt- md:mt-[-60px]">

  

  <div className="relative bg-[#1ec28e] rounded-[24px] px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">

    {/* TEXT */}
    <h3 className="text-white text-lg md:text-2xl font-semibold text-center md:text-left">
      Learn Anytime, Anywhere <br />
      Start Your Free Trial!
    </h3>

    {/* CALL */}
    <div className="flex items-center gap-3 text-white justify-center md:justify-start">
      <div className="w-10 h-10 bg-white text-[#1ec28e] rounded-full flex items-center justify-center">
        ☎
      </div>
      <div>
        <p className="text-xs">Call Anytime</p>
        <p className="font-semibold text-sm">+123 (4567) 890</p>
      </div>
    </div>

    {/* TRUST */}
    <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow">
      <span className="text-green-500">★</span>
      <div>
        <p className="font-semibold text-xs">Trustpilot</p>
        <p className="text-[10px] text-gray-500">
          890+ Trustpilot 4.9 Ratings
        </p>
      </div>
    </div>

  </div>

</div>

    
    </section>
  );
};

export default Testimonials;