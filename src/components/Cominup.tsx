
"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

export default function UpcomingClasses() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  const instructors = [
    {
      name: "Lena Pearce",
      role: "UI/UX Instructor",
      image: "/team1.jpg",
    },
    {
      name: "Sophia Bach",
      role: "Frontend Developer",
      image: "/team2.jpg",
    },
    {
      name: "Arielle Copper",
      role: "Digital Marketing",
      image: "/team3.jpg",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
      <div className="mx-auto mb-16 max-w-7xl text-center lg:text-left">
        
       <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">

          {/* LEFT */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Upcoming Classes
            </div>

            {/* LINE */}
            <div className="mt-3 w-full h-px bg-gray-300"></div>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-right">
              Learn from the best <br />instructors in the industry
            </h2>
          </div>

        </div>

      </div>
    
  

        {/* Cards - Horizontal Auto-Scroll */}
        <div className="overflow-hidden mt-16 pt-12 pb-8 group">
          <div
            className="flex gap-10 animate-marquee group-hover:paused-marquee"
            style={{ width: 'max-content' }}
          >
            {instructors.concat(instructors).map((item, index) => (
              <div key={index} className="relative flex justify-center">
                {/* Background Shape */}
                <div className="absolute w-48 h-48 bg-[#1ec28e]/20 rounded-3xl rotate-12 top-6"></div>
                {/* Card */}
                <div className="relative bg-white rounded-2xl shadow-lg p-6 w-72 text-center">
                  {/* Profile Image */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-white shadow-md"
                    />
                  </div>
                  {/* Content */}
                  <div className="mt-12">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 italic mt-1">
                      {item.role}
                    </p>
                    <p className="text-gray-400 text-sm mt-3">
                      Expert instructor with practical experience.
                    </p>
                  </div>
                  {/* Bottom Icon */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow">
                    ⭐
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
      </div>
    </section>
  );
}