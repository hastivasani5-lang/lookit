"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Star, Award, UserCheck, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";

import type { PublicProfessional } from "@/lib/professional-display";

type Props = {
  professionals: PublicProfessional[];
  embedded?: boolean;
};

export default function TopRatedProfessionalsSection({ professionals, embedded = false }: Props) {
  const { data: session } = useSession();
  const studentId = session?.user?.id ?? null;
  const isStudent = session?.user?.role === "student";

  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  // Load followed professionals for this student
  useEffect(() => {
    if (!studentId) return;
    fetch(`/api/follows?studentId=${studentId}`)
      .then((r) => r.json())
      .then((data: Array<{ professionalId: string }>) => {
        if (Array.isArray(data)) {
          setFollowedIds(new Set(data.map((f) => f.professionalId)));
        }
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

  const trackRef = useRef<HTMLDivElement | null>(null);

  const topRatedProfessionals = useMemo(
    () => [...professionals].sort((left, right) => right.rating - left.rating || right.reviews - left.reviews),
    [professionals]
  );

  const scrollByCard = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-top-rated-card='true']");
    const cardWidth = card?.offsetWidth ?? 280;
    const gap = 20;
    const amount = cardWidth + gap;
    track.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || topRatedProfessionals.length === 0) return;
    const tick = window.setInterval(() => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      if (maxScrollLeft <= 0) return;
      if (track.scrollLeft >= maxScrollLeft - 2) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      scrollByCard("next");
    }, 2800);
    return () => window.clearInterval(tick);
  }, [topRatedProfessionals.length]);

  if (topRatedProfessionals.length === 0) return null;

  return (
    <section className={embedded ? "mb-8" : "px-4 pb-16 md:px-8 lg:px-10"}>
      <div className={`${embedded ? "w-full" : "mx-auto max-w-7xl"} rounded-3xl border border-[#dbe8e4] bg-white px-5 py-6 shadow-lg md:px-6 md:py-8`}>
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-emerald-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Award className="h-3 w-3" />
              <span>Top Rated</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Top Rated Experts
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Highest-rated professionals, handpicked for their excellence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard("prev")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm transition-all hover:scale-105 hover:shadow-md"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div ref={trackRef} className="hide-scrollbar flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-4">
          {topRatedProfessionals.map((item) => (
            <article
              key={item.id}
              data-top-rated-card="true"
              className="group relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:w-[300px]"
            >
              {/* Image container with overlay gradient */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 280px, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Rating badge on image */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-xs font-semibold text-amber-600 shadow-sm">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span className="text-gray-500">·</span>
                  <span>{item.reviews} reviews</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-emerald-600 line-clamp-1">{item.specialization}</p>

                <div className="mt-3 space-y-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-emerald-600">•</span>
                    </div>
                    <span className="text-xs">Language: {item.language}</span>
                  </div> 
                </div>

                <div className="mt-4 flex w-full gap-2">
                  <Link
                    href={`/professionals/${item.id}`}
                    className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-95"
                  >
                    View Profile
                  </Link>
                  {isStudent ? (
                    <button
                      type="button"
                      onClick={() => void handleFollow(item.id)}
                      disabled={followLoading === item.id}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 ${
                        followedIds.has(item.id)
                          ? "border-[#1ec28e] bg-[#effaf6] text-[#1ec28e] hover:border-red-400 hover:bg-red-50 hover:text-red-500"
                          : "border-primary bg-white text-primary hover:bg-[#e6f7f0]"
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
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition-all hover:scale-[1.02] hover:bg-[#e6f7f0] active:scale-95"
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
      </div>
    </section>
  );
}