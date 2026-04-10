"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categoryData = [
  {
    title: "UI/UX Design",
    description: "Design thinking, wireframing, and modern user interfaces.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 0 0 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
    ),
    meta: "📘 24 courses",
    rating: "⭐ 4.9",
    tag: "trending now",
    href: "/directory?search=UI%2FUX"
  },
  {
    title: "Web Development",
    description: "Frontend & backend from basics to advanced frameworks.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 16.98h.01M18 7.02h.01M6 7.02h.01M6 16.98h.01"/><path d="M2 12c0 5 2 7 7 7h6c5 0 7-2 7-7 0-5-2-7-7-7H9c-5 0-7 2-7 7Z"/></svg>
    ),
    meta: "🔥 42 lessons",
    rating: "⭐ 4.8",
    tag: "most popular",
    href: "/directory?search=Web%20Development"
  },
  {
    title: "Marketing",
    description: "Digital marketing, campaigns, growth & analytics.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polygon points="7 10 12 15 17 10 12 2 7 10"/><line x1="3" x2="21" y1="21" y2="21"/></svg>
    ),
    meta: "📊 18 workshops",
    rating: "⭐ 4.7",
    tag: "new courses",
    href: "/directory?search=Marketing"
  },
  {
    title: "Business",
    description: "Leadership, execution frameworks, strategy & scaling.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    ),
    meta: "📈 30+ cases",
    rating: "⭐ 4.9",
    tag: "certified",
    href: "/directory?search=Business"
  },
  {
    title: "Special Education",
    description: "Support-focused experts for practical learning outcomes.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
    ),
    meta: "🧩 12 specialists",
    rating: "⭐ 4.9",
    tag: "inclusive",
    href: "/directory?search=Special%20Education"
  },
  {
    title: "ADHD Support",
    description: "Expert guidance for focus, behavior, and routines.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z"/><path d="M12 6v6l4 2"/></svg>
    ),
    meta: "🧠 8 coaches",
    rating: "⭐ 4.8",
    tag: "top rated",
    href: "/directory?search=ADHD"
  },
  {
    title: "Language Learning",
    description: "English, regional & global language skill-building.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 8h14"/><path d="M12 2v4"/><path d="M12 22v-4"/><path d="M8 12H4"/><path d="M20 12h-4"/><path d="m17.66 6.34-2.83 2.83"/><path d="m9.17 14.83-2.83 2.83"/><path d="m14.83 14.83 2.83 2.83"/><path d="m6.34 6.34 2.83 2.83"/></svg>
    ),
    meta: "🌐 6 languages",
    rating: "⭐ 4.7",
    tag: "new",
    href: "/directory?search=Language"
  },
  {
    title: "Academic Courses",
    description: "Core subject coaching & skill-based course tracks.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    ),
    meta: "📚 50+ courses",
    rating: "⭐ 4.9",
    tag: "certified",
    href: "/directory?search=Courses"
  },
];

const filterChips = ["All", "Trending", "New", "Top rated"];

export default function CategoriesPage() {
  const [activeChip, setActiveChip] = useState("All");
  const [search, setSearch] = useState("");

  // Filter logic (demo: only All shows all)
  const filtered = categoryData.filter(cat => {
    if (activeChip === "All") return true;
    if (activeChip === "Trending") return cat.tag?.toLowerCase().includes("trending");
    if (activeChip === "New") return cat.tag?.toLowerCase().includes("new");
    if (activeChip === "Top rated") return cat.tag?.toLowerCase().includes("top");
    return true;
  }).filter(cat => cat.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef5f3] px-4 pb-20 pt-8 md:px-8 lg:px-12 font-sans">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="hero-neumorph mb-12 rounded-3xl p-6 md:p-10 transition-all">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#eef5f3] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2d6a4f] category-badge">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2d6a4f]"></span>
                  EXPLORE +300 TOPICS
                </div>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#0f2c21] md:text-6xl">
                  Discover <span className="text-[#2d6a4f]">Learning</span> <br className="hidden md:block"/>Categories
                </h1>
                <p className="mt-4 max-w-lg text-base text-[#3c6b58] md:text-lg">
                  Browse curated categories, connect with top experts, and accelerate your growth journey.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-2xl bg-[#2d6a4f] px-6 py-2.5 text-sm font-semibold text-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff] transition hover:bg-[#1f5942]">Browse All →</button>
                  <button className="rounded-2xl bg-[#eef5f3] px-6 py-2.5 text-sm font-semibold text-[#2d6a4f] shadow-[6px_6px_12px_#d0dbd6,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d0dbd6,inset_-4px_-4px_8px_#ffffff] transition">Popular now</button>
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="stat-card rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-[#2d6a4f]">150+</div>
                  <div className="text-xs font-medium text-[#446b5b]">Expert mentors</div>
                </div>
                <div className="stat-card rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-[#2d6a4f]">8.2k</div>
                  <div className="text-xs font-medium text-[#446b5b]">Active learners</div>
                </div>
                <div className="stat-card rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-[#2d6a4f]">32+</div>
                  <div className="text-xs font-medium text-[#446b5b]">Industries</div>
                </div>
                <div className="stat-card rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-[#2d6a4f]">98%</div>
                  <div className="text-xs font-medium text-[#446b5b]">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
          {/* Filter Chips & Search */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filterChips.map(chip => (
                <span
                  key={chip}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-md cursor-pointer transition ${activeChip === chip ? "bg-[#2d6a4f] text-white" : "bg-[#eef5f3] text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner"}`}
                  onClick={() => setActiveChip(chip)}
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                className="rounded-full bg-[#eef5f3] py-2 pl-10 pr-4 text-sm shadow-[inset_3px_3px_7px_#d0dbd6,inset_-3px_-3px_7px_#ffffff] outline-none w-48 md:w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-[#5b7c6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((cat, idx) => (
              <a
                key={cat.title}
                href={cat.href}
                className="neumorph-card group rounded-3xl p-6 transition-all duration-300 cursor-pointer"
                tabIndex={0}
                aria-label={`Explore ${cat.title}`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl neumorph-icon text-[#2d6a4f]">
                  {cat.icon}
                </div>
                <h2 className="text-xl font-bold text-[#0f2c21]">{cat.title}</h2>
                <p className="mt-2 text-sm text-[#446b5b]">{cat.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#2d6a4f]">
                  <span>{cat.meta}</span>
                  <span>{cat.rating}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#2d6a4f] group-hover:underline">Explore →</span>
                  <span className="text-[10px] text-[#5b7c6b]">{cat.tag}</span>
                </div>
              </a>
            ))}
          </div>
          {/* Why choose us section */}
          <div className="mt-20 rounded-3xl hero-neumorph p-6 md:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex rounded-full bg-[#eef5f3] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide category-badge text-[#2d6a4f]">⭐ premium ecosystem</div>
              <h2 className="mt-5 text-3xl font-bold text-[#0f2c21] md:text-4xl">Grow with industry experts</h2>
              <p className="mt-3 max-w-2xl text-[#3c6b58]">Join thousands of learners who accelerated their career using our expert-led categories.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button className="rounded-2xl bg-[#2d6a4f] px-8 py-3 font-semibold text-white shadow-xl hover:bg-[#1e5942] transition-all">Start Learning Today</button>
                <button className="rounded-2xl bg-[#eef5f3] px-8 py-3 font-semibold text-[#2d6a4f] shadow-[6px_6px_12px_#d0dbd6,-6px_-6px_12px_#ffffff] hover:shadow-inner transition">View All Categories</button>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          .neumorph-card {
            background: #eef5f3;
            box-shadow: 12px 12px 24px #d0dbd6, -12px -12px 24px #ffffff;
            transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
          }
          .neumorph-card:hover {
            box-shadow: 8px 8px 16px #d0dbd6, -8px -8px 16px #ffffff;
            transform: translateY(-4px);
          }
          .neumorph-icon {
            background: #eef5f3;
            box-shadow: inset 3px 3px 6px #d0dbd6, inset -3px -3px 6px #ffffff;
          }
          .hero-neumorph {
            background: #eef5f3;
            box-shadow: 20px 20px 40px #d0dbd6, -20px -20px 40px #ffffff;
          }
          .category-badge {
            background: #eef5f3;
            box-shadow: inset 1px 1px 3px #d0dbd6, inset -1px -1px 3px #ffffff;
          }
          .stat-card {
            background: #eef5f3;
            box-shadow: 8px 8px 16px #d0dbd6, -8px -8px 16px #ffffff;
            transition: all 0.2s;
          }
          .stat-card:hover {
            transform: scale(1.02);
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
