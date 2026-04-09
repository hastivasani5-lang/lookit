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
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=90",
    title: "Master Web Design",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.8,
    reviewCount: 120,
  },
  {
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",
    title: "App Development",
    color: "bg-[#6aa6a6]",
    category: "Web Development",
    rating: 4.6,
    reviewCount: 340,
  },
  {
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=90",
    title: "Digital Marketing",
    color: "bg-[#c45a9a]",
    category: "Marketing",
    rating: 4.4,
    reviewCount: 210,
  },
  {
    img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=900&q=90",
    title: "Design Systems Pro",
    color: "bg-[#c49a7d]",
    category: "Graphic Design",
    rating: 4.7,
    reviewCount: 560,
  },
  {
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=90",
    title: "Data Analytics Lab",
    color: "bg-[#6aa6a6]",
    category: "Data Science",
    rating: 4.5,
    reviewCount: 140,
  },
  {
    img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=900&q=90",
    title: "Growth Strategy",
    color: "bg-[#c45a9a]",
    category: "Business Strategy",
    rating: 4.2,
    reviewCount: 90,
  },
  {
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=90",
    title: "Frontend Mastery",
    color: "bg-[#7f93d1]",
    category: "Web Development",
    rating: 4.8,
    reviewCount: 380,
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=90",
    title: "Product Marketing",
    color: "bg-[#c68b5f]",
    category: "Marketing",
    rating: 4.5,
    reviewCount: 250,
  },
  {
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90",
    title: "UX Research Essentials",
    color: "bg-[#6a9d8f]",
    category: "UI/UX Design",
    rating: 4.9,
    reviewCount: 640,
  },
  {
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=90",
    title: "Brand Storytelling",
    color: "bg-[#d17a7a]",
    category: "Business Strategy",
    rating: 4.6,
    reviewCount: 320,
  },
  {
    img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=90",
    title: "No-Code Launchpad",
    color: "bg-[#8e7ab5]",
    category: "Productivity",
    rating: 4.3,
    reviewCount: 175,
  },
  {
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=90",
    title: "Content Strategy",
    color: "bg-[#5fa8d3]",
    category: "Content",
    rating: 4.4,
    reviewCount: 205,
  },
  {
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=90",
    title: "Leadership Playbook",
    color: "bg-[#d4a373]",
    category: "Leadership",
    rating: 4.7,
    reviewCount: 490,
  },
  {
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=90",
    title: "AI Tools For Teams",
    color: "bg-[#7b9e89]",
    category: "AI",
    rating: 4.8,
    reviewCount: 530,
  },
  {
    img: "https://images.unsplash.com/photo-1542204625-de293a502e16?auto=format&fit=crop&w=900&q=90",
    title: "Business Communication",
    color: "bg-[#b07bac]",
    category: "Communication",
    rating: 4.6,
    reviewCount: 287,
  },
];

export const allBooks: CourseItem[] = [
  {
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=90",
    title: "UI Patterns Handbook",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.7,
    reviewCount: 180,
  },
  {
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=90",
    title: "Modern React Architecture",
    color: "bg-[#6aa6a6]",
    category: "Programming",
    rating: 4.8,
    reviewCount: 420,
  },
  {
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=90",
    title: "Growth Marketing Playbook",
    color: "bg-[#c45a9a]",
    category: "Marketing",
    rating: 4.4,
    reviewCount: 130,
  },
  {
    img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=90",
    title: "Design Systems In Action",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.5,
    reviewCount: 260,
  },
  {
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=90",
    title: "Backend Performance Guide",
    color: "bg-[#6aa6a6]",
    category: "Cyber Security",
    rating: 4.3,
    reviewCount: 95,
  },
  {
    img: "https://images.unsplash.com/photo-1455885666463-9d5a7ad0f8cf?auto=format&fit=crop&w=900&q=90",
    title: "Brand Positioning Essentials",
    color: "bg-[#c45a9a]",
    category: "Finance",
    rating: 4.6,
    reviewCount: 540,
  },
];

export const allVideoLearnings: CourseItem[] = [
  {
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=90",
    title: "Figma To Prototype Bootcamp",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.9,
    reviewCount: 650,
  },
  {
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=90",
    title: "Full Stack Crash Course",
    color: "bg-[#6aa6a6]",
    category: "Web Development",
    rating: 4.7,
    reviewCount: 470,
  },
  {
    img: "https://images.unsplash.com/photo-1584697964403-4cc5f0f0a357?auto=format&fit=crop&w=900&q=90",
    title: "Ads Funnel Deep Dive",
    color: "bg-[#c45a9a]",
    category: "Marketing",
    rating: 4.3,
    reviewCount: 160,
  },
  {
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=90",
    title: "User Research Masterclass",
    color: "bg-[#c49a7d]",
    category: "Personal Development",
    rating: 4.6,
    reviewCount: 220,
  },
  {
    img: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=900&q=90",
    title: "API Security In Practice",
    color: "bg-[#6aa6a6]",
    category: "Cyber Security",
    rating: 4.5,
    reviewCount: 115,
  },
  {
    img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=90",
    title: "Sales Storytelling Workshop",
    color: "bg-[#c45a9a]",
    category: "Business Strategy",
    rating: 4.8,
    reviewCount: 710,
  },
];

export const allOnlinePlatforms: CourseItem[] = [
  {
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=90",
    title: "Live Mentor Platform",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.8,
    reviewCount: 390,
  },
  {
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=90",
    title: "Code Interview Hub",
    color: "bg-[#6aa6a6]",
    category: "Development",
    rating: 4.7,
    reviewCount: 610,
  },
  {
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=90",
    title: "Business Growth Academy",
    color: "bg-[#c45a9a]",
    category: "Business",
    rating: 4.6,
    reviewCount: 270,
  },
  {
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=90",
    title: "Portfolio Review Studio",
    color: "bg-[#c49a7d]",
    category: "UI/UX Design",
    rating: 4.5,
    reviewCount: 145,
  },
  {
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=90",
    title: "System Design Arena",
    color: "bg-[#6aa6a6]",
    category: "Development",
    rating: 4.9,
    reviewCount: 730,
  },
  {
    img: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=90",
    title: "Startup Launch Platform",
    color: "bg-[#c45a9a]",
    category: "Business",
    rating: 4.4,
    reviewCount: 110,
  },
  {
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=90",
    title: "Remote Classroom Pro",
    color: "bg-[#7f93d1]",
    category: "Education",
    rating: 4.7,
    reviewCount: 402,
  },
  {
    img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=900&q=90",
    title: "Course Creator Cloud",
    color: "bg-[#b38f5f]",
    category: "Content",
    rating: 4.6,
    reviewCount: 298,
  },
  {
    img: "https://images.unsplash.com/photo-1601933470928-c6f4a6b51d15?auto=format&fit=crop&w=900&q=90",
    title: "Skill Test Engine",
    color: "bg-[#699e8c]",
    category: "Assessment",
    rating: 4.5,
    reviewCount: 257,
  },
  {
    img: "https://images.unsplash.com/photo-1584697964403-4cc5f0f0a357?auto=format&fit=crop&w=900&q=90",
    title: "Video Learning Vault",
    color: "bg-[#d17a7a]",
    category: "Video Learning",
    rating: 4.8,
    reviewCount: 645,
  },
  {
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=90",
    title: "Team Upskilling Suite",
    color: "bg-[#8e7ab5]",
    category: "Corporate",
    rating: 4.4,
    reviewCount: 188,
  },
  {
    img: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=90",
    title: "Coding Track LMS",
    color: "bg-[#5fa8d3]",
    category: "Development",
    rating: 4.9,
    reviewCount: 812,
  },
  {
    img: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=900&q=90",
    title: "Live Doubt Support",
    color: "bg-[#d4a373]",
    category: "Support",
    rating: 4.6,
    reviewCount: 334,
  },
  {
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=90",
    title: "Career Learning Path",
    color: "bg-[#7b9e89]",
    category: "Career",
    rating: 4.7,
    reviewCount: 476,
  },
  {
    img: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=900&q=90",
    title: "AI Tutor Workspace",
    color: "bg-[#b07bac]",
    category: "AI",
    rating: 4.8,
    reviewCount: 559,
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
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