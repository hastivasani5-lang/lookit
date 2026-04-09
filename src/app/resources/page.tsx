"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenText, FileText, Search, Sparkles, Video } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ResourceType = "all" | "article" | "video" | "worksheet" | "toolkit";

type ResourceItem = {
  id: string;
  type: Exclude<ResourceType, "all">;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  cta: string;
  href: string;
};

const resources: ResourceItem[] = [
  {
    id: "res-1",
    type: "article",
    title: "Daily Focus Routines for ADHD Learners",
    description: "A practical structure for home and school routines that improves attention consistency.",
    duration: "7 min read",
    level: "Beginner",
    cta: "Read Article",
    href: "/blog",
  },
  {
    id: "res-2",
    type: "video",
    title: "Speech Clarity Exercises Parents Can Use",
    description: "Guided at-home exercises to support articulation and confidence in communication.",
    duration: "14 min watch",
    level: "Beginner",
    cta: "Watch Video",
    href: "/directory",
  },
  {
    id: "res-3",
    type: "worksheet",
    title: "Reading Fluency Tracker for Dyslexia",
    description: "Weekly worksheet template for measurable reading progress and milestone notes.",
    duration: "Download PDF",
    level: "Intermediate",
    cta: "Download",
    href: "/contact",
  },
  {
    id: "res-4",
    type: "toolkit",
    title: "Autism Classroom Adaptation Toolkit",
    description: "Structured toolkit with sensory break plans, routine cards, and communication prompts.",
    duration: "Toolkit pack",
    level: "Advanced",
    cta: "Get Toolkit",
    href: "/contact",
  },
  {
    id: "res-5",
    type: "article",
    title: "How to Pick the Right Learning Specialist",
    description: "A checklist for comparing professional profiles, goals, and session approach.",
    duration: "9 min read",
    level: "Beginner",
    cta: "Read Guide",
    href: "/professionals",
  },
  {
    id: "res-6",
    type: "video",
    title: "Progress Review: Parent + Professional Meeting Format",
    description: "A monthly review framework to align school goals, therapy plans, and outcomes.",
    duration: "18 min watch",
    level: "Intermediate",
    cta: "Watch Session",
    href: "/professionals",
  },
];

const tabs: Array<{ label: string; value: ResourceType }> = [
  { label: "All", value: "all" },
  { label: "Articles", value: "article" },
  { label: "Videos", value: "video" },
  { label: "Worksheets", value: "worksheet" },
  { label: "Toolkits", value: "toolkit" },
];

function getTypeIcon(type: ResourceItem["type"]) {
  switch (type) {
    case "article":
      return FileText;
    case "video":
      return Video;
    case "worksheet":
      return BookOpenText;
    case "toolkit":
      return Sparkles;
    default:
      return FileText;
  }
}

export default function ResourcesPage() {
  const [activeType, setActiveType] = useState<ResourceType>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return resources.filter((item) => {
      const typeMatch = activeType === "all" || item.type === activeType;
      const searchMatch =
        normalized.length === 0 ||
        item.title.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized);

      return typeMatch && searchMatch;
    });
  }, [activeType, query]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbf9_0%,#edf6f2_100%)] px-4 pb-14 pt-28 md:px-8 lg:px-10">
        <section className="mx-auto w-full max-w-7xl">
          <div className="rounded-[34px] border border-[#d8e9e2] bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] md:p-10">
            <p className="inline-flex rounded-full bg-[#ecf9f3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#177f5d]">
              Resource Hub
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              Practical Learning Resources for Students, Parents, and Professionals
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Browse curated articles, videos, worksheets, and toolkits. Use filters to quickly
              find the right format for your current learning goal.
            </p>

            <div className="mt-7 rounded-2xl border border-[#dce9e4] bg-[#f8fcfa] p-3">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resources by title or topic"
                  className="w-full rounded-xl border border-[#d5e6de] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
                />
              </label>

              <div className="mt-3 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveType(tab.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeType === tab.value
                        ? "bg-primary text-white"
                        : "bg-white text-slate-600 border border-[#d7e7e0] hover:bg-[#f3faf7]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const Icon = getTypeIcon(item.type);

              return (
                <article
                  key={item.id}
                  className="flex h-full flex-col rounded-3xl border border-[#dae9e3] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ebf8f3] text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="rounded-full bg-[#f1f7f4] px-2.5 py-1 font-semibold uppercase tracking-wide text-slate-600">
                      {item.type}
                    </span>
                    <span className="text-slate-500">{item.level}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">{item.duration}</p>

                  <Link
                    href={item.href}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
                  >
                    {item.cta}
                  </Link>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
              No resources found for this filter. Try another keyword or select "All".
            </div>
          ) : null}

          <section className="mt-10 rounded-3xl border border-[#d8e8e1] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Need a Personalized Resource Plan?</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Share your learner goals and we will recommend the right resources and professionals
              for your next 30 days of progress.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
              >
                Request Resource Plan
              </Link>
              <Link
                href="/professionals"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Browse Professionals
              </Link>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
