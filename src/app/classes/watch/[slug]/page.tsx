"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

// Demo data for classes and their videos
const classes = [
  {
    title: "The Complete Digital Marketing Course",
    slug: "the-complete-digital-marketing-course",
    image: "/classes/class1.png",
    videos: [
      {
        title: "Intro to Digital Marketing",
        url: "/videos/video1.mp4",
        thumb: "/classes/class1.png",
        duration: "12:34",
      },
      {
        title: "SEO Basics",
        url: "/videos/video2.mp4",
        thumb: "/classes/class2.png",
        duration: "10:20",
      },
      {
        title: "Social Media Marketing",
        url: "/videos/video3.mp4",
        thumb: "/classes/class3.png",
        duration: "15:10",
      },
    ],
  },
  {
    title: "The Business Startup Guide to Become an Entrepreneur",
    slug: "the-business-startup-guide-to-become-an-entrepreneur",
    image: "/classes/class2.png",
    videos: [
      {
        title: "Startup Mindset",
        url: "/videos/video2.mp4",
        thumb: "/classes/class2.png",
        duration: "09:45",
      },
      {
        title: "Funding Your Business",
        url: "/videos/video3.mp4",
        thumb: "/classes/class3.png",
        duration: "13:22",
      },
    ],
  },
  // Add more classes as needed
];

export default function WatchClassPage() {
  const { slug } = useParams();
  const cls = classes.find((c) => c.slug === slug);
  const [current, setCurrent] = useState(0);

  if (!cls) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-2xl font-bold text-gray-500">
        Class not found
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col">
      <Navbar />
      <main className="flex-1 px-2 md:px-10 lg:px-24 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Video */}
        <div className="flex-1 flex flex-col items-center lg:items-start">
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-4">
            <video
              src={cls.videos[current].url}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
              poster={cls.videos[current].thumb}
            />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">{cls.videos[current].title}</h2>
        </div>
        {/* Video List */}
        <aside className="w-full lg:w-[380px] flex-shrink-0 bg-[#232323] rounded-2xl p-4 flex flex-col gap-4 h-fit">
          <h3 className="text-white text-lg font-bold mb-2">All Videos</h3>
          {cls.videos.map((v, idx) => (
            <div
              key={v.url}
              className={`flex gap-4 items-center rounded-lg p-2 cursor-pointer transition border border-transparent hover:border-[#1ec28e] ${current === idx ? "bg-[#1ec28e] bg-opacity-10 border-[#1ec28e]" : ""}`}
              onClick={() => setCurrent(idx)}
            >
              <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src={v.thumb} alt={v.title} fill className="object-cover" />
                <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                  {v.duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${current === idx ? "text-[#1ec28e]" : "text-white"}`}>{v.title}</div>
              </div>
            </div>
          ))}
        </aside>
      </main>
      <Footer />
    </div>
  );
}
