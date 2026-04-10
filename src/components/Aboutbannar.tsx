"use client";

import Image from "next/image";
import SectionTitle from "./SectionTitle";

const About = () => {
  return (
    <section className="w-full py-20 px-4 md:px-10 bg-[#eef5f3] relative overflow-hidden">

      {/* LEFT DECORATION */}
      <div className="absolute top-10 left-5 hidden md:block animate-float">
        <img src="/leaf.png" alt="leaf" className="w-12 h-12" />
      </div>

      {/* RIGHT DECORATION */}
      <div className="absolute top-10 right-5 hidden md:block animate-float-slow">
        <Image src="/wave.png" alt="wave" width={100} height={100} />
      </div>

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT IMAGE */}
        <div className="flex justify-center lg:justify-start lg:items-start" data-aos="fade-right">
          <div className="relative w-[24rem] md:w-[34rem] lg:w-[42rem] lg:-ml-10">
              <Image
                src="/aboutban.png"
                alt="about"
                width={770}
                height={600}
                className="w-full h-auto object-contain relative z-10"
              />
              {/* ROTATING BORDER */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[93%] h-[90%] border-2 border-dashed border-[#1ec28e]/40 rounded-full animate-spin-slow"></div>
              </div>
            </div>
            
        </div>

        {/* RIGHT CONTENT */}
        <div data-aos="fade-left" className="w-full max-w-xl">

       

          {/* HEADING */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-5">
            <span className="text-[#1ec28e]">
              Educate Online Platform
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-base leading-7 mb-6">
            Educate is the ultimate destination for knowledge seekers and educators alike.
            We transform education systems globally with modern and scalable learning solutions.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-[#1ec28e] text-[#1ec28e] text-xs">
                ✔
              </span>
              <p className="text-gray-800 text-sm font-medium">
                Innovative Learning System
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-[#1ec28e] text-[#1ec28e] text-xs">
                ✔
              </span>
              <p className="text-gray-800 text-sm font-medium">
                Worldwide Intelligent Learner
              </p>
            </div>

          </div>

          {/* STATS */}
          <div className="flex gap-10 mt-6">

            <div>
              <h3 className="text-3xl font-bold text-[#1ec28e]">30+</h3>
              <p className="text-gray-500 text-sm">
                Expert Instructors
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#1ec28e]">6k+</h3>
              <p className="text-gray-500 text-sm">
                Students Worldwide
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* BOOK IMAGE */}
      <Image
        src="/books.png"
        alt="books"
        width={130}
        height={130}
        className="absolute bottom-5 right-5 hidden md:block animate-float"
      />
    </section>
  );
};

export default About;