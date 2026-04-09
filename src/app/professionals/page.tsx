"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MapPin, Search, Sparkles, Star } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildSeedProfessional, type PublicProfessional } from "@/lib/professional-display";
import { professionals as seedProfessionals } from "@/app/professionals/data";

const categoryOptions = [
  { label: "All Categories", value: "all" },
  { label: "ADHD", value: "adhd" },
  { label: "Dyslexia", value: "dyslexia" },
  { label: "Speech Therapy", value: "speech" },
  { label: "Autism Support", value: "autism" },
  { label: "Special Education", value: "special-ed" },
] as const;

const ratingOptions = [
  { label: "All Ratings", value: "all" },
  { label: "4.5+", value: "4.5" },
  { label: "4.8+", value: "4.8" },
] as const;

const reviewOptions = [
  { label: "All Reviews", value: "all" },
  { label: "200+", value: "200" },
  { label: "400+", value: "400" },
  { label: "600+", value: "600" },
] as const;

const languageOptions = [
  { label: "All Languages", value: "all" },
  { label: "English", value: "English" },
  { label: "Hindi", value: "Hindi" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Bengali", value: "Bengali" },
  { label: "Tamil", value: "Tamil" },
] as const;

export default function ProfessionalsPage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [liveProfessionals, setLiveProfessionals] = useState<PublicProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const query = searchParams.get("search")?.trim() || "";
    if (query) {
      setSearchText(query);
      setVisibleCount(6);
    }
  }, [searchParams]);

  const canUseSearch = status === "authenticated" && session?.user?.role === "student";

  useEffect(() => {
    let isActive = true;

    const loadProfessionals = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/professionals", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as {
          professionals?: PublicProfessional[];
        };

        if (!isActive) {
          return;
        }

        if (!response.ok) {
          setLiveProfessionals([]);
          return;
        }

        setLiveProfessionals(Array.isArray(payload.professionals) ? payload.professionals : []);
      } catch {
        if (isActive) {
          setLiveProfessionals([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProfessionals();

    return () => {
      isActive = false;
    };
  }, []);

  const professionals = useMemo(
    () => [...liveProfessionals, ...seedProfessionals.map(buildSeedProfessional)],
    [liveProfessionals],
  );

  const filteredProfessionals = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    const result = professionals.filter((item) => {
      const categoryMatch =
        selectedCategory === "all" || item.category === selectedCategory;

      const ratingMatch =
        selectedRating === "all" || item.rating >= Number(selectedRating);

      const reviewsMatch =
        selectedReviews === "all" || item.reviews >= Number(selectedReviews);

      const languageMatch =
        selectedLanguage === "all" || item.language === selectedLanguage;

      const searchMatch =
        query.length === 0 ||
        item.name.toLowerCase().includes(query) ||
        item.specialization.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      return categoryMatch && ratingMatch && reviewsMatch && languageMatch && searchMatch;
    });

    return result.sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return b.reviews - a.reviews;
    });
  }, [searchText, selectedCategory, selectedLanguage, selectedRating, selectedReviews, sortBy]);

  const visibleProfessionals = filteredProfessionals.slice(0, visibleCount);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#edf4f2] px-4 pb-14 pt-28 md:px-8 lg:px-10" />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#edf4f2] px-4 pb-14 pt-28 md:px-8 lg:px-10">
        <section className="mx-auto w-full max-w-7xl">
          <div
            className="relative mb-8 overflow-hidden rounded-4xl border border-[#d5e9e2] bg-white p-6 shadow-[0_22px_45px_rgba(15,23,42,0.07)] md:p-8"
            data-aos="fade-up"
          >
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[#0f172a]/5 blur-2xl" />

            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Professionals
                </p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                  Find Trusted Education Experts
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
                  Compare verified specialists by category, ratings, reviews, and language.
                  Choose the right expert for your child with confidence.
                </p>
              </div>

              <div className="grid min-w-60 grid-cols-2 gap-3 rounded-2xl bg-[#f7fbfa] p-3 text-center text-sm">
                <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
                  <p className="text-lg font-bold text-gray-900">{professionals.length}</p>
                  <p className="text-xs text-gray-500">Experts</p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
                  <p className="text-lg font-bold text-gray-900">{filteredProfessionals.length}</p>
                  <p className="text-xs text-gray-500">Matches</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-[#dbe8e4] bg-white p-4 shadow-sm" data-aos="fade-up">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchText}
                disabled={!canUseSearch}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by name, specialization, or city"
                className="w-full rounded-xl border border-gray-200 bg-[#f8fbfa] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>

          <div className="grid gap-8 lg:grid-cols-[295px_minmax(0,1fr)] lg:items-start">
            <aside className="self-start rounded-3xl border border-[#dbe8e4] bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:z-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto hide-scrollbar">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  type="button"
                  disabled={!canUseSearch}
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedRating("all");
                    setSelectedReviews("all");
                    setSelectedLanguage("all");
                    setSearchText("");
                  }}
                  className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Category</span>
                  <select
                    value={selectedCategory}
                    disabled={!canUseSearch}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Rating</span>
                  <select
                    value={selectedRating}
                    disabled={!canUseSearch}
                    onChange={(event) => setSelectedRating(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {ratingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Reviews</span>
                  <select
                    value={selectedReviews}
                    disabled={!canUseSearch}
                    onChange={(event) => setSelectedReviews(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Language</span>
                  <select
                    value={selectedLanguage}
                    disabled={!canUseSearch}
                    onChange={(event) => setSelectedLanguage(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </aside>

            <div className="lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto hide-scrollbar lg:pr-1">
              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#dbe8e4] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between" data-aos="fade-up">
                <p className="text-sm font-medium text-gray-700">
                  Showing <span className="font-semibold text-gray-900">{filteredProfessionals.length}</span> professionals
                </p>

                <div className="flex items-center gap-2">
                  <label htmlFor="sortBy" className="text-sm text-gray-600">
                    Sort:
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2 text-sm outline-none transition focus:border-primary"
                  >
                    <option value="popular">Popular</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProfessionals.map((item) => (
                  <article
                    key={item.id}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#dbe8e4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.13)]"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col space-y-3 p-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm font-medium text-primary">{item.specialization}</p>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold text-gray-900">{item.rating.toFixed(1)}</span>
                          <span>({item.reviews} reviews)</span>
                        </div>
                        <p className="inline-flex rounded-full bg-[#eef7f4] px-2.5 py-1 text-xs text-gray-700">
                          Language: {item.language}
                        </p>
                      </div>

                      <Link
                        href={`/professionals/${item.id}`}
                        className="mt-auto block w-full rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
                      >
                        View Profile
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {visibleProfessionals.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                  {loading ? "Loading professionals..." : "No professionals match these filters."}
                </div>
              ) : null}

              {visibleCount < filteredProfessionals.length ? (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                    className="rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    Load More
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <section className="bg-[#edf4f2] px-4 pb-12 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#cfe7df] bg-linear-to-r from-[#e9faf4] via-[#f4fffb] to-[#ecf7f4] p-6 shadow-sm md:p-8">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#0f172a]/5 blur-2xl" />

            <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Need Expert Guidance?</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                  Book a one-on-one consultation with top professionals
                </h2>
                <p className="mt-2 text-sm text-gray-600 md:text-base">
                  Get personalized advice and a step-by-step support plan for your child.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
