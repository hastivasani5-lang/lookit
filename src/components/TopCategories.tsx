"use client";

import { Brush, Code, Heart, Lightbulb, Briefcase, DollarSign, Megaphone, Camera, Database, Dumbbell, Music, GraduationCap } from "lucide-react";
import Link from "next/link";

const categories = [
  { title: "Art & Design", slug: "art-design", icon: Brush },
  { title: "Development", slug: "development", icon: Code },
  { title: "Lifestyle", slug: "lifestyle", icon: Heart },
  { title: "Personal Development", slug: "personal-development", icon: Lightbulb },
  { title: "Business", slug: "business", icon: Briefcase },
  { title: "Finance", slug: "finance", icon: DollarSign },
  { title: "Marketing", slug: "marketing", icon: Megaphone },
  { title: "Photography", slug: "photography", icon: Camera },
  { title: "Data Science", slug: "data-science", icon: Database },
  { title: "Health & Fitness", slug: "health-fitness", icon: Dumbbell },
  { title: "Music", slug: "music", icon: Music },
  { title: "Teaching & Academics", slug: "teaching-academics", icon: GraduationCap },
];

export default function TopCategories() {
  return (
    <section className="bg-white px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e2a55] relative inline-block">
            Top Categories
            <span className="absolute left-0 -bottom-1 w-16 h-[3px] bg-gradient-to-r from-emerald-600 to-teal-600 rounded"></span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Link
                href={`/categories/${cat.slug}`}
                key={index}
                className="flex items-center gap-4 bg-[#f5f7fa] px-5 py-4 rounded-lg hover:shadow-md hover:bg-white transition cursor-pointer border no-underline"
                prefetch={false}
              >
                <div className="text-[#1ec28e]">
                  <Icon size={22} />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {cat.title}
                </span>
              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}