"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Star } from "lucide-react";

import type { PublicProfessional } from "@/lib/professional-display";

type Props = {
  professionals: PublicProfessional[];
};

export default function TopRatedProfessionalsSection({ professionals }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const topRatedProfessionals = useMemo(
    () => [...professionals].sort((left, right) => right.rating - left.rating || right.reviews - left.reviews),
    [professionals]
  );

  const scrollByCard = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const card = track.querySelector<HTMLElement>("[data-top-rated-card='true']");
    const cardWidth = card?.offsetWidth ?? 280;
    const gap = 20;
    const amount = cardWidth + gap;
    track.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || topRatedProfessionals.length === 0) {
      return;
    }

    const tick = window.setInterval(() => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;

      if (maxScrollLeft <= 0) {
        return;
      }

      if (track.scrollLeft >= maxScrollLeft - 2) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      scrollByCard("next");
    }, 2800);

    return () => window.clearInterval(tick);
  }, [topRatedProfessionals.length]);

  if (topRatedProfessionals.length === 0) {
    return null;
  }

  return (
    <section className="px-4 pb-16 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-4xl border border-[#dbe8e4] bg-white px-5 py-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] md:px-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Top Rated</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">Top Rated Experts</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-600">
              Highest-rated professionals are shown first and auto-scroll continuously so users can browse without manual swiping.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard("prev")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe8e4] bg-white text-gray-700 transition hover:bg-[#f4faf7]"
              aria-label="Previous top rated experts"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe8e4] bg-primary text-white transition hover:bg-[#18ab7d]"
              aria-label="Next top rated experts"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={trackRef} className="hide-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2">
          {topRatedProfessionals.map((item) => (
            <article
              key={item.id}
              data-top-rated-card="true"
              className="flex min-w-65 flex-col overflow-hidden rounded-3xl border border-[#dbe8e4] bg-[#fbfdfc] shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(15,23,42,0.12)] sm:min-w-75"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 85vw, 300px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  Top Rated
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{item.specialization}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold text-gray-900">{item.rating.toFixed(1)}</span>
                    <span>({item.reviews} reviews)</span>
                  </div>
                  <p className="inline-flex rounded-full bg-[#eef7f4] px-3 py-1 text-xs text-gray-700">
                    Language: {item.language}
                  </p>
                </div>

                <Link
                  href={`/professionals/${item.id}`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
                >
                  View Profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
