import React from "react";

type CourseCardProps = {
  title: string;
  description: string;
  category: string;
  rating: number;
  price: number;
  tag?: string;
  students?: number;
  image?: string;
};

export default function CourseCard({ title, description, category, rating, price, tag, students, image }: CourseCardProps) {
  return (
    <div className="flex bg-white rounded-xl border p-4 gap-4 mb-4 shadow-sm">
      <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
        {image ? <img src={image} alt={title} className="w-full h-full object-cover" /> : <span className="text-2xl">📚</span>}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-base text-[#1e2a55]">{title}</span>
          {tag && <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-xs text-blue-700 font-medium">{tag}</span>}
        </div>
        <div className="text-xs text-gray-500 mb-1">{category} {students && <>· {students} students</>}</div>
        <div className="text-sm text-gray-700 mb-2">{description}</div>
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 font-bold">★ {rating}</span>
          <span className="text-primary font-bold">${price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}