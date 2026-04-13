"use client";

import Image from "next/image";

const classes = [
  {
    title: "The Complete Digital Marketing Course",
    rating: "4.6",
    image: "/classes/class1.png",
    tag: "Beginner",
    video: "/videos/video1.mp4",
  },
  {
    title: "The Business Startup Guide to Become an Entrepreneur",
    rating: "4.8",
    image: "/classes/class2.png",
    tag: "Beginner",
    video: "/videos/video2.mp4",
  },
  {
    title: "Best Way to Learn German Language: Full Beginner",
    rating: "4.9",
    image: "/classes/class3.png",
    tag: "Beginner",
    video: "/videos/video3.mp4",
  },
  {
    title: "Complete Web & Mobile Designer in 2023: UI/UX",
    rating: "4.7",
    image: "/classes/class4.png",
    tag: "Beginner",
    video: "/videos/video4.mp4",
  },
];

export default function ClassesPage() {
  return (
    <section className="px-4 md:px-10 lg:px-16 py-12 min-h-screen bg-white">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">All Classes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {classes.map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col">
            <div className="relative mb-4">
              <Image
                src={item.image}
                width={300}
                height={180}
                className="rounded-lg object-cover"
                alt={item.title}
              />
              <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {item.tag}
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-800 leading-snug mb-2">{item.title}</h3>
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-gray-600">{item.rating}</span>
            </div>
            <video controls className="rounded-lg w-full h-48 object-cover">
              <source src={item.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </section>
  );
}
