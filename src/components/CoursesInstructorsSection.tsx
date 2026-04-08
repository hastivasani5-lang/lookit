"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, User, BookOpen } from "lucide-react";

type Instructor = {
  id: number;
  name: string;
  role: string;
  image: string;
};

const instructors: Instructor[] = [
  { id: 1, name: "Dr. Aanya Mehta", role: "ADHD Specialist", image: "/pro1.jpeg" },
  { id: 2, name: "Ritika Sharma", role: "Speech Therapist", image: "/pro2.jpeg" },
  { id: 3, name: "Neha Kapoor", role: "Dyslexia Expert", image: "/pro3.jpeg" },
  { id: 4, name: "Sonal Iyer", role: "Autism Support Coach", image: "/pro4.jpeg" },
  { id: 5, name: "Mohit Verma", role: "Special Education Mentor", image: "/pro1.jpeg" },
  { id: 6, name: "Arjun Desai", role: "ADHD Behavior Coach", image: "/pro2.jpeg" },
];

const socials = ["ig", "f", "v", "tw"];

export default function CoursesInstructorsSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollByCard = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const card = track.querySelector<HTMLElement>("[data-instructor-card='true']");
    const cardWidth = card?.offsetWidth ?? 320;
    const gap = 20;
    const amount = cardWidth + gap;
    const delta = direction === "next" ? amount : -amount;
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScrollLeft - 1) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByCard("next");
      }
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="px-4 pb-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-md bg-[#dfeaec] px-4 py-10 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#2b2b2b] md:text-4xl">
            Our Instructors
          </h2>

          <div className="flex items-center gap-4 text-[#157e78]">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByCard("prev")}
              className="text-2xl leading-none transition hover:opacity-80"
            >
              <ArrowLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByCard("next")}
              className="rounded bg-[#c6e3e7] p-2 leading-none transition hover:bg-[#b6d8de]"
            >
              <ArrowRight size={22} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="hide-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {instructors.map((item) => (
            <article
              key={item.id}
              data-instructor-card="true"
              className="min-w-65 flex-1 overflow-hidden rounded-xl border border-[#dce3e6] bg-white shadow-[0_8px_20px_rgba(33,42,48,0.05)] sm:min-w-75 lg:min-w-80"
            >
              <div className="relative h-52 w-full bg-[#f2f4f5]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

              <div className="-mt-4 mb-2 flex justify-center gap-1.5">
                {socials.map((social) => (
                  <button
                    key={`${item.name}-${social}`}
                    type="button"
                    className="h-5 min-w-5 rounded-sm bg-white px-1 text-[10px] font-medium uppercase text-[#3a3f43] shadow"
                  >
                    {social}
                  </button>
                ))}
              </div>

              <div className="px-4 pb-4">
                <h3 className="text-base font-semibold text-[#2d3238]">{item.name}</h3>
                <p className="mt-0.5 text-xs text-[#7c858d]">{item.role}</p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f3] pt-3 text-[11px] text-[#95a1ab]">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    2006 Students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} />
                    12 Courses
                  </span>
                </div>

                <Link
                  href={`/professionals/${item.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
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
