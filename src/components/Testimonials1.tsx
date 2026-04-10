"use client";

import Image from "next/image";
import SectionTitle from "./SectionTitle";

const testimonials = [
  {
    title: "Impresive Learning!",
    desc: "Educate ultimate destination knowledge seekers and educators we are committed to transforming special education impact channels without standards compliant-is systems attractive learning",
    name: "Anjelina Watson",
    role: "UI Designer",
    image: "/pro2.jpeg",
  },
  {
    title: "Great Instructor!",
    desc: "Educate ultimate destination knowledge seekers and educators we are committed to transforming special education impact channels without standards compliant-is systems attractive learning",
    name: "David Alexon",
    role: "UI Designer",
    image: "/pro3.jpeg",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#e9f2f1] px-4 md:px-10 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div>
          {/* SMALL TITLE */}
          <SectionTitle className="mb-4">Testimonials</SectionTitle>

          {/* MAIN HEADING */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            All Real Experiences <br />
            From Our Dedicated <br />
            Learners
          </h2>

          {/* AVATARS */}
          <div className="flex items-center gap-3 mb-4">
            <Image src="/hero-autor.png" width={100} height={100} className="rounded-full" alt="" />
           
          </div>

          <p className="text-gray-700 font-semibold mb-6">130+ Reviews</p>

          {/* ARROWS */}
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition">
              ←
            </button>
            <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition">
              →
            </button>
          </div>
        </div>

        {/* RIGHT SIDE CARDS */}
        <div className="grid md:grid-cols-2 gap-6">

          {testimonials.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md transition"
            >
              {/* TITLE */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#1ec28e] text-2xl">❝</span>
                <h3 className="font-semibold text-lg text-gray-900">
                  {item.title}
                </h3>
              </div>

              {/* DESC */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.desc}
              </p>

              {/* STARS */}
              <div className="text-orange-500 mb-4">★★★★★</div>

              {/* LINE */}
              <div className="h-[1px] bg-gray-200 mb-4"></div>

              {/* USER */}
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  width={45}
                  height={45}
                  className="rounded-full"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}