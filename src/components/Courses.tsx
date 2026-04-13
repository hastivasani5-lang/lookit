"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SlidersHorizontal, X } from "lucide-react";

const courses = [
  {
    img: "/about1.png",
    price: "$30",
    category: "Business",
    title: "Business Innovation And Development",
    instructor: "John D. Alexon",
    lessons: "12 Lessons",
    students: "1200 Students",
    color: "bg-[#eaf4fb]",
    badgeColor: "bg-blue-500",
  },
  {
    img: "/hero.png",
    price: "Free",
    category: "Networking",
    title: "Fundamentals of Network And Domains",
    instructor: "David Watson",
    lessons: "16 Lessons",
    students: "1500 Students",
    color: "bg-[#f6efe9]",
    badgeColor: "bg-orange-400",
  },
  {
    img: "/start.png",
    price: "$35",
    category: "Designing",
    title: "Creative Graphic Design with Adobe Suite",
    instructor: "Nelson Mendela",
    lessons: "15 Lessons",
    students: "1600 Students",
    color: "bg-[#eef7f3]",
    badgeColor: "bg-[#1ec28e]",
  },
];

const filterOptions = ["All Categorize", "Wordpress", "Business", "Networking", "Finance", "Designing"];

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("All Categorize");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isFilterDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterDrawerOpen]);

  const displayedCourses = useMemo(() => {
    if (activeFilter === "All Categorize") {
      return courses;
    }

    const filtered = courses.filter((course) => course.category.toLowerCase() === activeFilter.toLowerCase());
    return filtered.length > 0 ? filtered : courses;
  }, [activeFilter]);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 md:px-8 lg:px-10">

      {/* CONTAINER */}
      <div className="mx-auto w-full max-w-400">

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
    

        {/* FILTER - Desktop */}
        <div className="mb-12 hidden flex-wrap justify-center gap-4 lg:flex">
          {filterOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveFilter(item)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeFilter === item
                  ? "bg-[#1ec28e] text-white hover:bg-[#18ab7d]"
                  : "bg-gray-100 text-[#1ec28e] hover:bg-[#e6faf4]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* FILTER - Mobile/Tablet Icon */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Filter</p>
            <p className="text-sm font-medium text-gray-800">{activeFilter}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1ec28e] text-white shadow-sm hover:bg-[#18ab7d] transition"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">

          {displayedCourses.map((course, i) => (
            <div
              key={i}
              data-aos="fade-up"
              className={`${course.color} group rounded-2xl p-5 text-center transition hover:-translate-y-2 hover:shadow-xl lg:text-left`}
            >
              {/* IMAGE */}
              <div className="relative mb-4">
                <Image
                  src={course.img}
                  alt="course"
                  width={400}
                  height={250}
                  className="h-50 w-full rounded-xl object-cover"
                />
    {/* PRICE BADGE */}
    <div className={`absolute bottom-4 left-4 ${course.badgeColor} text-white text-sm px-4 py-2 rounded-full shadow-md`}>
      {course.price}
    </div>
  </div>

  {/* CATEGORY */}
  <span className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs text-gray-600 shadow">
    {course.category}
  </span>

  {/* TITLE */}
  <h3 className="mb-2 text-lg font-semibold leading-snug text-gray-900">
    {course.title}
  </h3>

  {/* RATING */}
  <div className="mb-4 flex items-center gap-2 text-sm justify-center lg:justify-start">
    <div className="text-orange-500">★★★★★</div>
    <span className="text-gray-500">(4.5/3 Ratings)</span>
  </div>

  {/* INSTRUCTOR */}
  <div className="mb-4 flex items-center gap-3 justify-center lg:justify-start">
    <Image
      src="/person.png"
      alt="user"
      width={40}
      height={40}
      className="h-10 w-10 rounded-full object-cover"
    />
    <div>
      <p className="text-sm font-medium text-gray-900">
        {course.instructor}
      </p>
      <p className="text-xs text-gray-500">Instructor</p>
    </div>
  </div>

  {/* DIVIDER */}
  <div className="border-t border-gray-200 my-4"></div>

  {/* FOOTER (LESSONS + STUDENTS) */}
    
 <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

  <div className="flex flex-wrap items-center gap-4 text-sm">
    <div className="flex items-center gap-2 text-gray-600">
      <span className="text-blue-500">📄</span>
      <span>{course.lessons}</span>
    </div>

    <div className="flex items-center gap-2 text-gray-600">
      <span className="text-purple-500">👤</span>
      <span>{course.students}</span>
    </div>
  </div>

  <button className="w-full rounded-full bg-[#1ec28e] px-6 py-2 text-sm text-white font-semibold shadow hover:bg-[#18ab7d] transition sm:w-auto">
    ENROL NOW →
  </button>

  </div>


</div>

          ))}

        </div>

      </div>

      {/* LEFT CHARACTER (DO NOT REMOVE) */}
      <Image
        src="/person.png"
        alt="char"
        width={140}
        height={100}
        className="absolute bottom-0 left-0 hidden h-auto w-28 animate-float md:block lg:w-35"
      />

      {/* Responsive Filter Drawer */}
      {isFilterDrawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Course filters drawer">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFilterDrawerOpen(false)}
            aria-label="Close filters"
          />

          <aside className="absolute right-0 top-0 h-full w-[86vw] max-w-85 overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1ec28e] text-white hover:bg-[#18ab7d] transition"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {filterOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setActiveFilter(item);
                    setIsFilterDrawerOpen(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeFilter === item
                      ? "bg-[#1ec28e] text-white hover:bg-[#18ab7d]"
                      : "bg-gray-100 text-[#1ec28e] hover:bg-[#e6faf4]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </aside>
        </div>
      ) : null}

    </section>
  );
};

export default Courses;