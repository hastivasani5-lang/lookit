import React from "react";
import Link from "next/link";

interface Category {
  title: string;
  slug: string;
}

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  return (
    <div className="overflow-x-auto whitespace-nowrap py-4">
      <div className="flex gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="inline-block min-w-[200px] bg-[#f5f7fa] hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white transition rounded-lg px-6 py-4 text-center shadow border border-gray-200 font-medium text-lg"
          >
            {cat.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
