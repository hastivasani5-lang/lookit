import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BookOpen, ShoppingBag, Sparkles, Star } from "lucide-react";

const shopItems = [
  {
    id: 1,
    title: "Parent Support Workbook",
    description: "Practical worksheets for weekly home routines and progress tracking.",
    price: "₹399",
    badge: "Best Seller",
  },
  {
    id: 2,
    title: "ADHD Learning Bundle",
    description: "Video lessons, templates, and action plans for focused support.",
    price: "₹699",
    badge: "Popular",
  },
  {
    id: 3,
    title: "Dyslexia Practice Kit",
    description: "Reading drills, phonics activities, and structured practice tools.",
    price: "₹549",
    badge: "New",
  },
  {
    id: 4,
    title: "Speech Therapy Flashcards",
    description: "Visual cards for articulation practice and language development.",
    price: "₹299",
    badge: "Top Rated",
  },
  {
    id: 5,
    title: "Expert Consultation Pass",
    description: "Book a one-on-one session with a verified professional.",
    price: "₹1,499",
    badge: "Live",
  },
  {
    id: 6,
    title: "School Support Toolkit",
    description: "Templates for teacher communication, observations, and planning.",
    price: "₹449",
    badge: "Featured",
  },
];

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef5f3] ">
        <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-4xl border border-[#d5e9e2] bg-white p-6 shadow-[0_22px_45px_rgba(15,23,42,0.07)] md:p-8">
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[#0f172a]/5 blur-2xl" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Shop
                </p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                  Learning tools, bundles, and expert support
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
                  Browse curated resources for parents, learners, and professionals. Each item is designed to
                  support practical learning and guided progress.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#dbe8e4] bg-[#f7fbfa] p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-primary">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">Products</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{shopItems.length}</p>
                    <p className="text-xs text-gray-500">Curated items</p>
                  </div>
                  <div className="rounded-2xl border border-[#dbe8e4] bg-[#f7fbfa] p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-primary">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">Resources</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">24/7</p>
                    <p className="text-xs text-gray-500">On-demand access</p>
                  </div>
                  <div className="rounded-2xl border border-[#dbe8e4] bg-[#f7fbfa] p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-primary">
                      <Star className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">Trusted</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">Top</p>
                    <p className="text-xs text-gray-500">Rated by users</p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-4xl border border-[#dbe8e4] bg-linear-to-br from-[#eaf8f3] via-white to-[#edf6f4] p-4 shadow-[0_16px_35px_rgba(15,23,42,0.08)]">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#0f172a]/5 blur-2xl" />
                <div className="relative space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Featured Bundle</p>
                  <h2 className="text-2xl font-bold text-gray-900">Start with a parent + learner pack</h2>
                  <p className="text-sm leading-7 text-gray-600">
                    A simple mix of worksheets, videos, and practical tools for home support.
                  </p>
                  <Link
                    href="/professionals"
                    className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
                  >
                    Explore Experts
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {shopItems.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[#dbe8e4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex rounded-full bg-[#eef7f4] px-3 py-1 text-xs font-semibold text-primary">
                      {item.badge}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-3 text-sm leading-7 text-gray-600">{item.description}</p>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-xl font-bold text-gray-900">{item.price}</p>
                  <Link
                    href="/contact"
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
                  >
                    Buy Now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
