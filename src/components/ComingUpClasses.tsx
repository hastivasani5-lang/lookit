"use client";

import React, { useEffect, useRef } from "react";
import { BarChart3, Monitor, Rocket, Search } from "lucide-react";

export default function ComingUpClasses() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const upcomingCourses = [
    {
      title: "AI for Everyone",
      description: "From beginner level to advanced practical workflows.",
      icon: Monitor,
      accentClass: "from-[#3d6fdf] to-[#2d55bf]",
      badgeClass: "bg-[#3d6fdf]",
    },
    {
      title: "Advanced Web Development",
      description: "Build modern full-stack projects with real deployment.",
      icon: Rocket,
      accentClass: "from-[#48c4d8] to-[#2ea3be]",
      badgeClass: "bg-[#41bfd4]",
    },
    {
      title: "Digital Marketing Mastery",
      description: "Learn SEO, ads, and growth strategies that convert.",
      icon: BarChart3,
      accentClass: "from-[#a86acf] to-[#8b4ab6]",
      badgeClass: "bg-[#9a5ec6]",
    },
    {
      title: "Search & Analytics",
      description: "Track campaign performance and optimize in real-time.",
      icon: Search,
      accentClass: "from-[#ec5db2] to-[#cc3f94]",
      badgeClass: "bg-[#dc4fa4]",
    },
    {
      title: "Mobile App Development",
      description: "Create iOS and Android apps from scratch.",
      icon: Monitor,
      accentClass: "from-[#f59e0b] to-[#d97706]",
      badgeClass: "bg-[#f59e0b]",
    },
    {
      title: "Cloud Architecture",
      description: "Scale applications with AWS, Azure, and GCP.",
      icon: Rocket,
      accentClass: "from-[#10b981] to-[#059669]",
      badgeClass: "bg-[#10b981]",
    },
  ];

  // Duplicate for infinite scroll
  const displayCourses = [...upcomingCourses, ...upcomingCourses];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;

    const autoScroll = () => {
      if (!slider) return;

      scrollAmount += 1;

      slider.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Reset when reached half
      if (scrollAmount >= slider.scrollWidth / 2) {
        scrollAmount = 0;
        slider.scrollTo({
          left: 0,
          behavior: "auto",
        });
      }
    };

    const interval = setInterval(autoScroll, 20); // speed control

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="my-12 bg-[#f3f4f7] py-10">
      <h2 className="mb-8 text-center text-3xl font-extrabold leading-tight text-[#121a2f] md:text-5xl">
        Interactive Online Learning
        <br />
        Key Features & Benefits
      </h2>

      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto px-3 py-3 scrollbar-hide snap-x snap-mandatory md:px-8"
      >
        {displayCourses.map((course, idx) => (
          <div
            key={`${course.title}-${idx}`}
            className="group relative h-[300px] min-w-[230px] max-w-[230px] flex-shrink-0 snap-center"
          >
            <div
              className={`pointer-events-none absolute inset-y-3 -right-2 w-7 rounded-2xl bg-gradient-to-b ${course.accentClass} shadow-md`}
            />

            <article className="relative flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.8)] transition-transform duration-300 group-hover:-translate-y-1">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <course.icon className="h-5 w-5" />
              </div>

              <h4 className="min-h-[56px] text-lg font-extrabold leading-7 tracking-tight text-slate-900">
                {course.title}
              </h4>

              <p className="mt-2 min-h-[44px] text-xs leading-5 text-slate-500">
                {course.description}
              </p>

              <div className="mt-auto pt-6">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white ${course.badgeClass}`}
                >
                  {String((idx % upcomingCourses.length) + 1).padStart(2, "0")}
                </span>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}