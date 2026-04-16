import React from "react";

export default function FilterSidebar() {
  return (
    <aside className="w-full md:w-72 bg-white rounded-2xl p-6 border-2 border-[#009966]/30 shadow-lg space-y-8">
      {/* Categories */}
      <div>
        <div className="font-bold text-lg mb-3 text-[#009966]">Categories</div>
        <ul className="space-y-2">
          {['Business', 'IT & Science', 'Art & Design', 'Music', 'Show more'].map((cat) => (
            <li key={cat}>
              <label className="flex items-center gap-2 cursor-pointer group p-2 rounded-lg border border-transparent hover:border-[#009966] transition">
                <input type="checkbox" className="accent-[#009966] w-4 h-4 rounded border-[#009966] focus:ring-2 focus:ring-[#009966]" />
                <span className="text-gray-700 group-hover:text-[#009966] transition font-medium">{cat}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <hr className="border-[#009966]/10" />
      {/* Levels */}
      <div>
        <div className="font-bold text-lg mb-3 text-[#009966]">Levels</div>
        <ul className="space-y-2">
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <li key={level}>
              <label className="flex items-center gap-2 cursor-pointer group p-2 rounded-lg border border-transparent hover:border-[#009966] transition">
                <input type="checkbox" className="accent-[#009966] w-4 h-4 rounded border-[#009966] focus:ring-2 focus:ring-[#009966]" />
                <span className="text-gray-700 group-hover:text-[#009966] transition font-medium">{level}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <hr className="border-[#009966]/10" />
      {/* Fees Range */}
      <div>
        <div className="font-bold text-lg mb-3 text-[#009966]">Fees Range</div>
        <div className="flex items-center gap-3 px-2 py-3 rounded-lg border-2 border-[#009966]/30 bg-[#f6fcfa]">
          <span className="text-xs text-[#009966] font-semibold">$20</span>
          <input type="range" min="20" max="500" className="flex-1 accent-[#009966]" />
          <span className="text-xs text-[#009966] font-semibold">$500</span>
        </div>
      </div>
      <hr className="border-[#009966]/10" />
      {/* Type */}
      <div>
        <div className="font-bold text-lg mb-3 text-[#009966]">Type</div>
        <ul className="space-y-2">
          {['Online Classes', 'Offline Classes'].map((type) => (
            <li key={type}>
              <label className="flex items-center gap-2 cursor-pointer group p-2 rounded-lg border border-transparent hover:border-[#009966] transition">
                <input type="checkbox" className="accent-[#009966] w-4 h-4 rounded border-[#009966] focus:ring-2 focus:ring-[#009966]" />
                <span className="text-gray-700 group-hover:text-[#009966] transition font-medium">{type}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <hr className="border-[#009966]/10" />
      {/* Posted By */}
      <div>
        <div className="font-bold text-lg mb-3 text-[#009966]">Posted By</div>
        <ul className="space-y-2">
          {['Others', 'Institute', 'Management'].map((by) => (
            <li key={by}>
              <label className="flex items-center gap-2 cursor-pointer group p-2 rounded-lg border border-transparent hover:border-[#009966] transition">
                <input type="checkbox" className="accent-[#009966] w-4 h-4 rounded border-[#009966] focus:ring-2 focus:ring-[#009966]" />
                <span className="text-gray-700 group-hover:text-[#009966] transition font-medium">{by}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button className="w-full bg-[#009966] hover:bg-[#007a53] text-white py-3 rounded-xl font-bold shadow-lg border-2 border-[#009966] transition mt-2">Apply Filter</button>
    </aside>
  );
}
