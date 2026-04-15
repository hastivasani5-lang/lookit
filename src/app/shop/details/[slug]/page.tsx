"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { addCartItem, getCartItems } from "@/lib/cart-store";
import type { ShopCatalogItem } from "@/lib/shop-catalog";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function DetailsPage() {
  const { slug } = useParams();
  const slugValue = typeof slug === "string" ? slug : "";
  const [item, setItem] = useState<ShopCatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadItem = async () => {
      if (!slugValue) {
        setLoadError("Invalid product slug");
        setItem(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError("");

      try {
        const response = await fetch(`/api/shop/items/${slugValue}`, { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as { item?: ShopCatalogItem; message?: string };

        if (!isActive) {
          return;
        }

        if (!response.ok || !payload.item) {
          setLoadError(payload.message || "Item not found.");
          setItem(null);
          return;
        }

        setItem(payload.item);
      } catch {
        if (isActive) {
          setLoadError("Unable to load details right now.");
          setItem(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadItem();

    return () => {
      isActive = false;
    };
  }, [slugValue]);

  useEffect(() => {
    setIsAdded(Boolean(item && getCartItems().some((entry) => entry.id === item.id)));

    const handleStorage = () => {
      setIsAdded(Boolean(item && getCartItems().some((entry) => entry.id === item.id)));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [item]);

  const heroLabel = useMemo(() => item?.title || "Shop Details", [item]);

  const imageSrc = item?.imageUrl || "/instructor.avif";

  const handleAddToCart = () => {
    if (!item) {
      return;
    }

    addCartItem({
      id: item.id,
      contentId: item.contentId,
      professionalId: item.professionalId,
      professionalName: item.professionalName,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      sourceUrl: item.sourceUrl,
      contentType: item.contentType,
    });

    setIsAdded(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f8f7]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading details...</div>
        <Footer />
      </div>
    );
  }

  if (loadError || !item) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f8f7]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-lg font-semibold text-gray-700">{loadError || "Item not found."}</p>
          <Link
            href="/shop"
            className="rounded-full bg-[#1ec28e] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#169e6d]"
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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
            {heroLabel}
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
              <img
                src={imageSrc}
                alt={item.title}
                className="h-full w-full object-contain"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1">

              {/* TITLE */}
              <h2 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h2>

              {/* RATING */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs rounded-full bg-[#eef7f4] px-3 py-1 text-primary font-semibold uppercase">
                  {item.contentType}
                </span>
                <span className="text-gray-400 text-xs">By {item.professionalName}</span>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[#1ec28e] font-bold text-lg">
                  {item.price}
                </span>
              </div>

              {/* DESC */}
              <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-[520px]">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-[#1ec28e] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#169e6d] transition"
                >
                  {isAdded ? "Added to Cart" : "Add to Cart"}
                </button>
                <Link
                  href="/cart"
                  className="rounded-full border border-[#1ec28e] px-6 py-2 text-sm font-medium text-[#1ec28e] transition hover:bg-[#1ec28e] hover:text-white"
                >
                  Go to Cart
                </Link>
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Open Source
                  </a>
                ) : null}
              </div>

              {/* META */}
              <div className="mt-6 text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  {item.category}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Type:</span>{" "}
                  {item.contentType}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Size/Duration:</span>{" "}
                  {item.sizeLabel}
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
              {item.description}
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}