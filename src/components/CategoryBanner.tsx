import React, { useState } from "react";

 

export default function CategoryBanner() {
   return (
    <div className="w-full bg-gradient-to-r from-[#6a8dff] to-[#a084ee] py-12 px-4 flex flex-col items-center justify-center relative">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white text-center drop-shadow">2000+ Best Courses Available Here!</h1>
      <form className="flex flex-col md:flex-row gap-2 md:gap-4 w-full max-w-2xl mb-6">
        <input type="text" placeholder="Search Courses..." className="flex-1 px-4 py-2 rounded border border-gray-200 focus:outline-none" />
        <input type="text" placeholder="Enter Location" className="flex-1 px-4 py-2 rounded border border-gray-200 focus:outline-none" />
        <select className="flex-1 px-4 py-2 rounded border border-gray-200 focus:outline-none">
          <option value="">Select</option>
          <option value="popular">Popular</option>
          <option value="latest">Latest</option>
        </select>
        <button type="submit" className="bg-[#ff5a5f] text-white px-6 py-2 rounded font-semibold">Search Here</button>
      </form>
     
    </div>
  );
}