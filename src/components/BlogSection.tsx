"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const blogs = [
  {
    id: 1,
    image: "/blog-thumb1.png",
    date: "28 JAN",
    author: "John D. Alexon",
    title: "10 Proven Strategies to excel Online Learning",
    color: "blue",
  },
  {
    id: 2,
    image: "/blog-thumb2.png",
    date: "29 JAN",
    author: "Anjelina Watson",
    title: "Trends that are shaping the Learning experience",
    color: "green",
  },
  {
    id: 3,
    image: "/blog-thumb3.png",
    date: "30 JAN",
    author: "David X. Barmer",
    title: "Learning is the Key soft skills and Professional",
    color: "orange",
  },
  {
    id: 1,
    image: "/blog-thumb1.png",
    date: "28 JAN",
    author: "John D. Alexon",
    title: "10 Proven Strategies to excel Online Learning",
    color: "blue",
  },
  {
    id: 2,
    image: "/blog-thumb2.png",
    date: "29 JAN",
    author: "Anjelina Watson",
    title: "Trends that are shaping the Learning experience",
    color: "green",
  },
  {
    id: 3,
    image: "/blog-thumb3.png",
    date: "30 JAN",
    author: "David X. Barmer",
    title: "Learning is the Key soft skills and Professional",
    color: "orange",
  },
];

export default function BlogSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 1.5; // px per frame

    const animate = () => {
      if (!paused) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused]);

  return (
    <section
      className="bg-white py-20 px-4 md:px-10 lg:px-16 overflow-hidden"
      data-aos="fade-up"
      data-aos-duration="900"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center mb-16">
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
              <span className="w-2 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></span>
              LATEST BLOG
            </div>
            <div className="mt-3 w-full h-px bg-gray-300"></div>
          </div>
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-right">
              Read the Latest Insights and
              <br />
              Updates Educate Blog
            </h2>
          </div>
        </div>

        {/* Slider */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div ref={trackRef} className="flex gap-6 w-max">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className={`rounded-[20px] p-6 text-left flex-shrink-0 w-[320px] ${
                  blog.color === "blue"
                    ? "bg-[#eaf6fb]"
                    : blog.color === "green"
                    ? "bg-[#eaf7f2]"
                    : "bg-[#fff3eb]"
                }`}
              >
                {/* IMAGE */}
                <div className="relative rounded-[16px] overflow-hidden mb-5">
                  <Image
                    src={blog.image}
                    alt=""
                    width={400}
                    height={220}
                    className="w-full h-[200px] object-cover"
                  />
                  <span
                    className={`absolute bottom-3 left-3 text-white text-xs px-3 py-1 rounded-full ${
                      blog.color === "blue"
                        ? "bg-[#22a6df]"
                        : blog.color === "green"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                        : "bg-[#ff8a3d]"
                    }`}
                  >
                    {blog.date}
                  </span>
                </div>

                {/* AUTHOR */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image src="/pro1.jpeg" width={32} height={32} alt="" />
                  </div>
                  <p className="text-sm text-gray-600">{blog.author}</p>
                </div>

                {/* TITLE */}
                <h3 className="font-semibold text-lg text-[#0f172a] leading-snug mb-6">
                  {blog.title}
                </h3>

                {/* BUTTON */}
                <Link
                  href={`/blog/${blog.id}`}
                  className={`flex items-center justify-between w-full px-5 py-3 rounded-full border text-sm font-medium transition ${
                    blog.color === "blue"
                      ? "border-[#22a6df] text-[#22a6df] hover:bg-[#1a7fa6] hover:border-[#1a7fa6]"
                      : blog.color === "green"
                      ? "border-[#1ec28e] text-[#1ec28e] hover:bg-[#0f8e4a] hover:border-[#0f8e4a]"
                      : "border-[#ff8a3d] text-[#ff8a3d] hover:bg-[#d97a1f] hover:border-[#d97a1f]"
                  } hover:text-white group`}
                >
                  Continue Reading
                  <span className="transition group-hover:translate-x-1">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
