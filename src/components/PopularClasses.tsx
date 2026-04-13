"use client";

import Image from "next/image";

const classes = [
  {
    title: "The Complete Digital Marketing Course",
    rating: "4.6",
    image: "/classes/class1.png",
    tag: "Beginner",
  },
  {
    title: "The Business Startup Guide to Become an Entrepreneur",
    rating: "4.8",
    image: "/classes/class2.png",
    tag: "Beginner",
  },
  {
    title: "Best Way to Learn German Language: Full Beginner",
    rating: "4.9",
    image: "/classes/class3.png",
    tag: "Beginner",
  },
  {
    title: "Complete Web & Mobile Designer in 2023: UI/UX",
    rating: "4.7",
    image: "/classes/class4.png",
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
               <div className="relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={180}
                  className="rounded-lg object-cover"
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
               <button className="mt-4 w-full border border-gray-200 rounded-lg py-2 text-sm text-gray-700 hover:bg-[#1ec28e] hover:text-white transition">
                Start Learning
              </button>
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