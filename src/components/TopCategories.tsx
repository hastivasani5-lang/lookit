"use client";

import { Brush, Code, Heart, Lightbulb, Briefcase, DollarSign, Megaphone, Camera, Database, Dumbbell, Music, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const categories = [
  { title: "Art & Design",         slug: "art-design",           icon: Brush,         color: "bg-pink-50   text-pink-500",    border: "hover:border-pink-300" },
  { title: "Development",          slug: "development",          icon: Code,          color: "bg-blue-50   text-blue-500",    border: "hover:border-blue-300" },
  { title: "Lifestyle",            slug: "lifestyle",            icon: Heart,         color: "bg-red-50    text-red-500",     border: "hover:border-red-300" },
  { title: "Personal Development", slug: "personal-development", icon: Lightbulb,     color: "bg-yellow-50 text-yellow-500", border: "hover:border-yellow-300" },
  { title: "Business",             slug: "business",             icon: Briefcase,     color: "bg-indigo-50 text-indigo-500", border: "hover:border-indigo-300" },
  { title: "Finance",              slug: "finance",              icon: DollarSign,    color: "bg-green-50  text-green-600",  border: "hover:border-green-300" },
  { title: "Marketing",            slug: "marketing",            icon: Megaphone,     color: "bg-orange-50 text-orange-500", border: "hover:border-orange-300" },
  { title: "Photography",          slug: "photography",          icon: Camera,        color: "bg-purple-50 text-purple-500", border: "hover:border-purple-300" },
  { title: "Data Science",         slug: "data-science",         icon: Database,      color: "bg-cyan-50   text-cyan-600",   border: "hover:border-cyan-300" },
  { title: "Health & Fitness",     slug: "health-fitness",       icon: Dumbbell,      color: "bg-lime-50   text-lime-600",   border: "hover:border-lime-300" },
  { title: "Music",                slug: "music",                icon: Music,         color: "bg-rose-50   text-rose-500",   border: "hover:border-rose-300" },
  { title: "Teaching & Academics", slug: "teaching-academics",   icon: GraduationCap, color: "bg-teal-50   text-teal-600",   border: "hover:border-teal-300" },
];

export default function TopCategories() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      setSearchQuery((e as CustomEvent<string>).detail.toLowerCase());
    };
    window.addEventListener("categories-search", handler);

    const params = new URLSearchParams(window.location.search);
    const q = params.get("search");
    if (q) setSearchQuery(q.toLowerCase());

    return () => window.removeEventListener("categories-search", handler);
  }, []);

  const filtered = searchQuery
    ? categories.filter((c) => c.title.toLowerCase().includes(searchQuery))
    : categories;

  return (
    <section id="top-categories" className="bg-[#f8fafb] px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="mb-10 flex flex-col items-start">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            EXPLORE
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e2a55] relative inline-block">
            Top Categories
            <span className="absolute left-0 -bottom-1 w-16 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500 rounded" />
          </h2>
          <p className="mt-4 text-gray-500 text-sm">Browse our most popular learning categories</p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-base">
            No categories found for &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  href={`/categories/${cat.slug}`}
                  key={index}
                  prefetch={false}
                  className={`group flex flex-col items-start gap-3 bg-white px-5 py-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 no-underline ${cat.border}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.color} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-[#1ec28e] transition-colors">
                      {cat.title}
                    </span>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <span>Explore</span>
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
