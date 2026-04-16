import React, { useState } from "react";

const courses = [
  // 30 demo courses for pagination
  ...Array.from({ length: 30 }, (_, i) => {
    const base = [
      { title: "Business Management Classes", tag: "Popular", price: "$263.99", rating: 4.2, students: 60000, lectures: 120, location: "London", icon: "💼", badge: "Popular", reviews: 553 },
      { title: "Networking Classes", tag: "High Rated", price: "$745.00", oldPrice: "$880.00", rating: 5.0, students: 75000, lectures: 130, location: "New York", icon: "🌐", badge: "High Rated", reviews: 335 },
      { title: "Beautician Classes", tag: "Popular", price: "$149.00", rating: 4.3, students: 95000, lectures: 90, location: "Delhi", icon: "💄", badge: "Popular", reviews: 412 },
      { title: "Guitar Classes", tag: "", price: "$130.00", rating: 4.9, students: 80000, lectures: 100, location: "Los Angeles", icon: "🎸", badge: "", reviews: 278 },
      { title: "Photoshop Classes", tag: "Popular", price: "$42.00", rating: 5.0, students: 35235, lectures: 120, location: "London", icon: "🖼️", badge: "Popular", reviews: 198 },
      { title: "DataScience Classes", tag: "Best Seller", price: "$122.00", rating: 5.0, students: 120000, lectures: 70, location: "San Francisco", icon: "📚", badge: "Best Seller", reviews: 621 },
    ];
    return { ...base[i % base.length], title: base[i % base.length].title + ` ${i + 1}` };
  })
];

const PAGE_SIZE = 9;

export default function CourseList() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Fees:High-to-Low");
  const [view, setView] = useState("list");

  // Pagination logic
  const totalEntries = courses.length;
  const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalEntries);
  const paginatedCourses = courses.slice(startIdx, endIdx);

  return (
    <div className="flex-1 space-y-4">
      {/* Top Bar */}
      <div className="bg-[#f8f8fc] rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between border-2 border-[#ededf7] shadow mb-6">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="text-lg font-semibold text-dark">Sort By:</span>
          <select
            className="mt-1 px-2 py-2 rounded-xl border-1 border-[#009966]  bg-white text-dark font-medium focus:outline-none transition w-full md:w-64 shadow-sm"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="Fees:High-to-Low">Fees:High-to-Low</option>
            <option value="Fees:Low-to-High">Fees:Low-to-High</option>
            <option value="Rating:High-to-Low">Rating:High-to-Low</option>
            <option value="Rating:Low-to-High">Rating:Low-to-High</option>
          </select>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          <button
            type="button"
            className={`p-3 rounded-xl border-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#009966] ${view === "list" ? "bg-white border-[#009966] text-[#009966] shadow-md" : "bg-[#f8f8fc] border-[#ededf7] text-[#007a53]"}`}
            onClick={() => setView("list")}
            aria-label="List View"
            aria-pressed={view === "list"}
            style={{ minWidth: 46, minHeight: 46 }}
          >
            <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="9" width="16" height="2.5" rx="1" fill={view === "list" ? "#009966" : "#b3b6f7"}/><rect x="6" y="14" width="16" height="2.5" rx="1" fill={view === "list" ? "#009966" : "#b3b6f7"}/><rect x="6" y="19" width="16" height="2.5" rx="1" fill={view === "list" ? "#009966" : "#b3b6f7"}/></svg>
          </button>
          <button
            type="button"
            className={`p-3 rounded-xl border-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#009966] ${view === "grid" ? "bg-white border-[#009966] text-[#009966] shadow-md" : "bg-[#f8f8fc] border-[#ededf7] text-[#007a53]"}`}
            onClick={() => setView("grid")}
            aria-label="Grid View"
            aria-pressed={view === "grid"}
            style={{ minWidth: 46, minHeight: 46 }}
          >
            <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="5" height="5" rx="1" fill={view === "grid" ? "#009966" : "#b3b6f7"}/><rect x="17" y="6" width="5" height="5" rx="1" fill={view === "grid" ? "#009966" : "#b3b6f7"}/><rect x="6" y="17" width="5" height="5" rx="1" fill={view === "grid" ? "#009966" : "#b3b6f7"}/><rect x="17" y="17" width="5" height="5" rx="1" fill={view === "grid" ? "#009966" : "#b3b6f7"}/></svg>
          </button>
        </div>
      </div>

      {/* Course List */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-[#ededf7] shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              <div className="h-40 flex items-center justify-center bg-[#f6fcfa] relative">
                <span className="text-6xl">{course.icon}</span>
                {course.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs rounded bg-[#009966] text-white font-bold shadow">{course.badge}</span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="font-bold text-base text-[#1e2a55] mb-1">{course.title}</div>
                <div className="text-gray-500 text-sm mb-2">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...</div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                  <span>⭐ {course.rating} ({course.reviews})</span>
                  <span>🎓 {course.students} students</span>
                  <span>📚 {course.lectures} Lectures</span>
                  <span>📍 {course.location}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="font-bold text-[#009966] text-lg">
                    {course.price} {course.oldPrice && <span className="line-through text-gray-400 ml-2">{course.oldPrice}</span>}
                  </div>
                  <button className="bg-[#009966] hover:bg-[#007a53] text-white px-5 py-2 rounded-xl font-bold shadow border-2 border-[#009966] transition">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        paginatedCourses.map((course, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row bg-white rounded-2xl p-5 gap-4 items-center border-2 border-[#009966]/20 shadow-sm hover:shadow-lg transition mb-2"
          >
            <div className="text-5xl w-16 h-16 flex items-center justify-center rounded-xl bg-[#f6fcfa] border-2 border-[#009966]/20 mr-2">
              {course.icon}
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-bold text-lg text-[#1e2a55]">{course.title}</span>
                {course.badge && (
                  <span className="ml-2 px-2 py-1 text-xs rounded bg-[#e6efed] text-[#009966] font-bold border border-[#009966]/30">
                    {course.badge}
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-1">
                <span>⭐ {course.rating} ({course.reviews})</span>
                <span>🎓 {course.students} students</span>
                <span>📚 {course.lectures} Lectures</span>
                <span>📍 {course.location}</span>
              </div>
              <div className="font-bold text-[#009966] text-base">
                {course.price} {course.oldPrice && <span className="line-through text-gray-400 ml-2">{course.oldPrice}</span>}
              </div>
            </div>
            <div className="flex items-center justify-end w-full md:w-auto mt-4 md:mt-0">
              <button
                className="bg-[#009966] hover:bg-[#007a53] text-white px-6 py-2 rounded-xl font-bold shadow border-2 border-[#009966] transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="flex justify-end mt-4 pb-5">
        <nav className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded border ${page === i + 1 ? "bg-[#e6e8fa] border-[#b3b6f7] font-bold" : "bg-white border-[#ededf7]"}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          {page < totalPages && (
            <button
              className="px-3 py-1 rounded border bg-white border-[#ededf7]"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
