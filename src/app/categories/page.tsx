import Link from "next/link";
import { Brain, Ear, HandHeart, Languages, Puzzle, Sparkles } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type CategoryCard = {
  slug: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  learners: string;
  sessions: string;
  outcome: string;
};

const categories: CategoryCard[] = [
  {
    slug: "adhd",
    title: "ADHD Support",
    icon: Brain,
    summary: "Attention planning, behavior coaching, and focus-building routines for daily school success.",
    learners: "1,280+ learners",
    sessions: "From 30 min/session",
    outcome: "Improved classroom engagement",
  },
  {
    slug: "dyslexia",
    title: "Dyslexia Support",
    icon: Languages,
    summary: "Structured reading intervention with phonics-based exercises and confidence-focused coaching.",
    learners: "940+ learners",
    sessions: "From 45 min/session",
    outcome: "Reading fluency progress",
  },
  {
    slug: "speech",
    title: "Speech Therapy",
    icon: Ear,
    summary: "Speech clarity, articulation practice, and language rhythm training with personalized plans.",
    learners: "760+ learners",
    sessions: "From 40 min/session",
    outcome: "Clear communication skills",
  },
  {
    slug: "autism",
    title: "Autism Support",
    icon: Puzzle,
    summary: "Social communication, sensory regulation, and caregiver collaboration for long-term growth.",
    learners: "620+ learners",
    sessions: "From 50 min/session",
    outcome: "Better social interaction",
  },
  {
    slug: "special-ed",
    title: "Special Education",
    icon: HandHeart,
    summary: "Individual learning plans aligned with school goals and measurable developmental milestones.",
    learners: "1,040+ learners",
    sessions: "From 35 min/session",
    outcome: "Consistent academic support",
  },
  {
    slug: "mixed-needs",
    title: "Multi-Needs Coaching",
    icon: Sparkles,
    summary: "Combined category support for learners needing integrated therapy and academic mentoring.",
    learners: "510+ learners",
    sessions: "Custom session plans",
    outcome: "Holistic progress tracking",
  },
];

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#f5fbf8_0%,#ecf6f1_100%)] px-4 pb-14 pt-28 md:px-8 lg:px-10">
        <section className="mx-auto w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-[34px] border border-[#d7e9e1] bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] md:p-10">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-950/5 blur-2xl" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#ebf8f3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#178761]">
                Learning Paths
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                Explore Categories Built for Real Learning Needs
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Find focused support programs for ADHD, Dyslexia, Speech Therapy, Autism,
                and Special Education. Each category is connected with verified professionals,
                clear outcomes, and flexible session plans.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/professionals"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
                >
                  Find Professionals
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Talk to Advisor
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.slug}
                  className="flex h-full flex-col rounded-3xl border border-[#d9e8e2] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf8f2] text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>

                  <div className="mt-4 space-y-2 rounded-2xl bg-[#f6fbf8] p-3 text-xs text-slate-600">
                    <p>{item.learners}</p>
                    <p>{item.sessions}</p>
                    <p className="font-medium text-slate-700">Outcome: {item.outcome}</p>
                  </div>

                  <Link
                    href={`/professionals?category=${item.slug}`}
                    className="mt-5 inline-flex items-center justify-center rounded-full border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    View Experts
                  </Link>
                </article>
              );
            })}
          </div>

          <section className="mt-10 rounded-3xl border border-[#d9e8e2] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">How Category Matching Works</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "1. Select Need",
                  text: "Choose a learning category and quickly understand the type of support offered.",
                },
                {
                  title: "2. Compare Experts",
                  text: "Review specialists by experience, ratings, language, and student outcomes.",
                },
                {
                  title: "3. Start Plan",
                  text: "Book sessions and track progress with a structured and measurable support plan.",
                },
              ].map((step) => (
                <div key={step.title} className="rounded-2xl bg-[#f4faf7] p-4">
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
