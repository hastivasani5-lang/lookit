// "use client";

// import Image from "next/image";

// export default function PageBanner() {
//   return (
//     <section className="relative bg-[#e6efed] py-20 px-4 md:px-10 lg:px-16 overflow-hidden">

//       {/* LEFT CURVE BACKGROUND */}
//       <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
//         <div className="absolute left-[-20%] top-0 w-[120%] h-full bg-[radial-gradient(circle_at_left,rgba(30,194,142,0.15),transparent_60%)]"></div>
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10 text-center">

//         {/* TOP ICON */}
//         <div className="flex justify-center mb-6">
//           <Image
//             src="/book-hand.png"
//             alt="book"
//             width={100}
//             height={60}
//           />
//         </div>

//         {/* TITLE */}
//         <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">
//           All Courses
//         </h1>


//         {/* SEARCH */}
//         <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-3 rounded-3xl border border-white/70 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] lg:flex-row lg:items-center">
//           <button className="flex items-center justify-between rounded-2xl bg-[#f4f6f5] px-4 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[#e9f3f0] lg:w-44">
//             <span>Search Experts</span>
//             <span className="text-gray-400">▾</span>
//           </button>

//           <button className="flex items-center justify-between rounded-2xl bg-[#f4f6f5] px-4 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[#e9f3f0] lg:w-44">
//             <span>Category</span>
//             <span className="text-gray-400">▾</span>
//           </button>

//           <input
//             type="text"
//             placeholder="Location (ZIP)"
//             className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400"
//           />

//           <button className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#18ab7d] lg:w-32">
//             Search
//           </button>
//         </div>

//       </div>

//       {/* RIGHT DOT PATTERN */}
//       <div className="hidden md:grid grid-cols-8 gap-2 absolute right-16 top-1/2 -translate-y-1/2">
//         {Array(64)
//           .fill(0)
//           .map((_, i) => (
//             <span
//               key={i}
//               className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"
//             ></span>
//           ))}
//       </div>

//     </section>
//   );
// }


"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Search, MapPin } from "lucide-react";

type PageBannerProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export default function PageBanner({ searchQuery, onSearchQueryChange }: PageBannerProps) {
  const buttonLabel = useMemo(() => (searchQuery.trim() ? "Search" : "Search"), [searchQuery]);

  return (
    <section className="relative bg-[#e6efed] py-20 px-4 md:px-10 lg:px-16 overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-20%] top-0 w-[120%] h-full bg-[radial-gradient(circle_at_left,rgba(30,194,142,0.15),transparent_60%)]"></div>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10 text-center">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <Image src="/book-hand.png" alt="book" width={90} height={60} />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-3">
          Find the Best Experts
        </h1>

        <p className="text-gray-500 text-sm md:text-base">
          Search and connect with top professionals near you
        </p>

        {/* SEARCH BAR */}
        <form
          className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-3 rounded-3xl border border-white/60 bg-white p-3 shadow-lg lg:flex-row lg:items-center"
          onSubmit={(event) => event.preventDefault()}
        >

          {/* SEARCH INPUT */}
          <div className="flex items-center gap-2 flex-1 bg-[#f4f6f5] px-4 py-3 rounded-2xl">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          {/* CATEGORY */}
          <select className="flex-1 bg-[#f4f6f5] px-4 py-3 rounded-2xl text-sm outline-none">
            <option>All Categories</option>
            <option>ADHD</option>
            <option>Dyslexia</option>
            <option>Speech Therapy</option>
          </select>

          {/* LOCATION */}
          <div className="flex items-center gap-2 flex-1 bg-[#f4f6f5] px-4 py-3 rounded-2xl">
            <MapPin className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Location (ZIP)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          {/* BUTTON */}
          <button type="submit" className="bg-primary hover:bg-[#18ab7d] text-white px-8 py-3 rounded-2xl text-sm font-semibold transition shadow-md">
            {buttonLabel}
          </button>

        </form>

      </div>

      {/* DOT PATTERN */}
      <div className="hidden md:grid grid-cols-8 gap-2 absolute right-16 top-1/2 -translate-y-1/2">
        {Array(64)
          .fill(0)
          .map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"
            ></span>
          ))}
      </div>

    </section>
  );
}