"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export type CourseItem = {
  img: string;
  title: string;
  color: string;
  category: string;
  rating: number;
  reviewCount: number;
};

export const allCourses: CourseItem[] = [
  {
    img: "/pro1.jpeg",
    title: "Master Web Design",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.8,
    reviewCount: 120,
  },
  {
    img: "/pro2.jpeg",
    title: "App Development",
    color: "bg-[#6aa6a6]",
    category: "Web Development",
    rating: 4.6,
    reviewCount: 340,
  },
  {
    img: "/pro3.jpeg",
    title: "Digital Marketing",
    color: "bg-[#c45a9a]",
    category: "Marketing",
    rating: 4.4,
    reviewCount: 210,
  },
  {
    img: "/pro1.jpeg",
    title: "Master Web Design",
    color: "bg-[#c49a7d]",
    category: "Graphic Design",
    rating: 4.7,
    reviewCount: 560,
  },
  {
    img: "/pro2.jpeg",
    title: "App Development",
    color: "bg-[#6aa6a6]",
    category: "Data Science",
    rating: 4.5,
    reviewCount: 140,
  },
  {
    img: "/pro3.jpeg",
    title: "Digital Marketing",
    color: "bg-[#c45a9a]",
    category: "Business Strategy",
    rating: 4.2,
    reviewCount: 90,
  },
];

export const allBooks: CourseItem[] = [
  {
    img: "/pro1.jpeg",
    title: "UI Patterns Handbook",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.7,
    reviewCount: 180,
  },
  {
    img: "/pro2.jpeg",
    title: "Modern React Architecture",
    color: "bg-[#6aa6a6]",
    category: "Programming",
    rating: 4.8,
    reviewCount: 420,
  },
  {
    img: "/pro3.jpeg",
    title: "Growth Marketing Playbook",
    color: "bg-[#c45a9a]",
    category: "Marketing",
    rating: 4.4,
    reviewCount: 130,
  },
  {
    img: "/pro1.jpeg",
    title: "Design Systems In Action",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.5,
    reviewCount: 260,
  },
  {
    img: "/pro2.jpeg",
    title: "Backend Performance Guide",
    color: "bg-[#6aa6a6]",
    category: "Cyber Security",
    rating: 4.3,
    reviewCount: 95,
  },
  {
    img: "/pro3.jpeg",
    title: "Brand Positioning Essentials",
    color: "bg-[#c45a9a]",
    category: "Finance",
    rating: 4.6,
    reviewCount: 540,
  },
];

export const allVideoLearnings: CourseItem[] = [
  {
    img: "/pro1.jpeg",
    title: "Figma To Prototype Bootcamp",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.9,
    reviewCount: 650,
  },
  {
    img: "/pro2.jpeg",
    title: "Full Stack Crash Course",
    color: "bg-[#6aa6a6]",
    category: "Web Development",
    rating: 4.7,
    reviewCount: 470,
  },
  {
    img: "/pro3.jpeg",
    title: "Ads Funnel Deep Dive",
    color: "bg-[#c45a9a]",
    category: "Marketing",
    rating: 4.3,
    reviewCount: 160,
  },
  {
    img: "/pro1.jpeg",
    title: "User Research Masterclass",
    color: "bg-[#c49a7d]",
    category: "Personal Development",
    rating: 4.6,
    reviewCount: 220,
  },
  {
    img: "/pro2.jpeg",
    title: "API Security In Practice",
    color: "bg-[#6aa6a6]",
    category: "Cyber Security",
    rating: 4.5,
    reviewCount: 115,
  },
  {
    img: "/pro3.jpeg",
    title: "Sales Storytelling Workshop",
    color: "bg-[#c45a9a]",
    category: "Business Strategy",
    rating: 4.8,
    reviewCount: 710,
  },
];

export const allOnlinePlatforms: CourseItem[] = [
  {
    img: "/pro1.jpeg",
    title: "Live Mentor Platform",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.8,
    reviewCount: 390,
  },
  {
    img: "/pro2.jpeg",
    title: "Code Interview Hub",
    color: "bg-[#6aa6a6]",
    category: "Development",
    rating: 4.7,
    reviewCount: 610,
  },
  {
    img: "/pro3.jpeg",
    title: "Business Growth Academy",
    color: "bg-[#c45a9a]",
    category: "Business",
    rating: 4.6,
    reviewCount: 270,
  },
  {
    img: "/pro1.jpeg",
    title: "Portfolio Review Studio",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.5,
    reviewCount: 145,
  },
  {
    img: "/pro2.jpeg",
    title: "System Design Arena",
    color: "bg-[#6aa6a6]",
    category: "Development",
    rating: 4.9,
    reviewCount: 730,
  },
  {
    img: "/pro3.jpeg",
    title: "Startup Launch Platform",
    color: "bg-[#c45a9a]",
    category: "Business",
    rating: 4.4,
    reviewCount: 110,
  },
];

type CourseGridSectionProps = {
  courses?: CourseItem[];
};

export default function CourseGridSection({
  courses = allCourses,
}: CourseGridSectionProps) {
  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f4f6f5] px-2 sm:px-4 md:px-6 lg:px-3 xl:px-2">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">

        {courses.map((course, i) => (
          <div key={i} className="group">

            {/* SVG MASK SHAPE */}
            <div className="relative h-64 w-full sm:h-72">

              <svg
                viewBox="0 0 300 260"
                className="absolute w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <clipPath id={`clip-${i}`} clipPathUnits="objectBoundingBox">
                    <path d="M0.05,0.15 Q0.05,0 0.2,0 H0.85 Q1,0 1,0.15 V0.75 Q1,1 0.8,1 H0.2 Q0,1 0,0.75 Z" />
                  </clipPath>
                </defs>

                <foreignObject
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  clipPath={`url(#clip-${i})`}
                >
                  <div className="w-full h-full relative">
                    <Image
                      src={course.img}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </foreignObject>
              </svg>

              {/* FLOAT BUTTON */}
              <div className={`absolute bottom-[-20px] right-6 ${course.color} w-16 h-16 rounded-full flex items-center justify-center shadow-xl`}>
                <ArrowUpRight className="text-white" size={24} />
              </div>
            </div>

            {/* CONTENT */}
            <div className="mt-12">

              <h3 className="text-xl font-semibold text-gray-900">
                {course.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                ⭐ {course.rating.toFixed(1)} ({course.reviewCount})
              </p>

              <p className="text-sm text-gray-500">
                📚 20 Lessons
              </p>

              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Fill out the form and the algorithm will offer the right team of experts
              </p>

<div className="flex flex-wrap gap-2 mt-3">

  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#eef5f3] text-[#1ec28e] border border-[#d1e7dd] transition hover:bg-[#1ec28e] hover:text-white">
    {course.category}
  </span>

  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#eef5f3] text-[#1ec28e] border border-[#d1e7dd] transition hover:bg-[#1ec28e] hover:text-white">
    UI/UX
  </span>

</div>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}