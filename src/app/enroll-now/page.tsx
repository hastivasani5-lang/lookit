"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoursesFilteredLayout from "@/components/CoursesFilteredLayout";
export default function EnrollNowPage() {
  return (
    <div className="bg-[#f3f8f6] min-h-screen">
      <Navbar />

      <div className="bg-[#e9f3ef] py-16 text-center relative overflow-hidden">
        {/* Animated Image */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-0 animate-float-slow pointer-events-none select-none">
          <Image
            src="/books.png"
            alt="Animated Course"
            width={120}
            height={120}
            className="opacity-80 drop-shadow-xl rounded-2xl"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 relative z-10">
          All Courses
        </h1>
        <p className="text-sm mt-2 text-gray-500 relative z-10">
          <span className="text-[#1ec28e] font-semibold">HOME</span> → ALL COURSES
        </p>
      </div>
     
        <CoursesFilteredLayout />
        <Footer />
        </div>
  );
}