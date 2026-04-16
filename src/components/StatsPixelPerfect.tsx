"use client";

import { BookOpen, Globe, GraduationCap, Users } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const stats = [
  {
    id: "learners",
    label: "Total Learners",
    value: 2569,
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "graduates",
    label: "Total Graduates",
    value: 1765,
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: "countries",
    label: "Total Countries",
    value: 846,
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "courses",
    label: "Total Courses",
    value: 7253,
    icon: <BookOpen className="h-5 w-5" />,
  },
];


const animationDuration = 5000; // ms

const StatsPixelPerfect = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const start = performance.now();
    function animate(now: number) {
      const progress = Math.min((now - start) / animationDuration, 1);
      setCounts(stats.map((stat) => Math.floor(stat.value * progress)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="w-full bg-white py-10 px-2 sm:px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {stats.map((stat, i) => (
            <article key={stat.id} className="flex flex-col items-center justify-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.12)] transition-all duration-500">
                {stat.icon}
              </div>
              <h3 className="text-lg font-semibold leading-tight text-[#23254a] md:text-xl mb-1">{stat.label}</h3>
              <p className="text-2xl font-extrabold leading-none text-[#1d2240] md:text-3xl tracking-tight">
                {counts[i]}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsPixelPerfect;
