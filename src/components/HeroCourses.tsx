"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroCourses() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchText.trim();
    router.push(query ? `/directory?search=${encodeURIComponent(query)}` : "/directory");
  };

  return (
    <section className="bg-[#f3f7f6] px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* ================= LEFT CONTENT ================= */}
        <div>
          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#1e2a55] leading-tight">
            Start learning from the <br />
            world’s best institutions
          </h1>

          {/* Description */}
          <p className="text-gray-500 mt-4 text-sm md:text-base max-w-lg">
            Flexible easy to access learning opportunities can bring a significant
            change in how individuals prefer to learn! The Ellen can offer you to
            enjoy the beauty of eLearning!
          </p>

          {/* ================= SEARCH BAR ================= */}
          <div className="mt-6">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white rounded-md shadow-sm overflow-hidden w-full max-w-md"
            >
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="flex-1 px-4 py-3 text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-[#1ec28e] text-white px-5 py-3 text-sm font-medium hover:bg-[#18a97a]"
              >
                Search Now
              </button>
            </form>
          </div>

          {/* ================= SUPPORT ================= */}
          <div className="mt-6 flex items-center gap-3">
            {/* Avatars */}
            <div className="flex -space-x-2">
              <Image
                src="/person.png"
                alt=""
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
              <Image
                src="/pro1.jpeg"
                alt=""
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
              <Image
                src="/pro2.jpeg"
                alt=""
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
            </div>

            {/* Text */}
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <span className="text-[#1ec28e] cursor-pointer">
                Contact our support
              </span>
            </p>
          </div>

          {/* Link */}
          <div className="mt-4">
            <a
              href="#"
              className="text-[#1e2a55] font-medium text-sm underline hover:text-[#1ec28e]"
            >
              Discover all courses
            </a>
          </div>
        </div>

        {/* ================= RIGHT IMAGE SECTION ================= */}
        <div className="relative flex justify-center items-center">

          {/* Dotted Background Box */}
          <div className="absolute w-72 h-72 border border-dashed border-[#1ec28e]/40 rounded-xl -z-10"></div>

          {/* Main Center Image */}
          <div className="relative z-10">
            <Image
              src="/banner-img1.jpg"
              alt="student"
              width={260}
              height={320}
              className="rounded-3xl object-cover"
            />
          </div>

          {/* Top Right Image */}
          <div className="absolute top-0 right-0">
            <Image
              src="/banner-img2.jpg"
              alt="student"
              width={180}
              height={140}
              className="rounded-2xl object-cover shadow-md"
            />
          </div>

          {/* Bottom Right Image */}
          <div className="absolute bottom-0 right-0">
            <Image
              src="/banner-img3.jpg"
              alt="student"
              width={180}
              height={180}
              className="rounded-2xl object-cover shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}