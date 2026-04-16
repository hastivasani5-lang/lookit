import React from "react";

export default function CategoryBanner() {
  return (
    <div className="w-full bg-[#e6efed] py-12 px-4 flex flex-col items-center justify-center relative">
       <form className="flex flex-col md:flex-row gap-2 md:gap-4 w-full max-w-5xl mb-6 bg-white rounded-xl p-4 shadow border border-[#d1f5e0] items-center" style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.03)'}}>
        {/* Category */}
        <div className="flex flex-col items-start flex-1 min-w-[180px] mx-1">
          <label className="text-xs font-bold text-[#009966] mb-1 tracking-wider">CATEGORY</label>
          <div className="flex items-center w-full">
            <select className="w-full px-4 py-2 rounded-lg border border-[#aee9ce] bg-white text-[#222] font-semibold focus:outline-none">
              <option>All Categories</option>
              <option>Business</option>
              <option>IT & Science</option>
              <option>Art & Design</option>
              <option>Music</option>
            </select>
          </div>
        </div>
        {/* Professionals Search */}
        <div className="flex flex-col items-start flex-[2] min-w-[260px] mx-1">
          <label className="text-xs font-bold text-[#009966] mb-1 tracking-wider">PROFESSIONALS SEARCH</label>
          <div className="flex items-center w-full border border-[#aee9ce] rounded-lg bg-[#fafefd] px-3">
            <svg className="w-5 h-5 text-[#00b386] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search by name or specialization" className="flex-1 px-2 py-2 bg-transparent outline-none text-[#222]" />
          </div>
        </div>
        {/* Location Search */}
        <div className="flex flex-col items-start flex-1 min-w-[180px] mx-1">
          <label className="text-xs font-bold text-[#009966] mb-1 tracking-wider">LOCATION SEARCH</label>
          <div className="flex items-center w-full border border-[#aee9ce] rounded-lg bg-[#fafefd] px-3">
            <svg className="w-5 h-5 text-[#00b386] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.54 6.36l-1.42-1.42M6.34 6.34L4.92 4.92m12.02 0l-1.42 1.42M6.34 17.66l-1.42 1.42"/></svg>
            <input type="text" placeholder="Search city or area" className="flex-1 px-2 py-2 bg-transparent outline-none text-[#222]" />
          </div>
        </div>
        {/* Search Button */}
        <div className="flex items-end h-full mx-1 mt-6 md:mt-8">
          <button type="submit" className="bg-[#00b386] hover:bg-[#009966] text-white px-8 py-3 rounded-lg font-bold shadow flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}