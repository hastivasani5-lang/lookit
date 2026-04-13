"use client";


import Image from "next/image";
import { Star } from "lucide-react";
import { useState } from "react";

const courses = [
  {
    title: "Adobe Illustrator CC - Essentials",
    author: "Owen Christ",
    price: "$0",
    image: "/course1.jpg",
    badge: "FEATURED",
  },
  {
    title: "UX & Web Design Master Course",
    author: "Owen Christ",
    price: "$45.00",
    image: "/course2.jpg",
    badge: "-50%",
  },
  {
    title: "Confidence and Develop Conf...",
    author: "Harry Flower",
    price: "$38.00",
    image: "/course3.jpg",
  },
  {
    title: "Electronics - for Complete Beg...",
    author: "Oliver Porter",
    price: "$49.00",
    image: "/course4.jpg",
    badge: "FEATURED",
  },
  {
    title: "Introduction to Probability...",
    author: "Oliver Porter",
    price: "$45.00",
    image: "/course5.jpg",
  },
  {
    title: "Listening Skills - The Ultimate...",
    author: "Harry Flower",
    price: "$55.00",
    image: "/course6.jpg",
    badge: "-38%",
  },
  {
    title: "The Fast-Track to Singing Like...",
    author: "Emilie Logan",
    price: "$0",
    image: "/course7.jpg",
    badge: "FEATURED",
  },
  {
    title: "Learn Music Production Essenti...",
    author: "Emilie Logan",
    price: "$59.00",
    image: "/course8.jpg",
  },
];


export default function StudentsViewing() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(courses.length / pageSize);

  const paginatedCourses = courses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <section className="bg-[#f7f9fb] px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e2a55]">
            Students are{" "}
            <span className="relative inline-block">
              Viewing
              <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#1ec28e]"></span>
            </span>
          </h2>
          {/* Filters */}
          <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
            <button className="text-[#1ec28e] font-semibold">All</button>
            <button>Trending</button>
            <button>Popularity</button>
            <button>Featured</button>
            <button>Art & Design</button>
          </div>
        </div>
        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedCourses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {/* IMAGE */}
              <div className="relative">
                <Image
                  src={course.image}
                  alt=""
                  width={400}
                  height={250}
                  className="w-full h-[180px] object-cover"
                />
                {/* BADGE */}
                {course.badge && (
                  <span className="absolute top-3 left-3 bg-[#ff5b5b] text-white text-xs px-2 py-1 rounded">
                    {course.badge}
                  </span>
                )}
              </div>
              {/* CONTENT */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[#1e2a55] line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {course.author}
                </p>
                {/* PRICE */}
                <p className="text-[#1ec28e] font-bold mt-2">
                  {course.price}
                </p>
                {/* RATING */}
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-400">(5)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* ================= PAGINATION CONTROLS ================= */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>
          <span className="text-sm font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}