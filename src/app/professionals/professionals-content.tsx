"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, Search, SlidersHorizontal, Star, UserCheck, UserPlus, X } from "lucide-react";
import { useSession } from "next-auth/react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstructorBanner from "@/components/InstructorBanner";
import TopRatedProfessionalsSection from "@/components/TopRatedProfessionalsSection";
import type { PublicProfessional } from "@/lib/professional-display";

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

export default function ProfessionalsContent() {
  const { data: session } = useSession();
  const studentId = session?.user?.id ?? null;
  const isStudent = session?.user?.role === "student";

  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [liveProfessionals, setLiveProfessionals] = useState<PublicProfessional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [locationText, setLocationText] = useState(() => searchParams?.get("location")?.trim() ?? "");
  const [professionalQuery, setProfessionalQuery] = useState(() => searchParams?.get("search") ?? "");
  const [sortBy, setSortBy] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // followedIds: set of professionalIds this student follows
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState<string | null>(null); // professionalId being toggled

  // Load which professionals this student already follows
  useEffect(() => {
    if (!studentId) return;
    // Fetch all follows and filter by studentId client-side
    fetch("/api/follows?professionalId=all")
      .then((r) => r.json())
      .then(() => {
        // We can't get all follows by studentId from current API easily,
        // so we'll track locally via state only (optimistic)
      })
      .catch(() => undefined);
  }, [studentId]);

  const handleFollow = async (professionalId: string) => {
    if (!isStudent || !studentId) return;
    setFollowLoading(professionalId);
    const alreadyFollowing = followedIds.has(professionalId);
    try {
      if (alreadyFollowing) {
        await fetch("/api/follows", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, professionalId }),
        });
        setFollowedIds((prev) => { const s = new Set(prev); s.delete(professionalId); return s; });
      } else {
        await fetch("/api/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, professionalId }),
        });
        setFollowedIds((prev) => new Set([...prev, professionalId]));
      }
    } catch {
      // silently fail
    } finally {
      setFollowLoading(null);
    }
  };

  // Removed effect that synchronously set state from searchParams

  useEffect(() => {
    let isActive = true;

    const loadProfessionals = async () => {
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
      }
    };

    void loadProfessionals();

    return () => {
      isActive = false;
    };
  }, []);

  const professionals = useMemo(() => liveProfessionals, [liveProfessionals]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);
  const topUpgradedProfessionals = useMemo(() => {
    return professionals.filter((item) => {
      if (item.profileUpgradeTier !== "top" || !item.profileBoostedUntil) {
        return false;
      }
      const boostedUntil = new Date(item.profileBoostedUntil);
      if (Number.isNaN(boostedUntil.getTime())) {
        return false;
      }
      return boostedUntil.getTime() > now;
    });
  }, [professionals, now]);

  const filteredProfessionals = useMemo(() => {
    const result = professionals.filter((item) => {
      const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
      const ratingMatch = selectedRating === "all" || item.rating >= Number(selectedRating);
      const reviewsMatch = selectedReviews === "all" || item.reviews >= Number(selectedReviews);
      const languageMatch = selectedLanguage === "all" || item.language === selectedLanguage;
      const locationQuery = locationText.trim().toLowerCase();
      const locationMatch = locationQuery.length === 0 || item.location.toLowerCase().includes(locationQuery);
      const nameQuery = professionalQuery.trim().toLowerCase();
      const nameMatch =
        nameQuery.length === 0 ||
        item.name.toLowerCase().includes(nameQuery) ||
        item.specialization.toLowerCase().includes(nameQuery);

      return categoryMatch && ratingMatch && reviewsMatch && languageMatch && locationMatch && nameMatch;
    });

    return result.sort((left, right) => {
      if (sortBy === "rating") {
        return right.rating - left.rating;
      }

      return right.reviews - left.reviews;
    });
  }, [
    locationText,
    professionalQuery,
    professionals,
    selectedCategory,
    selectedLanguage,
    selectedRating,
    selectedReviews,
    sortBy,
  ]);

  const visibleProfessionals = filteredProfessionals.slice(0, visibleCount);

  const handleTopSearchClick = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!isFiltersOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFiltersOpen]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedRating("all");
    setSelectedReviews("all");
    setSelectedLanguage("all");
    setLocationText("");
    setProfessionalQuery("");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef5f3]">
        <InstructorBanner />

        <div className="mx-auto mt-5 w-full max-w-400 px-4 md:px-8 lg:px-6 xl:px-4">
          <div className="grid gap-3 rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm md:grid-cols-[190px_minmax(0,1fr)_220px_120px] md:items-end md:p-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-emerald-700">Category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full rounded-xl border border-emerald-200 bg-[#fafdfc] px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-emerald-400"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-emerald-700">Professionals Search</span>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-[#fafdfc] px-3 py-2">
                <Search className="h-4 w-4 text-emerald-500" />
                <input
                  type="text"
                  value={professionalQuery}
                  onChange={(event) => setProfessionalQuery(event.target.value)}
                  placeholder="Search by name or specialization"
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-emerald-700">Location Search</span>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-[#fafdfc] px-3 py-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <input
                  type="text"
                  value={locationText}
                  onChange={(event) => setLocationText(event.target.value)}
                  placeholder="Search city or area"
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
            </label>

            <div className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-transparent">Search</span>
              <button
                type="button"
                onClick={handleTopSearchClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        <section className="mx-auto w-full max-w-400 px-4 py-10 md:px-8 lg:px-6 xl:px-4">
          <TopRatedProfessionalsSection professionals={topUpgradedProfessionals} embedded />

          <div ref={resultsRef} className="grid gap-8 lg:grid-cols-[295px_minmax(0,1fr)] lg:items-start">
            <aside className="hidden self-start rounded-3xl border border-[#dbe8e4] bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:z-20 lg:block lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto hide-scrollbar">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Category</span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
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
                    onChange={(event) => setSelectedRating(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
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
                    onChange={(event) => setSelectedReviews(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
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
                    onChange={(event) => setSelectedLanguage(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Location</span>
                  <input
                    type="text"
                    value={locationText}
                    onChange={(event) => setLocationText(event.target.value)}
                    placeholder="Search city or area"
                    className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  />
                </label>
              </div>
            </aside>

            <div className="lg:pr-1">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#dbe8e4] bg-white p-3 shadow-sm lg:hidden">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Filters</p>
                  <p className="text-sm font-medium text-gray-800">Refine professionals</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>

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

                      <div className="mt-auto flex w-full gap-2">
                        <Link
                          href={`/professionals/${item.id}`}
                          className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold bg-linear-to-r from-emerald-600 to-teal-600 text-white transition"
                        >
                          View Profile
                        </Link>
                        {isStudent ? (
                          <button
                            type="button"
                            onClick={() => void handleFollow(item.id)}
                            disabled={followLoading === item.id}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                              followedIds.has(item.id)
                                ? "border-[#1ec28e] bg-[#effaf6] text-[#1ec28e] hover:border-red-400 hover:bg-red-50 hover:text-red-500"
                                : "border-primary bg-white text-primary hover:bg-[#e6f7f0] hover:border-[#18ab7d]"
                            }`}
                          >
                            {followLoading === item.id ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : followedIds.has(item.id) ? (
                              <UserCheck className="h-3.5 w-3.5" />
                            ) : (
                              <UserPlus className="h-3.5 w-3.5" />
                            )}
                            {followedIds.has(item.id) ? "Following" : "Follow"}
                          </button>
                        ) : (
                          <Link
                            href="/login"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-primary bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-[#e6f7f0]"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            Follow
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {visibleProfessionals.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                  No professionals match these filters.
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

          {isFiltersOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Professionals filters">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsFiltersOpen(false)}
                aria-label="Close filters"
              />

              <aside className="absolute right-0 top-0 h-full w-[88vw] max-w-88 overflow-y-auto bg-white p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setIsFiltersOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setIsFiltersOpen(false);
                  }}
                  className="mb-4 text-sm font-medium text-primary hover:underline"
                >
                  Clear All
                </button>

                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Category</span>
                    <select
                      value={selectedCategory}
                      onChange={(event) => setSelectedCategory(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
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
                      onChange={(event) => setSelectedRating(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
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
                      onChange={(event) => setSelectedReviews(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
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
                      onChange={(event) => setSelectedLanguage(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Location</span>
                    <input
                      type="text"
                      value={locationText}
                      onChange={(event) => setLocationText(event.target.value)}
                      placeholder="Search city or area"
                      className="w-full rounded-xl border border-gray-200 bg-[#fafdfc] px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFiltersOpen(false)}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Apply Filters
                </button>
              </aside>
            </div>
          ) : null}
        </section>
      </main>

      <section className="bg-[#eef5f3] pb-12">
        <div className="mx-auto w-full max-w-400 px-4 md:px-8 lg:px-6 xl:px-4">
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
