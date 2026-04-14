"use client";

import Image from "next/image";
import Link from "next/link";

const classes = [
  {
    title: "The Complete Digital Marketing Course",
    rating: "4.6",
    image: "/pro1.jpeg",
    tag: "Beginner",
  },
  {
    title: "The Business Startup Guide to Become an Entrepreneur",
    rating: "4.8",
    image: "/pro2.jpeg",
    tag: "Beginner",
  },
  {
    title: "Best Way to Learn German Language: Full Beginner",
    rating: "4.9",
    image: "/pro3.jpeg",
    tag: "Beginner",
  },
  {
    title: "Complete Web & Mobile Designer in 2023: UI/UX",
    rating: "4.7",
    image: "/pro4.jpeg",
    tag: "Beginner",
  },
];

const PopularClasses = () => {
  return (
    <section className="px-4 md:px-10 lg:px-16 py-12">
      <div className="rounded-2xl bg-gradient-to-r from-[#34d399] via-[#22c1c3] to-[#3b82f6] p-6 md:p-10">
        {/* Title */}
        <h2 className="text-white text-xl md:text-2xl font-semibold mb-6">
          Popular classes
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {classes.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition"
            >
              <div className="relative w-full h-[180px]">
                <Image
                  src={item.image}
                  alt="Popular class image"
                  fill
                  className="rounded-lg object-cover"
                  style={{ objectFit: 'cover' }}
                />
                {/* Tag */}
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {item.tag}
                </span>
              </div>

               <h3 className="mt-4 text-sm font-semibold text-gray-800 leading-snug">
                {item.title}
              </h3>
               <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-gray-600">{item.rating}</span>
              </div>
              <Link
                href={`/classes/details/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="mt-4 w-full block border border-gray-200 rounded-lg py-2 text-sm text-gray-700 text-center hover:bg-[#1ec28e] hover:text-white transition"
              >
                Start Learning
              </Link>
            </div>
          ))}
        </div>
        {/* Show More Button */}
        <div className="flex justify-center mt-8">
          <a
            href="/classes"
            className="px-6 py-2 rounded-lg bg-white text-[#1ec28e] border border-[#1ec28e] font-semibold hover:bg-[#1ec28e] hover:text-white transition text-center"
          >
            Show More
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularClasses;