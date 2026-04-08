"use client";

import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Users } from "lucide-react";

type Stat = {
  id: number;
  title: string;
  value: string;
  icon: React.ReactNode;
};

export default function StatsSection() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const stats: Stat[] = [
    {
      id: 1,
      title: "Enrolled Students",
      value: "80,000+",
      icon: <Users size={40} />,
    },
    {
      id: 2,
      title: "Online Courses",
      value: "1,200+",
      icon: <BookOpen size={40} />,
    },
    {
      id: 3,
      title: "Expert Instructors",
      value: "80,000+",
      icon: <GraduationCap size={40} />,
    },
  ];

  return (
    <section className="bg-[#f3f7f6] py-10 px-4 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">

        {stats.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 rounded-2xl bg-[#dfeceb] px-6 py-6 shadow-sm transition-all duration-700 hover:scale-[1.03] hover:shadow-md ${
              show
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* ICON */}
            <div className="text-primary">
              {item.icon}
            </div>

            {/* TEXT */}
            <div>
              <p className="text-sm text-gray-600">{item.title}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f766e]">
                {item.value}
              </h3>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}