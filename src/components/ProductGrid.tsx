"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { addCartItem, getCartItems } from "@/lib/cart-store";
import type { ShopCatalogItem } from "@/lib/shop-catalog";

type ContentTab = "book" | "video";

type ProductGridProps = {
  selectedMaxPrice?: number | null;
  onPriceBoundsChange?: (bounds: { min: number; max: number }) => void;
};

const itemsPerPage = 6;

function placeholderImageFor(contentType: ContentTab) {
  return contentType === "book" ? "/instructor.avif" : "/instructor.avif";
}

const ProductGrid = ({ selectedMaxPrice, onPriceBoundsChange }: ProductGridProps) => {
  const [activeTab, setActiveTab] = useState<ContentTab>("book");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [catalogItems, setCatalogItems] = useState<ShopCatalogItem[]>([]);
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const lastSentBoundsRef = useRef<{ min: number; max: number } | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadCatalog = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/shop/items", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as { items?: ShopCatalogItem[] };

        if (!isActive) {
          return;
        }

        if (!response.ok) {
          setLoadError("Unable to load shop items right now.");
          setCatalogItems([]);
          return;
        }

        setCatalogItems(Array.isArray(payload.items) ? payload.items : []);
      } catch {
        if (isActive) {
          setLoadError("Unable to load shop items right now.");
          setCatalogItems([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCatalog();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setCartItemIds(getCartItems().map((item) => item.id));

    const handleStorage = () => setCartItemIds(getCartItems().map((item) => item.id));
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!onPriceBoundsChange) {
      return;
    }

    const tabItems = catalogItems.filter((item) => item.contentType === activeTab);
    const maxAmount = tabItems.reduce((max, item) => Math.max(max, item.amount), 0);
    const nextBounds = {
      min: 0,
      max: Math.max(Math.ceil(maxAmount), 0),
    };

    const previous = lastSentBoundsRef.current;
    if (previous && previous.min === nextBounds.min && previous.max === nextBounds.max) {
      return;
    }

    lastSentBoundsRef.current = nextBounds;

    onPriceBoundsChange(nextBounds);
  }, [activeTab, catalogItems, onPriceBoundsChange]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const maxAllowedPrice = typeof selectedMaxPrice === "number" ? selectedMaxPrice : Number.POSITIVE_INFINITY;

    return catalogItems.filter((item) => {
      if (item.contentType !== activeTab) {
        return false;
      }

      if (item.amount > maxAllowedPrice) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.professionalName.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [activeTab, catalogItems, searchQuery, selectedMaxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddToCart = (item: ShopCatalogItem) => {
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

    setCartItemIds((current) => (current.includes(item.id) ? current : [item.id, ...current]));
  };

  const handleTab = (tab: ContentTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "book"
                ? "bg-[#1ec28e] text-white hover:bg-[#169e6d]"
                : "bg-[#e5f8f2] text-[#1ec28e] hover:bg-[#c7f0e3]"
            }`}
            onClick={() => handleTab("book")}
          >
            Books
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "video"
                ? "bg-[#1ec28e] text-white hover:bg-[#169e6d]"
                : "bg-[#e5f8f2] text-[#1ec28e] hover:bg-[#c7f0e3]"
            }`}
            onClick={() => handleTab("video")}
          >
            Videos
          </button>
        </div>
        <input
          type="text"
          placeholder="Search title, category, professional"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1ec28e]"
        />
      </div>

      {isLoading ? (
        <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">Loading items...</div>
      ) : loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">{loadError}</div>
      ) : paginatedItems.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm text-gray-500">
          No {activeTab === "book" ? "books" : "videos"} added by professionals yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {paginatedItems.map((item) => {
            const imageSrc = item.imageUrl || placeholderImageFor(item.contentType);
            const isInCart = cartItemIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="group relative cursor-pointer rounded-xl border bg-white p-4 transition hover:shadow-md"
              >
                <div className="relative flex justify-center overflow-hidden rounded-lg bg-[#f4f4f4] p-4">
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="h-40 w-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="mt-4 min-h-[125px]">
                  <h3 className="text-center font-semibold text-gray-800">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-center text-xs text-gray-500">{item.subtitle}</p>
                  <p className="mt-1 text-center text-xs text-gray-500">By {item.professionalName}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="font-semibold text-[#1ec28e]">{item.price}</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="rounded-lg bg-[#1ec28e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#169e6d]"
                  >
                    {isInCart ? "Added" : "Add Cart"}
                  </button>
                  <Link
                    href={`/shop/details/${item.slug}`}
                    className="rounded-lg border border-[#1ec28e] px-3 py-2 text-center text-sm font-semibold text-[#1ec28e] transition hover:bg-[#1ec28e] hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded bg-gray-100 px-3 py-1 text-gray-600 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`rounded px-3 py-1 ${
                currentPage === index + 1 ? "bg-[#1ec28e] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded bg-gray-100 px-3 py-1 text-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ProductGrid;