"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { addCartItem, getCartItems } from "@/lib/cart-store";
import type { ShopCatalogItem } from "@/lib/shop-catalog";

import type { SidebarFilters } from "@/components/Sidebar";

type ContentTab = "book" | "video";

type ProductGridProps = {
  selectedMaxPrice?: number | null;
  onPriceBoundsChange?: (bounds: { min: number; max: number }) => void;
  onCategoriesChange?: (cats: string[]) => void;
  filters?: SidebarFilters;
};

const itemsPerPage = 6;

function placeholderImageFor(contentType: ContentTab) {
  return contentType === "book" ? "/instructor.avif" : "/instructor.avif";
}

const ProductGrid = ({ selectedMaxPrice, onPriceBoundsChange, onCategoriesChange, filters }: ProductGridProps) => {
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";
  const [activeTab, setActiveTab] = useState<ContentTab | "all">(() => "all");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [catalogItems, setCatalogItems] = useState<ShopCatalogItem[]>([]);
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});
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

        // Expose unique categories to parent
        if (onCategoriesChange && Array.isArray(payload.items)) {
          const cats = Array.from(new Set(payload.items.map((i: ShopCatalogItem) => i.category).filter(Boolean))).sort() as string[];
          onCategoriesChange(cats);
        }

        // Fetch ratings for all items
        if (Array.isArray(payload.items) && payload.items.length > 0) {
          try {
            const ratingsRes = await fetch("/api/shop/ratings", { cache: "no-store" });
            if (ratingsRes.ok) {
              const ratingsData = (await ratingsRes.json()) as { ratings: Record<string, number> };
              setItemRatings(ratingsData.ratings ?? {});
            }
          } catch { /* ignore */ }
        }
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
    if (!isStudent) return;
    const load = async () => {
      try {
        const res = await fetch("/api/student/wishlist", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { items: Array<{ id: string }> };
        setWishlistIds(data.items.map((i) => i.id));
      } catch { /* ignore */ }
    };
    void load();
  }, [isStudent]);

  useEffect(() => {
    if (!onPriceBoundsChange) {
      return;
    }
    // For 'all', consider all items; otherwise, filter by tab
    const tabItems = activeTab === "all" ? catalogItems : catalogItems.filter((item) => item.contentType === activeTab);
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
    const ignorePrice = !selectedMaxPrice || selectedMaxPrice === 0;
    return catalogItems.filter((item) => {
      if (activeTab !== "all" && item.contentType !== activeTab) return false;
      if (!ignorePrice && item.amount > selectedMaxPrice) return false;
      // Category filter
      if (filters?.category && item.category !== filters.category) return false;
      // Price type filter
      if (filters?.priceType === "free" && item.amount !== 0) return false;
      if (filters?.priceType === "paid" && item.amount === 0) return false;
      // Rating filter
      if (filters?.minRating && filters.minRating > 0) {
        const avg = itemRatings[item.contentId] ?? 0;
        if (avg < filters.minRating) return false;
      }
      if (!normalizedSearch) return true;
      return (
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.professionalName.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [activeTab, catalogItems, searchQuery, selectedMaxPrice, filters, itemRatings]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleWishlist = async (item: ShopCatalogItem) => {
    if (!isStudent) return;
    try {
      const res = await fetch("/api/student/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          price: item.price,
          imageUrl: item.imageUrl ?? "",
          contentType: item.contentType,
          professionalName: item.professionalName,
          slug: item.slug,
        }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { wishlisted: boolean };
      setWishlistIds((prev) =>
        data.wishlisted ? [item.id, ...prev] : prev.filter((id) => id !== item.id),
      );
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch { /* ignore */ }
  };

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

  const handleTab = (tab: ContentTab | "all") => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {(["all", "book", "video"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition border ${
                activeTab === tab
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent"
                  : "bg-[#eef5f3] text-[#1ec28e] border-[#d1e7dd] hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 hover:text-white hover:border-transparent"
              }`}
            >
              {tab === "all" ? "All" : tab === "book" ? "Books" : "Videos"}
            </button>
          ))}
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
            const isFree = item.amount === 0;

            return (
              <div
                key={item.id}
                className={`group relative cursor-pointer rounded-xl border bg-white p-4 transition hover:shadow-md ${isFree ? "border-red-500 border-2" : ""}`}
              >
                <div className="relative flex justify-center overflow-hidden rounded-lg bg-[#f4f4f4] p-4">
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="h-40 w-full object-contain"
                    loading="lazy"
                  />
                  {isStudent && (
                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(item)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:scale-110"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`h-4 w-4 transition ${wishlistIds.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                      />
                    </button>
                  )}
                </div>

                <div className="mt-4 min-h-[125px]">
                  <h3 className="text-center font-semibold text-gray-800">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-center text-xs text-gray-500">{item.subtitle}</p>
                  <p className="mt-1 line-clamp-2 text-center text-xs text-gray-400">{item.description}</p>
                  <p className="mt-1 text-center text-xs text-gray-500">By {item.professionalName}</p>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    {itemRatings[item.contentId] ? (
                      <>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className="h-3 w-3"
                              fill={(itemRatings[item.contentId] ?? 0) >= s ? "#f59e0b" : "none"}
                              stroke={(itemRatings[item.contentId] ?? 0) >= s ? "#f59e0b" : "#d1d5db"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-amber-500 font-semibold">{itemRatings[item.contentId]}</span>
                      </>
                    ) : null}
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${isFree ? "bg-red-100 text-red-600" : "text-[#1ec28e]"}`}>
                      {isFree ? "Free" : item.price}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    {isInCart ? "Added" : "Add Cart"}
                  </button>
                  <Link
                    href={`/shop/details/${item.slug}`}
                    className="rounded-lg border border-[#1ec28e] px-3 py-2 text-center text-sm font-semibold text-[#1ec28e] transition hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white"
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
                currentPage === index + 1 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-100 text-gray-600"
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




