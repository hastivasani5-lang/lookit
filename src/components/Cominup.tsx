"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function Cominup() {
  const [activeTab, setActiveTab] = useState("all");

  const courses = [
    {
      title: "Digital Marketing",
      image: "/pro1.jpeg",
      price: "Free",
      duration: "6 Months",
      daily: "2 Hours",
      category: "short",
    },
    {
      title: "Coding Training Classes",
      image: "/pro2.jpeg",
      price: "$752.99",
      duration: "9 Months",
      daily: "1 Hour",
      category: "long",
    },
    {
      title: "Guitar Classes",
      image: "/pro3.jpeg",
      price: "$635.45",
      duration: "3 Months",
      daily: "3 Hour",
      category: "online",
    },
    {
      title: "Web Development",
      image: "/pro1.jpeg",
      price: "$450.00",
      duration: "5 Months",
      daily: "2 Hour",
      category: "short",
    },
    {
      title: "Business Management",
      image: "/pro2.jpeg",
      price: "$550.00",
      duration: "8 Months",
      daily: "2 Hours",
      category: "long",
    },
    {
      title: "UI/UX Fundamentals",
      image: "/pro3.jpeg",
      price: "$320.00",
      duration: "4 Months",
      daily: "1 Hour",
      category: "online",
    },
  ];

  const filteredCourses =
    activeTab === "all"
      ? courses
      : courses.filter((course) => course.category === activeTab);

  return (
    <section className="bg-[#f3f4f7] py-16">

     <div className="mx-auto mb-16 max-w-7xl text-center lg:text-left">
        
       <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">

          {/* LEFT */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              CORE FEATURES
            </div>

            {/* LINE */}
            <div className="mt-3 w-full h-px bg-gray-300"></div>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-right">
             Our Courses – Comprehensive <br />
Available all programs
            </h2>
          </div>

        </div>

      </div>
      {/* Heading */}
      <div className="text-center mb-10">
   

        {/* Tabs */}
        <div className="flex justify-center gap-8 mt-6 text-gray-600 font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : "pb-1"}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("short")}
            className={activeTab === "short" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : "pb-1"}
          >
            Short Term Courses
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("long")}
            className={activeTab === "long" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : "pb-1"}
          >
            Long Term Courses
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("online")}
            className={activeTab === "online" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : "pb-1"}
          >
            Online Courses
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="max-w-7xl mx-auto px-6">

        <Swiper
          key={activeTab}
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}

          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}

          loop={true}

          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {filteredCourses.map((course, index) => (
            <SwiperSlide key={index}>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">

                {/* Image */}
                <div className="relative">
                  
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={700}
                    height={400}
                    className="rounded-lg w-full h-[200px] object-cover"
                  />

                  {/* Price Badge */}
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white text-sm px-3 py-1 rounded">
                    {course.price}
                  </span>

                  {/* Free Ribbon */}
                  {course.price === "Free" && (
                    <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-6 py-1 rotate-[-45deg] -translate-x-6 translate-y-4">
                      Free
                    </span>
                  )}

                </div>

                {/* Content */}
                <div className="mt-4">

                  <h3 className="font-bold text-lg text-[#0f172a]">
                    {course.title}
                  </h3>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-yellow-400 text-sm mt-2">
                    ★★★★☆
                    <span className="text-gray-400 ml-2">
                      487 reviews
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between text-sm text-gray-500 mt-3">
                    <span>
                      <b>Duration :</b> {course.duration}
                    </span>

                    <span>
                      <b>Daily :</b> {course.daily}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mt-3">
                    Nemo enim ipsam voluptatem voluptas sit aspernatur
                    ratione voluptatem sequi nesciunt..
                  </p>

                </div>

              </div>

            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}