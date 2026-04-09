import Link from "next/link";
import { BookOpen, Brain, Briefcase, Code2, HeartHandshake, Languages, Megaphone, PenTool } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type CategoryItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categories: CategoryItem[] = [
  {
    title: "UI/UX Design",
    description: "Design thinking, wireframing, and modern user interfaces.",
    href: "/directory?search=UI%2FUX",
    icon: PenTool,
  },
  {
    title: "Web Development",
    description: "Frontend and backend development from basics to advanced.",
    href: "/directory?search=Web%20Development",
    icon: Code2,
  },
  {
    title: "Marketing",
    description: "Digital marketing, performance campaigns, and growth strategy.",
    href: "/directory?search=Marketing",
    icon: Megaphone,
  },
  {
    title: "Business",
    description: "Business planning, leadership, and execution frameworks.",
    href: "/directory?search=Business",
    icon: Briefcase,
  },
  {
    title: "Special Education",
    description: "Support-focused experts for practical learning outcomes.",
    href: "/directory?search=Special%20Education",
    icon: HeartHandshake,
  },
  {
    title: "ADHD Support",
    description: "Expert guidance for focus, behavior, and child routines.",
    href: "/directory?search=ADHD",
    icon: Brain,
  },
  {
    title: "Language Learning",
    description: "English and regional language skill-building programs.",
    href: "/directory?search=Language",
    icon: Languages,
  },
  {
    title: "Academic Courses",
    description: "Core subject coaching and skill-based course tracks.",
    href: "/directory?search=Courses",
    icon: BookOpen,
  },
];

export default function CategoriesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#eef5f3] px-4 pb-12 pt-10 md:px-8 lg:px-12">
        <section className="mx-auto w-full max-w-7xl">
          <div className="mb-10 rounded-3xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Categories</p>
            <h1 className="mt-2 text-3xl font-bold text-[#0f172a] md:text-5xl">Explore Learning Categories</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
              Browse categories and quickly find experts and programs that match your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group rounded-2xl border border-[#dbe8e4] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ebf8f3] text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#0f172a]">{category.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{category.description}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-primary">Explore</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
