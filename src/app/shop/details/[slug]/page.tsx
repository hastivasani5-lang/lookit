"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/components/ProductGrid";
import { useState } from "react";

export default function DetailsPage() {
  const { slug } = useParams();
  const [qty, setQty] = useState(1);

  if (!slug || typeof slug !== "string") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-2xl font-bold text-gray-500">
          Invalid product slug
        </div>
        <Footer />
      </div>
    );
  }

  const book = products.find(
    (p) =>
      p.title.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  if (!book) return null;

  return (
    <div className="bg-[#f4f8f7] min-h-screen flex flex-col">
      <Navbar />

      {/* ================= HERO ================= */}
      <div className="bg-[#e9f3ef] pt-16 pb-36 text-center relative overflow-hidden">
        <h1 className="text-3xl font-semibold text-gray-800">
          Shop Details
        </h1>

        <p className="text-sm mt-2">
          <span className="text-[#1ec28e] font-medium">HOME</span>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-gray-500">SHOP</span>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-gray-700 font-medium">
            {book.title}
          </span>
        </p>
      </div>

      {/* ================= MAIN ================= */}
      <main className="flex-1 -mt-20 pb-16 relative z-10">
        <div className="max-w-[1150px] mx-auto px-4">

          {/* ================= PRODUCT CARD ================= */}
          <div className="bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.08)] p-10 flex gap-12 items-center">

            {/* IMAGE */}
            <div className="bg-[#dfe9d5] rounded-xl p-6 w-[280px] h-[340px] flex items-center justify-center">
              <Image
                src={book.image}
                alt={book.title}
                width={220}
                height={300}
                className="object-contain"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1">

              {/* TITLE */}
              <h2 className="text-xl font-semibold text-gray-800">
                {book.title}
              </h2>

              {/* RATING */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <span className="text-gray-400 text-xs">
                  (02 Reviews)
                </span>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[#1ec28e] font-bold text-lg">
                  ${book.price}
                </span>
                <span className="line-through text-gray-400 text-sm">
                  $100
                </span>
              </div>

              {/* DESC */}
              <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-[520px]">
                Educate the ultimate destination for knowledge seekers and
                educators alike. We are committed to transforming special
                education impact global channels without standards compliant systems.
              </p>

              {/* QTY + BUTTON */}
              <div className="flex items-center gap-4 mt-6">

                {/* QUANTITY */}
                <div className="flex items-center border rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>

                  <span className="px-4 text-sm">{qty}</span>

                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* BUTTON */}
                <button className="bg-[#1ec28e] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#169e6d] transition">
                  Add to Cart →
                </button>
              </div>

              {/* META */}
              <div className="mt-6 text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Colors:</span>{" "}
                  Black & Yellow
                </p>
                <p>
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  Historical Fiction
                </p>
                <p>
                  <span className="font-medium text-gray-700">Tags:</span>{" "}
                  Design, Business
                </p>
              </div>
            </div>
          </div>

          {/* ================= TABS ================= */}
          <div className="mt-12 bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.08)] p-8">

            <div className="flex gap-8 border-b mb-6">
              <button className="text-[#1ec28e] text-sm font-medium border-b-2 border-[#1ec28e] pb-2">
                Description
              </button>

              <button className="text-gray-400 text-sm font-medium pb-2">
                Reviews
              </button>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              Educate the ultimate destination for knowledge seekers and educators alike
              distinctively restore installed. We are committed to transforming special
              education impact global channels without standards compliant systems.
              Quickly deploy performance based architectures vis-a-vis business bandwidth.
              Professionally disseminate customer service and virtual catalysts for change.
              Proactively visualize professional paradigms for robust imperatives.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}