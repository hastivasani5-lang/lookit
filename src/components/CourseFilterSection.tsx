"use client";

export default function CourseFilterSection() {
  const categories = [
    "UI/UX Design",
    "Development",
    "Data Science",
    "Business",
    "Financial",
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#0f172a]">
        Filter <span className="text-primary">Courses</span>
      </h2>

      <div className="mt-5 space-y-3">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`w-full rounded-lg border px-4 py-2 text-left text-sm transition ${
              i === 0
                ? "bg-[#e6f7f1] text-primary border-primary"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}