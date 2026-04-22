"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ChevronLeft, ChevronRight, BookOpen, Users, Heart } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

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
   {
    title: "Adobe Illustrator CC - Essentials",
    author: "Owen Christ",
    price: "$0",
    image: "/course1.jpg",
    badge: "FEATURED",
    category: "Design",
  },
  {
    title: "UX & Web Design Master Course",
    author: "Owen Christ",
    price: "$45.00",
    image: "/course2.jpg",
    badge: "-50%",
    category: "Design",
  },
  {
    title: "Creative Graphic Design",
    author: "Harry Flower",
    price: "$38.00",
    image: "/course3.jpg",
    category: "Design",
  },
  {
    title: "Electronics for Beginners",
    author: "Oliver Porter",
    price: "$49.00",
    image: "/course4.jpg",
    badge: "FEATURED",
    category: "Development",
  },
  {
    title: "Web Development Bootcamp",
    author: "Oliver Porter",
    price: "$45.00",
    image: "/course5.jpg",
    category: "Development",
  },
  {
    title: "React & Next.js Mastery",
    author: "Harry Flower",
    price: "$55.00",
    image: "/course6.jpg",
    badge: "-38%",
    category: "Development",
  },
  {
    title: "Business Strategy Fundamentals",
    author: "Emilie Logan",
    price: "$0",
    image: "/course7.jpg",
    badge: "FEATURED",
    category: "Business",
  },
  {
    title: "Startup Growth & Marketing",
    author: "Emilie Logan",
    price: "$59.00",
    image: "/course8.jpg",
    category: "Marketing",
  },
  {
    title: "Digital Marketing Pro Course",
    author: "John Smith",
    price: "$65.00",
    image: "/course2.jpg",
    category: "Marketing",
  },
  {
    title: "SEO & Content Strategy",
    author: "Anna White",
    price: "$40.00",
    image: "/course3.jpg",
    category: "Marketing",
  },
  {
    title: "Advanced UI/UX Design",
    author: "Owen Christ",
    price: "$70.00",
    image: "/course1.jpg",
    badge: "NEW",
    category: "Design",
  },
  {
    title: "Full Stack Web Development",
    author: "Oliver Porter",
    price: "$99.00",
    image: "/course5.jpg",
    badge: "HOT",
    category: "Development",
  },
];

// Helper to get badge styling based on badge text
const getBadgeStyle = (badge: string) => {
  const lower = badge.toLowerCase();
  if (lower.includes("featured")) return "bg-gradient-to-r from-amber-500 to-orange-500";
  if (lower.includes("-")) return "bg-gradient-to-r from-red-500 to-rose-500";
  if (lower.includes("new")) return "bg-gradient-to-r from-emerald-500 to-teal-500";
  if (lower.includes("hot")) return "bg-gradient-to-r from-orange-500 to-red-600";
  return "bg-gradient-to-r from-blue-500 to-indigo-500";
};

export default function StudentsViewing() {
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(courses.length / pageSize);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const paginatedCourses = courses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const router = useRouter();

  const handleToggleWishlist = async (courseTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isStudent) return;
    const id = `course-${encodeURIComponent(courseTitle)}`;
    try {
      const res = await fetch("/api/student/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: courseTitle, price: "", imageUrl: "", contentType: "book", professionalName: "", slug: "" }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { wishlisted: boolean };
      setWishlistIds((prev) => data.wishlisted ? [id, ...prev] : prev.filter((w) => w !== id));
    } catch { /* ignore */ }
  };

  return (
    <section className="bg-gradient-to-b from-[#f7f9fb] to-white px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e2a55]">
            All{" "}
            <span className="relative inline-block">
              Latest Courses
              <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></span>
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1e2a55] shadow-sm hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#1e2a55]"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1e2a55] shadow-sm hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#1e2a55]"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ================= ENHANCED GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {paginatedCourses.map((course, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
              onClick={() => router.push(`/course/${encodeURIComponent(course.title)}`)}
            >
              {/* IMAGE CONTAINER WITH ZOOM EFFECT */}
              <div className="relative overflow-hidden bg-gray-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={400}
                  height={250}
                  className="w-full h-[190px] object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* BADGE WITH GRADIENT */}
                {course.badge && (
                  <span
                    className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md ${getBadgeStyle(course.badge)}`}
                  >
                    {course.badge}
                  </span>
                )}

                {/* WISHLIST BUTTON */}
                {isStudent && (
                  <button
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:scale-110"
                    onClick={(e) => handleToggleWishlist(course.title, e)}
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`h-4 w-4 transition ${wishlistIds.includes(`course-${encodeURIComponent(course.title)}`) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                )}

                {/* OVERLAY ON HOVER */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* QUICK ACTION BUTTON (HOVER) */}
                <button className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#1e2a55] p-1.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white" onClick={e => e.stopPropagation()}>
                  <BookOpen size={16} />
                </button>
              </div>

              {/* CONTENT WITH ENHANCED TYPOGRAPHY */}
              <div className="p-4">
                <h3 className="text-base font-bold text-[#1e2a55] line-clamp-2 group-hover:text-[#1ec28e] transition-colors duration-200">
                  {course.title}
                </h3>

                {/* AUTHOR WITH ICON */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users size={10} className="text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {course.author}
                  </p>
                </div>

                {/* PRICE AND RATING ROW */}
                <div className="flex items-center justify-between mt-3">
                  <div>
                    {course.price === "$0" ? (
                      <span className="text-lg font-extrabold bg-gradient-to-r from-[#1ec28e] to-emerald-600 bg-clip-text text-transparent">
                        Free
                      </span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-[#1e2a55]">
                          {course.price}
                        </span>
                        {course.price === "$45.00" && (
                          <span className="text-xs text-gray-400 line-through">
                            $89.00
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* RATING WITH CUSTOM STARS */}
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600 ml-0.5">
                      5.0
                    </span>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-100 my-3"></div>

                {/* ENROLL BUTTON */}
                <button
                  className="w-full py-2 rounded-lg text-sm font-semibold transition-all duration-300  bg-gradient-to-r from-emerald-600 to-teal-600 text-white  group/btn flex items-center justify-center gap-2"
                  onClick={e => {
                    e.stopPropagation();
                    router.push(`/course/${encodeURIComponent(course.title)}`);
                  }}
                >
                  <span>Buy Now</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}