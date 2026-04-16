"use client";
import React, { useState } from "react";

type VideoItem = {
  title: string;
  url: string;
  thumb: string;
};

const videosDemo = [
  {
    title: "Instructor 1 - Introduction",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
  },
  {
    title: "Instructor 2 - Getting Started",
    url: "https://www.youtube.com/embed/ysz5S6PUM-U",
    thumb: "https://img.youtube.com/vi/ysz5S6PUM-U/mqdefault.jpg"
  },
  {
    title: "Instructor 3 - Advanced Tips",
    url: "https://www.youtube.com/embed/jNQXAC9IVRw",
    thumb: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg"
  },
];

export default function VideoSlider({ videos = videosDemo }: { videos?: VideoItem[] }) {
  const [current, setCurrent] = useState(0);

  if (!Array.isArray(videos) || videos.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-10">
        <div className="relative rounded-xl overflow-hidden shadow-lg bg-black/90 aspect-video flex items-center justify-center mb-6">
          <p className="text-sm text-white/80">No instructor videos available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      {/* Main Player */}
      <div className="relative rounded-xl overflow-hidden shadow-lg bg-black aspect-video flex items-center justify-center mb-6">
        <iframe
          src={videos[current].url}
          title={videos[current].title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      {/* Thumbnails Row */}
      <div className="flex flex-wrap gap-6 justify-center">
        {videos.map((v, idx) => (
          <div
            key={`${v.url}-${idx}`}
            className={`flex flex-col items-center cursor-pointer transition-transform ${current === idx ? "scale-105" : "opacity-80 hover:opacity-100"}`}
            onClick={() => setCurrent(idx)}
          >
            <img
              src={v.thumb}
              alt={v.title}
              className={`w-44 h-28 rounded-lg object-cover border-2 ${current === idx ? "border-[#1ec28e]" : "border-transparent"}`}
            />
            <span className="mt-2 text-xs text-gray-700 text-center font-medium w-40 truncate">
              {v.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
