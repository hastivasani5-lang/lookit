"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

type UpcomingClass = {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalImage: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  link: string;
  description: string;
};

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23e6f4ef'/%3E%3Ccircle cx='40' cy='30' r='18' fill='%2398b8ab'/%3E%3Crect x='14' y='54' width='52' height='30' rx='20' fill='%2398b8ab'/%3E%3C/svg%3E";

export default function UpcomingClasses() {
  const [classes, setClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetch("/api/upcoming-classes")
      .then((r) => r.json())
      .then((data: { classes?: UpcomingClass[] }) => setClasses(data.classes ?? []))
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <div className="mx-auto mb-16 max-w-7xl text-center lg:text-left">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">
            {/* LEFT */}
            <div className="w-full lg:w-1/2" data-aos="fade-right">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
                <span className="h-2 w-2 rounded-full bg-[#1ec28e]"></span>
                Upcoming Classes
              </div>
              <div className="mt-3 w-full h-px bg-gray-300"></div>
            </div>
            {/* RIGHT */}
            <div className="w-full lg:w-1/2" data-aos="fade-left">
              <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-right">
                Learn from the best <br />instructors in the industry
              </h2>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#1ec28e] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* No classes yet */}
        {!loading && classes.length === 0 && (
          <div className="py-16 text-gray-400 text-sm">No upcoming classes scheduled yet.</div>
        )}

        {/* Cards - Horizontal Auto-Scroll */}
        {!loading && classes.length > 0 && (
          <div className="overflow-hidden mt-16 pt-12 pb-8 group">
            <div
              className="flex gap-10 animate-marquee group-hover:paused-marquee"
              style={{ width: "max-content" }}
            >
              {[...classes, ...classes].map((cls, index) => (
                <div key={`${cls.id}-${index}`} className="relative flex justify-center">
                  {/* Background Shape */}
                  <div className="absolute w-48 h-48 bg-[#1ec28e]/20 rounded-3xl rotate-12 top-6" />
                  {/* Card */}
                  <div className="relative bg-white rounded-2xl shadow-lg p-6 w-72 text-center">
                    {/* Profile Image */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                      <Image
                        src={cls.professionalImage || PLACEHOLDER_SVG}
                        alt={cls.professionalName}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-white shadow-md object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_SVG;
                        }}
                      />
                    </div>
                    {/* Content */}
                    <div className="mt-12">
                      <h3 className="text-base font-bold text-gray-800 line-clamp-1">{cls.title}</h3>
                      <p className="text-sm text-[#1ec28e] font-semibold mt-1">{cls.professionalName}</p>
                      <div className="mt-3 space-y-1 text-xs text-gray-500">
                        <p>📅 {cls.date} &nbsp; ⏰ {cls.time}</p>
                        {cls.duration && <p>⏱ {cls.duration}</p>}
                        <p>📡 {cls.platform}</p>
                      </div>
                      {cls.description && (
                        <p className="text-gray-400 text-xs mt-2 line-clamp-2">{cls.description}</p>
                      )}
                      {cls.link && (
                        <a
                          href={cls.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block rounded-full bg-[#1ec28e] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#17a87a] transition"
                        >
                          Join Class
                        </a>
                      )}
                    </div>
                    {/* Bottom Icon */}
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow">
                      ⭐
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
