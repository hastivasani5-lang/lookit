"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ChevronLeft, ChevronRight, Heart, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { ShopCatalogItem } from "@/lib/shop-catalog";

export default function StudentsViewing() {
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";
  const router = useRouter();

  const [items, setItems] = useState<ShopCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Fetch real videos from shop catalog
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/shop/items", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { items: ShopCatalogItem[] };
        // Show all items (books + videos) uploaded by professionals
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  // Fetch wishlist for student
  useEffect(() => {
    if (!isStudent) return;
    fetch("/api/student/wishlist", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { items?: Array<{ id: string }> }) => setWishlistIds((d.items ?? []).map((i) => i.id)))
      .catch(() => {});
  }, [isStudent]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleWishlist = async (item: ShopCatalogItem, e: React.MouseEvent) => {
    e.stopPropagation();
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
      setWishlistIds((prev) => data.wishlisted ? [item.id, ...prev] : prev.filter((w) => w !== item.id));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch { /* ignore */ }
  };

  return (
    <section className="bg-linear-to-b from-[#f7f9fb] to-white px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e2a55]">
            All{" "}
            <span className="relative inline-block">
              Latest Courses
              <span className="absolute left-0 -bottom-1 w-full h-0.75 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full" />
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1e2a55] shadow-sm hover:bg-linear-to-r from-emerald-600 to-teal-600 hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1e2a55] shadow-sm hover:bg-linear-to-r from-emerald-600 to-teal-600 hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            No courses uploaded by professionals yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                onClick={() => router.push(`/shop/details/${item.slug}`)}
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden bg-gray-100">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-47.5 object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-47.5 flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
                      <Video className="h-12 w-12 text-emerald-300" />
                    </div>
                  )}

                  {/* TYPE BADGE */}
                  <span className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md bg-linear-to-r from-emerald-500 to-teal-500 capitalize">
                    {item.contentType}
                  </span>

                  {/* WISHLIST */}
                  {isStudent && (
                    <button
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:scale-110"
                      onClick={(e) => handleToggleWishlist(item, e)}
                      aria-label="Wishlist"
                    >
                      <Heart className={`h-4 w-4 transition ${wishlistIds.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </button>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-[#1e2a55] line-clamp-2 group-hover:text-[#1ec28e] transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 font-medium mt-1.5">By {item.professionalName}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-extrabold text-[#1e2a55]">{item.price}</span>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-[10px] font-semibold text-gray-600 ml-0.5">5.0</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-3" />

                  <Link
                    href={`/shop/details/${item.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2 rounded-lg text-sm font-semibold bg-linear-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center gap-2 hover:opacity-90 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
