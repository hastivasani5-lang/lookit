    "use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

type ProductOrVideo = {
  title: string;
  price: number;
  image: string;
  oldPrice?: number;
};

const videos: ProductOrVideo[] = [
  {
    title: "React Basics",
    price: 120,
    image: "/videos/video1.jpg",
  },
  {
    title: "Next.js Crash Course",
    price: 150,
    image: "/videos/video2.jpg",
  },
  {
    title: "Tailwind Mastery",
    price: 100,
    image: "/videos/video3.jpg",
  },
];

export const products: ProductOrVideo[] = [
  {
    title: "George Orwell",
    price: 60,
    image: "/books/book1.jpg",
  },
  {
    title: "Moby-Dick",
    price: 60,
    oldPrice: 100,
    image: "/books/book2.jpg",
  },
  {
    title: "Brave New World",
    price: 40,
    image: "/books/book3.jpg",
  },
  {
    title: "The Hobbit",
    price: 40,
    oldPrice: 100,
    image: "/books/book4.jpg",
  },
  {
    title: "A Game of Thrones",
    price: 80,
    image: "/books/book5.jpg",
  },
  {
    title: "Neuromancer",
    price: 60,
    image: "/books/book6.jpg",
  },
  {
    title: "Big Little Lies",
    price: 50,
    image: "/books/book7.jpg",
  },
  {
    title: "The Reversal",
    price: 70,
    oldPrice: 100,
    image: "/books/book8.jpg",
  },
  {
    title: "Sharp Objects",
    price: 60,
    image: "/books/book9.jpg",
  },
];

const ProductGrid = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const items = activeTab === "books" ? products : videos;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="flex-1">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 gap-2">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "books"
                ? "bg-[#1ec28e] text-white hover:bg-[#169e6d]"
                : "bg-[#e5f8f2] text-[#1ec28e] hover:bg-[#c7f0e3]"
            }`}
            onClick={() => handleTab("books")}
          >
            Books
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "videos"
                ? "bg-[#1ec28e] text-white hover:bg-[#169e6d]"
                : "bg-[#e5f8f2] text-[#1ec28e] hover:bg-[#c7f0e3]"
            }`}
            onClick={() => handleTab("videos")}
          >
            Videos
          </button>
        </div>
        <input
          type="text"
          placeholder="Search here"
          className="border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1ec28e]"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedItems.map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border hover:shadow-md transition relative group cursor-pointer"
          >
            <div className="bg-[#f4f4f4] rounded-lg p-4 flex justify-center relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                width={120}
                height={160}
                className="object-contain"
              />
            </div>

            {/* Info section hidden on hover, button shown in its place */}
            <div className="min-h-[90px] flex flex-col items-center justify-center relative">
              <div className={"transition-opacity w-full " + ("group-hover:opacity-0" )}>
                <h3 className="mt-4 font-semibold text-gray-800 text-center">
                  {item.title}
                </h3>
                {/* Stars */}
                <div className="text-yellow-400 text-sm mt-1 text-center">
                  ★★★★★ <span className="text-gray-400 text-xs">(4.5)</span>
                </div>
                {/* Price */}
                <div className="mt-2 flex items-center gap-2 justify-center">
                  <span className="text-[#1ec28e] font-semibold">
                    ${item.price}
                  </span>
                  {item.oldPrice && (
                    <span className="line-through text-gray-400 text-sm">
                      ${item.oldPrice}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/shop/details/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-[#1ec28e] text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-center"
                tabIndex={-1}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                page === idx + 1 ? "bg-[#1ec28e] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;