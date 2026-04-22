import React from "react";

export default function CourseListFilterSidebar() {
  return (
    <aside className="w-full max-w-[260px] bg-white rounded-2xl border border-[#dbe8e4] p-5">
      <div className="mb-6">
        <h4 className="font-bold mb-2">Categories</h4>
        {/* Add your categories filter here */}
        <div className="flex flex-col gap-1">
          {["Business", "Data Science", "IT", "Marketing", "Education", "Photography"].map(cat => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> {cat}
            </label>
          ))}
        </div>
        <button className="mt-2 text-xs text-primary underline">Show more</button>
      </div>
      <div className="mb-6">
        <h4 className="font-bold mb-2">Levels</h4>
        <div className="flex flex-col gap-1">
          {["Beginner", "Intermediate", "Advanced"].map(level => (
            <label key={level} className="flex items-center gap-2 text-sm">
              <input type="radio" name="level" /> {level}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-bold mb-2">Fees Range</h4>
        <input type="range" min={0} max={1000} className="w-full" />
        <div className="flex justify-between text-xs mt-1">
          <span>$200</span>
          <span>$500</span>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-bold mb-2">Type</h4>
        <div className="flex flex-col gap-1">
          {["Offline Classes", "Online Classes"].map(type => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input type="radio" name="type" /> {type}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-bold mb-2">Posted By</h4>
        <div className="flex flex-col gap-1">
          {["Others", "Institute", "Management"].map(by => (
            <label key={by} className="flex items-center gap-2 text-sm">
              <input type="radio" name="postedBy" /> {by}
            </label>
          ))}
        </div>
      </div>
      <button className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold">Apply Filter</button>
    </aside>
  );
}