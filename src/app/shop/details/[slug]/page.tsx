"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { addCartItem, getCartItems } from "@/lib/cart-store";
import type { ShopCatalogItem } from "@/lib/shop-catalog";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function DetailsPage() {
  const { slug } = useParams();
  const slugValue = typeof slug === "string" ? slug : "";
  const [item, setItem] = useState<ShopCatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

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

  const parsedPrice = useMemo(() => {
    if (!item) {
      return null;
    }

    const amount = Number.parseFloat(item.price.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      return { current: item.price, original: null };
    }

    const symbolMatch = item.price.match(/^[^\d]+/);
    const symbol = symbolMatch ? symbolMatch[0] : "$";
    const originalAmount = amount + Math.max(10, Math.round(amount * 0.35));

    return {
      current: `${symbol}${amount.toFixed(0)}`,
      original: `${symbol}${originalAmount.toFixed(0)}`,
    };
  }, [item]);

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
    <div className="min-h-screen flex flex-col bg-[#f5f6f5]">
      <Navbar />

      <div className="relative overflow-hidden bg-[#dce9e5] pt-14 pb-28 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-radial-gradient(circle_at_0_0,rgba(255,255,255,0.26),rgba(255,255,255,0.26)_12px,transparent_12px,transparent_42px)] opacity-55" />
        <div className="relative z-10 px-4">
          <h1 className="text-[44px] font-bold leading-tight text-[#11243a]">Shop Details</h1>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7e8e8b]">
            <span className="text-[#1ec28e]">Home</span>
            <span className="mx-2 text-[#89a39d]">&gt;</span>
            <span className="text-[#1ec28e]">Shop</span>
            <span className="mx-2 text-[#89a39d]">&gt;</span>
            <span className="text-[#11243a]">{heroLabel}</span>
          </p>
        </div>
      </div>

      <main className="relative z-10 -mt-12 flex-1 pb-24">
        <div className="mx-auto max-w-[1220px] px-5">
          <section className="rounded-[10px] bg-[#f1f1f1] px-5 py-5 shadow-[0_14px_48px_rgba(10,26,37,0.06)] md:px-10 md:py-8">
            <div className="grid items-center gap-8 lg:grid-cols-[392px_minmax(0,1fr)]">
              <div className="rounded-[8px] bg-[#d4ddc6] p-7">
                <div className="relative mx-auto aspect-[0.7] w-full max-w-[288px] overflow-hidden rounded-[2px] bg-[#e9ede2]">
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 288px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="max-w-[690px]">
                <h2 className="text-[38px] font-semibold leading-tight text-[#13253f]">{item.title}</h2>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-[16px] tracking-[1px] text-[#ff9b1f]">★★★★★</span>
                  <span className="text-[#8a928f]">(02 Reviews)</span>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-[32px] font-bold leading-none text-[#18ba8a]">
                    {parsedPrice?.current ?? item.price}
                  </span>
                  {parsedPrice?.original ? (
                    <span className="text-lg font-semibold text-[#9da7a3] line-through">{parsedPrice.original}</span>
                  ) : null}
                </div>

                <p className="mt-5 max-w-[640px] text-[14px] leading-7 text-[#6f7674]">{item.description}</p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <div className="inline-flex h-[44px] items-center rounded-full border border-[#ced4d1] bg-white px-2 text-sm text-[#55615e]">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(0, current - 1))}
                      className="h-8 w-9 rounded-full transition hover:bg-[#f0f3f2]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-[14px] font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                      className="h-8 w-9 rounded-full transition hover:bg-[#f0f3f2]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex h-[44px] items-center rounded-full bg-[#17c28a] px-7 text-[14px] font-semibold text-white transition hover:bg-[#11ab78]"
                  >
                    {isAdded ? "Added to Cart" : "Add to Cart"}
                  </button>

                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[#6f7674] underline-offset-4 transition hover:text-[#1b2d46] hover:underline"
                    >
                      Open Source
                    </a>
                  ) : null}
                </div>

                <div className="mt-7 space-y-3 text-[14px] text-[#717a77]">
                  <p>
                    <span className="font-semibold text-[#2f3f53]">Colors</span>
                    <span className="mx-2">:</span>
                    Black &amp; Yellow
                  </p>
                  <p>
                    <span className="font-semibold text-[#2f3f53]">Category</span>
                    <span className="mx-2">:</span>
                    {item.category}
                  </p>
                  <p>
                    <span className="font-semibold text-[#2f3f53]">Tags</span>
                    <span className="mx-2">:</span>
                    {item.contentType === "book" ? "Design, Business" : "Learning, Video"}
                  </p>
                </div>

                <div className="mt-5">
                  <Link href="/cart" className="text-sm font-medium text-[#17b786] hover:underline">
                    Go to Cart
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 px-1">
            <div className="flex items-center gap-10 border-b border-[#d4d9d6]">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`pb-3 text-[14px] font-medium transition ${
                  activeTab === "description"
                    ? "border-b-2 border-[#20c190] text-[#1f2f45]"
                    : "border-b-2 border-transparent text-[#6f7674]"
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 text-[14px] font-medium transition ${
                  activeTab === "reviews"
                    ? "border-b-2 border-[#20c190] text-[#1f2f45]"
                    : "border-b-2 border-transparent text-[#6f7674]"
                }`}
              >
                Reviews
              </button>
            </div>

            <div className="pt-7">
              {activeTab === "description" ? (
                <p className="text-[13px] leading-7 text-[#6f7674]">
                  {item.description} {" "}
                  Educate the ultimate destination for knowledge seekers and educators alike we are committed to
                  transforming special education impact global channels base information with user without standards
                  compliant systems base information with quickly deploy performance based architectures visual-first
                  publishers bandwidth professionally disseminate best-of-breed customer service and virtual catalysts
                  for change.
                </p>
              ) : (
                <p className="text-[13px] leading-7 text-[#6f7674]">
                  No reviews available yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}