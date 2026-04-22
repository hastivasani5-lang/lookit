"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBanner from "@/components/CategoryBanner";
import FilterSidebar from "@/components/FilterSidebar";
import { categories } from "../../../data/categories";
import Link from "next/link";

type ShopItem = {
  id: string;
  slug: string;
  contentType: "book" | "video";
  title: string;
  subtitle: string;
  price: string;
  amount: number;
  imageUrl: string | null;
  sourceUrl: string;
  sourceType: "file" | "amazon" | "youtube";
  category: string;
  sizeLabel: string;
  professionalId: string;
  professionalName: string;
  createdAt: string;
};

const PAGE_SIZE = 9;

function BookIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#009966" strokeWidth="1.8">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#009966" strokeWidth="1.8">
      <rect x="2" y="7" width="15" height="10" rx="2" />
      <path d="M17 9l5-2v10l-5-2V9z" />
    </svg>
  );
}

function YouTubeThumbnail({ url }: { url: string }) {
  // Extract YouTube video ID from embed URL
  const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  const videoId = match[1];
  return (
    <img
      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
      alt="Video thumbnail"
      className="w-full h-full object-cover"
    />
  );
}

export default function CategoryPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : "";

  const category = categories.find((cat) => cat.slug === slug);

  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Price:High-to-Low");
  const [view, setView] = useState<"list" | "grid">("list");
  const [typeFilter, setTypeFilter] = useState<"all" | "book" | "video">("all");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/categories/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items ?? []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!category) return notFound();

  // Filter by type
  const filtered = items.filter((item) =>
    typeFilter === "all" ? true : item.contentType === typeFilter
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Price:High-to-Low") return b.amount - a.amount;
    if (sort === "Price:Low-to-High") return a.amount - b.amount;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const paginated = sorted.slice(startIdx, startIdx + PAGE_SIZE);

  const isEmpty = !loading && sorted.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fa]">
      <Navbar />
      <CategoryBanner />

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-10 mb-10">
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">

          {/* Top Bar */}
          <div className="bg-[#f8f8fc] rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between border-2 border-[#ededf7] shadow mb-2 gap-4">
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <h1 className="text-xl font-bold text-[#1e2a55]">
                {category.title}
                <span className="ml-3 text-sm font-normal text-gray-400">
                  ({sorted.length} {sorted.length === 1 ? "item" : "items"})
                </span>
              </h1>
              {/* Type tabs */}
              <div className="flex gap-2 mt-1">
                {(["all", "book", "video"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTypeFilter(t); setPage(1); }}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition ${
                      typeFilter === t
                        ? "bg-[#009966] text-white border-[#009966]"
                        : "bg-white text-[#009966] border-[#009966]/40 hover:border-[#009966]"
                    }`}
                  >
                    {t === "all" ? "All" : t === "book" ? "📚 Books" : "🎬 Videos"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Sort */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-600">Sort By:</span>
                <select
                  className="px-3 py-2 rounded-xl border border-[#009966] bg-white text-gray-700 font-medium focus:outline-none w-52 shadow-sm"
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                >
                  <option value="Price:High-to-Low">Price: High to Low</option>
                  <option value="Price:Low-to-High">Price: Low to High</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex gap-2 mt-5 md:mt-0">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="List View"
                  aria-pressed={view === "list"}
                  className={`p-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#009966] ${
                    view === "list"
                      ? "bg-white border-[#009966] shadow-md"
                      : "bg-[#f8f8fc] border-[#ededf7]"
                  }`}
                  style={{ minWidth: 46, minHeight: 46 }}
                >
                  <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="9" width="16" height="2.5" rx="1" fill={view === "list" ? "#009966" : "#b3b6f7"} />
                    <rect x="6" y="14" width="16" height="2.5" rx="1" fill={view === "list" ? "#009966" : "#b3b6f7"} />
                    <rect x="6" y="19" width="16" height="2.5" rx="1" fill={view === "list" ? "#009966" : "#b3b6f7"} />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-label="Grid View"
                  aria-pressed={view === "grid"}
                  className={`p-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#009966] ${
                    view === "grid"
                      ? "bg-white border-[#009966] shadow-md"
                      : "bg-[#f8f8fc] border-[#ededf7]"
                  }`}
                  style={{ minWidth: 46, minHeight: 46 }}
                >
                  <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="5" height="5" rx="1" fill={view === "grid" ? "#009966" : "#b3b6f7"} />
                    <rect x="17" y="6" width="5" height="5" rx="1" fill={view === "grid" ? "#009966" : "#b3b6f7"} />
                    <rect x="6" y="17" width="5" height="5" rx="1" fill={view === "grid" ? "#009966" : "#b3b6f7"} />
                    <rect x="17" y="17" width="5" height="5" rx="1" fill={view === "grid" ? "#009966" : "#b3b6f7"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-[#009966] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border-2 border-[#ededf7] shadow">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-[#1e2a55] mb-2">
                No Content Available
              </h2>
              <p className="text-gray-500 max-w-md">
                There are no books or videos added under the{" "}
                <span className="font-semibold text-[#009966]">{category.title}</span> category yet.
                Please check back later or explore other categories.
              </p>
              <Link
                href="/categories"
                className="mt-6 inline-block bg-[#009966] hover:bg-[#007a53] text-white px-6 py-3 rounded-xl font-bold shadow transition"
              >
                Browse All Categories
              </Link>
            </div>
          )}

          {/* Grid View */}
          {!loading && !isEmpty && view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-[#ededf7] shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="h-40 flex items-center justify-center bg-[#f6fcfa] relative overflow-hidden">
                    {item.contentType === "video" && item.sourceType === "youtube" && item.sourceUrl ? (
                      <YouTubeThumbnail url={item.sourceUrl} />
                    ) : item.contentType === "book" && item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#009966]">
                        {item.contentType === "book" ? <BookIcon /> : <VideoIcon />}
                        <span className="text-xs text-gray-400 font-medium">
                          {item.contentType === "book" ? "Book" : "Video"}
                        </span>
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs rounded font-bold shadow text-white ${
                      item.contentType === "book" ? "bg-[#009966]" : "bg-[#e53e3e]"
                    }`}>
                      {item.contentType === "book" ? "📚 Book" : "🎬 Video"}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="font-bold text-base text-[#1e2a55] mb-1 line-clamp-2">{item.title}</div>
                    <div className="text-gray-500 text-xs mb-2">{item.subtitle}</div>
                    <div className="text-xs text-gray-400 mb-2">
                      By <span className="text-[#009966] font-semibold">{item.professionalName}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f0f0f0]">
                      <div className="font-bold text-[#009966] text-lg">{item.price}</div>
                      <Link
                        href={`/shop/details/${item.slug}`}
                        className="bg-[#009966] hover:bg-[#007a53] text-white px-4 py-2 rounded-xl font-bold shadow border-2 border-[#009966] transition text-sm no-underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {!loading && !isEmpty && view === "list" && (
            <div className="space-y-3">
              {paginated.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row bg-white rounded-2xl p-5 gap-4 items-center border-2 border-[#009966]/20 shadow-sm hover:shadow-lg transition"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-[#f6fcfa] border-2 border-[#009966]/20 shrink-0 overflow-hidden">
                    {item.contentType === "video" && item.sourceType === "youtube" && item.sourceUrl ? (
                      <YouTubeThumbnail url={item.sourceUrl} />
                    ) : item.contentType === "book" && item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      item.contentType === "book" ? <BookIcon /> : <VideoIcon />
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-[#1e2a55]">{item.title}</span>
                      <span className={`px-2 py-0.5 text-xs rounded font-bold border ${
                        item.contentType === "book"
                          ? "bg-[#e6efed] text-[#009966] border-[#009966]/30"
                          : "bg-red-50 text-red-500 border-red-200"
                      }`}>
                        {item.contentType === "book" ? "📚 Book" : "🎬 Video"}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm mb-1">{item.subtitle}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>
                        By <span className="text-[#009966] font-semibold">{item.professionalName}</span>
                      </span>
                      <span>📁 {item.sizeLabel}</span>
                    </div>
                    <div className="font-bold text-[#009966] text-base mt-1">{item.price}</div>
                  </div>

                  <div className="flex items-center justify-end w-full md:w-auto mt-2 md:mt-0">
                    <Link
                      href={`/shop/details/${item.slug}`}
                      className="bg-[#009966] hover:bg-[#007a53] text-white px-6 py-2 rounded-xl font-bold shadow border-2 border-[#009966] transition no-underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-end mt-4 pb-5">
              <nav className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded border ${
                      page === i + 1
                        ? "bg-[#e6e8fa] border-[#b3b6f7] font-bold"
                        : "bg-white border-[#ededf7]"
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                {page < totalPages && (
                  <button
                    className="px-3 py-1 rounded border bg-white border-[#ededf7]"
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                )}
              </nav>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
