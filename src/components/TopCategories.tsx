"use client";

import { Brush, Code, Heart, Lightbulb, Briefcase, DollarSign, Megaphone, Camera, Database, Dumbbell, Music, GraduationCap } from "lucide-react";

const categories = [
  { title: "Art & Design", icon: Brush },
  { title: "Development", icon: Code },
  { title: "Lifestyle", icon: Heart },
  { title: "Personal Development", icon: Lightbulb },
  { title: "Business", icon: Briefcase },
  { title: "Finance", icon: DollarSign },
  { title: "Marketing", icon: Megaphone },
  { title: "Photography", icon: Camera },
  { title: "Data Science", icon: Database },
  { title: "Health & Fitness", icon: Dumbbell },
  { title: "Music", icon: Music },
  { title: "Teaching & Academics", icon: GraduationCap },
];

export default function TopCategories() {
  return (
    <section className="bg-white px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e2a55] relative inline-block">
            Top Categories
            <span className="absolute left-0 -bottom-1 w-16 h-[3px] bg-[#1ec28e] rounded"></span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 bg-[#f5f7fa] px-5 py-4 rounded-lg hover:shadow-md hover:bg-white transition cursor-pointer border"
              >
                <div className="text-[#1ec28e]">
                  <Icon size={22} />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {cat.title}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}