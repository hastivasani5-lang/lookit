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

const PAGE_SIZE = 10;

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
      <div className="bg-[#f8f8fc] rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-[#ededf7] mb-4">
        <div>
           <div className="text-[#23235f] mb-2 md:mb-0">Sort By:</div>
          <select
            className="mt-1 px-4 py-2 rounded border border-[#ededf7] bg-white text-[#23235f] focus:outline-none"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="Fees:High-to-Low">Fees:High-to-Low</option>
            <option value="Fees:Low-to-High">Fees:Low-to-High</option>
            <option value="Rating:High-to-Low">Rating:High-to-Low</option>
            <option value="Rating:Low-to-High">Rating:Low-to-High</option>
          </select>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            className={`p-2 rounded border ${view === "list" ? "bg-[#f4f6ff] border-[#b3b6f7] text-[#4f5bd5]" : "bg-white border-[#ededf7] text-[#23235f]"}`}
            onClick={() => setView("list")}
            aria-label="List View"
          >
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="16" height="2" rx="1" fill={view === "list" ? "#4f5bd5" : "#b3b6f7"}/><rect x="4" y="11" width="16" height="2" rx="1" fill={view === "list" ? "#4f5bd5" : "#b3b6f7"}/><rect x="4" y="16" width="16" height="2" rx="1" fill={view === "list" ? "#4f5bd5" : "#b3b6f7"}/></svg>
          </button>
          <button
            className={`p-2 rounded border ${view === "grid" ? "bg-[#f4f6ff] border-[#b3b6f7] text-[#4f5bd5]" : "bg-white border-[#ededf7] text-[#23235f]"}`}
            onClick={() => setView("grid")}
            aria-label="Grid View"
          >
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="6" height="6" rx="1" fill={view === "grid" ? "#4f5bd5" : "#b3b6f7"}/><rect x="14" y="4" width="6" height="6" rx="1" fill={view === "grid" ? "#4f5bd5" : "#b3b6f7"}/><rect x="4" y="14" width="6" height="6" rx="1" fill={view === "grid" ? "#4f5bd5" : "#b3b6f7"}/><rect x="14" y="14" width="6" height="6" rx="1" fill={view === "grid" ? "#4f5bd5" : "#b3b6f7"}/></svg>
          </button>
        </div>
      </div>

      {/* Course List */}
      {paginatedCourses.map((course, idx) => (
        <div key={idx} className="flex bg-[#f6faff] rounded-lg p-4 gap-4 items-center border border-gray-100 relative">
          <div className="text-5xl w-16 h-16 flex items-center justify-center rounded bg-white border mr-2">{course.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg text-[#1e2a55]">{course.title}</span>
              {course.badge && <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-bold">{course.badge}</span>}
            </div>
            <div className="text-gray-500 text-sm mb-1">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...</div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-1">
              <span>⭐ {course.rating} ({course.reviews})</span>
              <span>🎓 {course.students} students</span>
              <span>📚 {course.lectures} Lectures</span>
              <span>📍 {course.location}</span>
            </div>
            <div className="font-bold text-[#1e2a55] text-base">{course.price} {course.oldPrice && <span className="line-through text-gray-400 ml-2">{course.oldPrice}</span>}</div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-end mt-4 pb-12">
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
