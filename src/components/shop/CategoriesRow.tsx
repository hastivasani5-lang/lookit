"use client";
import { Briefcase, Code, Globe, Megaphone, DollarSign, PenTool, Camera, FileText } from "lucide-react";

const categories = [
  { icon: <FileText className="w-6 h-6 mx-auto" />,    label: "All Categories" },
  { icon: <Briefcase className="w-6 h-6 mx-auto" />,   label: "Business" },
  { icon: <Code className="w-6 h-6 mx-auto" />,        label: "Development" },
  { icon: <Globe className="w-6 h-6 mx-auto" />,       label: "Language" },
  { icon: <Megaphone className="w-6 h-6 mx-auto" />,   label: "Marketing" },
  { icon: <DollarSign className="w-6 h-6 mx-auto" />,  label: "Finance" },
  { icon: <PenTool className="w-6 h-6 mx-auto" />,     label: "Design" },
  { icon: <Camera className="w-6 h-6 mx-auto" />,      label: "Photography" },
  { icon: <FileText className="w-6 h-6 mx-auto" />,    label: "Office" },
];

export default function CategoriesRow() {
  return (
    <section className="w-full py-6 px-4 bg-white rounded-2xl flex flex-wrap justify-center gap-6 mb-12">
      {categories.map((cat, idx) => (
        <div key={idx} className="flex flex-col items-center text-gray-700 min-w-[90px]">
          <div className="bg-[#eef5f3] rounded-full p-3 mb-2">{cat.icon}</div>
          <span className="text-xs font-semibold">{cat.label}</span>
        </div>
      ))}
    </section>
  );
}