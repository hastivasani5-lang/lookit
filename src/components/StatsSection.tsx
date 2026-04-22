"use client";

import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Users, Star } from "lucide-react";

const stats = [
  { icon: Users,         value: "80,000+",  label: "Enrolled Students",   color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: BookOpen,      value: "1,200+",   label: "Online Courses",       color: "text-blue-600",    bg: "bg-blue-50" },
  { icon: GraduationCap, value: "500+",     label: "Expert Instructors",   color: "text-purple-600",  bg: "bg-purple-50" },
  { icon: Star,          value: "4.8 / 5",  label: "Average Rating",       color: "text-amber-600",   bg: "bg-amber-50" },
];

export default function StatsSection() {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  return (
    <section className="bg-white py-8 px-4 md:px-10 lg:px-16 border-b border-gray-100">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i}
              className={`flex items-center gap-4 rounded-2xl bg-white border border-gray-100 px-5 py-5 shadow-sm hover:shadow-md transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 100}ms` }}>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
