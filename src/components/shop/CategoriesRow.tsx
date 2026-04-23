"use client";

import { useState } from "react";
import { Briefcase, Code, Globe, Megaphone, DollarSign, PenTool, Camera, FileText, LayoutGrid } from "lucide-react";

const categories = [
  { icon: LayoutGrid,  label: "All" },
  { icon: Briefcase,   label: "Business" },
  { icon: Code,        label: "Development" },
  { icon: Globe,       label: "Language" },
  { icon: Megaphone,   label: "Marketing" },
  { icon: DollarSign,  label: "Finance" },
  { icon: PenTool,     label: "Design" },
  { icon: Camera,      label: "Photography" },
  { icon: FileText,    label: "Office" },
];

export default function CategoriesRow() {
  const [active, setActive] = useState("All");

  return (
    <section className="w-full py-5 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.label;
          return (
            <button key={cat.label} type="button" onClick={() => setActive(cat.label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#1ec28e] text-white shadow-md"
                  : "bg-gray-50 text-gray-600 hover:bg-[#effaf6] hover:text-[#1ec28e] border border-gray-100"
              }`}>
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
