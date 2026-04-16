import React from "react";

export default function FilterSidebar() {
  return (
    <aside className="w-full md:w-72 bg-white rounded-lg p-4 border border-gray-100 space-y-6">
      <div>
        <div className="font-semibold mb-2">Categories</div>
        <div className="flex flex-col gap-1">
          <label><input type="checkbox" /> Business</label>
          <label><input type="checkbox" /> IT & Science</label>
          <label><input type="checkbox" /> Art & Design</label>
          <label><input type="checkbox" /> Music</label>
          <label><input type="checkbox" /> Show more</label>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Levels</div>
        <div className="flex flex-col gap-1">
          <label><input type="checkbox" /> Beginner</label>
          <label><input type="checkbox" /> Intermediate</label>
          <label><input type="checkbox" /> Advanced</label>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Fees Range</div>
        <div className="flex items-center gap-2">
          <span className="text-xs">$20</span>
          <input type="range" min="20" max="500" className="flex-1" />
          <span className="text-xs">$500</span>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Type</div>
        <div className="flex flex-col gap-1">
          <label><input type="checkbox" /> Online Classes</label>
          <label><input type="checkbox" /> Offline Classes</label>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Posted By</div>
        <div className="flex flex-col gap-1">
          <label><input type="checkbox" /> Others</label>
          <label><input type="checkbox" /> Institute</label>
          <label><input type="checkbox" /> Management</label>
        </div>
      </div>
      <button className="w-full bg-[#5a67ff] text-white py-2 rounded font-semibold mt-2">Apply Filter</button>
    </aside>
  );
}
