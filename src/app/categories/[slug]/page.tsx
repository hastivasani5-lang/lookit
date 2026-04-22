"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "../../../data/categories";
import Link from "next/link";
import { ArrowLeft, BookOpen, Video, LayoutGrid, List, SlidersHorizontal } from "lucide-react";

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

function YouTubeThumbnail({ url }: { url: string }) {
  const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  return (
    <img src={`https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`} alt="thumb" className="w-full h-full object-cover" />
  );
}

export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const category = categories.find((cat) => cat.slug === slug);

  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Price:High-to-Low");
  const [view, setView] = useState<"list" | "grid">("grid");
  const [typeFilter, setTypeFilter] = useState<"all" | "book" | "video">("all");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/categories/${slug}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!category) return notFound();

  const filtered = items.filter((item) => typeFilter === "all" ? true : item.contentType === typeFilter);
  const sorted = [...filtered].sort((a, b) => sort === "Price:High-to-Low" ? b.amount - a.amount : a.amount - b.amount);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isEmpty = !loading && sorted.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafb]">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 60%, #34d399 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <Link href="/categories" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition no-underline">
            <ArrowLeft size={16} /> Back to Categories
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{category.title}</h1>
          <p className="mt-2 text-white/70 text-sm">
            {sorted.length} {sorted.length === 1 ? "item" : "items"} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Type tabs */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400" />
            {(["all", "book", "video"] as const).map((t) => (
              <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  typeFilter === t
                    ? "bg-[#1ec28e] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {t === "book" && <BookOpen size={14} />}
                {t === "video" && <Video size={14} />}
                {t === "all" ? "All" : t === "book" ? "Books" : "Videos"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#1ec28e]"
              value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
              <option value="Price:High-to-Low">Price: High → Low</option>
              <option value="Price:Low-to-High">Price: Low → High</option>
            </select>

            {/* View toggle */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition ${view === "grid" ? "bg-white shadow text-[#1ec28e]" : "text-gray-400"}`}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setView("list")} className={`p-2 rounded-lg transition ${view === "list" ? "bg-white shadow text-[#1ec28e]" : "text-gray-400"}`}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-[#1ec28e] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-[#effaf6] flex items-center justify-center mb-4">
              <BookOpen size={32} className="text-[#1ec28e]" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Content Yet</h2>
            <p className="text-gray-500 max-w-sm text-sm">No books or videos in <span className="font-semibold text-[#1ec28e]">{category.title}</span> yet. Check back soon!</p>
            <Link href="/categories" className="mt-6 inline-flex items-center gap-2 bg-[#1ec28e] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#17a87a] transition no-underline">
              <ArrowLeft size={16} /> Browse Categories
            </Link>
          </div>
        )}

        {/* Grid View */}
        {!loading && !isEmpty && view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                {/* Thumbnail */}
                <div className="relative h-44 bg-[#f0faf6] overflow-hidden">
                  {item.contentType === "video" && item.sourceType === "youtube" && item.sourceUrl
                    ? <YouTubeThumbnail url={item.sourceUrl} />
                    : item.imageUrl
                    ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : <div className="w-full h-full flex items-center justify-center">
                        {item.contentType === "book" ? <BookOpen size={40} className="text-[#1ec28e]/40" /> : <Video size={40} className="text-[#1ec28e]/40" />}
                      </div>
                  }
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-lg text-white ${item.contentType === "book" ? "bg-[#1ec28e]" : "bg-red-500"}`}>
                    {item.contentType === "book" ? "Book" : "Video"}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 mb-1">By <span className="text-[#1ec28e] font-semibold">{item.professionalName}</span></p>
                  <p className="text-xs text-gray-400 mb-3">📁 {item.sizeLabel}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[#1ec28e] text-lg">{item.price}</span>
                    <Link href={`/shop/details/${item.slug}`}
                      className="bg-[#1ec28e] hover:bg-[#17a87a] text-white px-4 py-2 rounded-xl text-sm font-semibold transition no-underline">
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
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#f0faf6] flex items-center justify-center shrink-0 overflow-hidden">
                  {item.contentType === "video" && item.sourceType === "youtube" && item.sourceUrl
                    ? <YouTubeThumbnail url={item.sourceUrl} />
                    : item.imageUrl
                    ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : item.contentType === "book" ? <BookOpen size={24} className="text-[#1ec28e]/60" /> : <Video size={24} className="text-[#1ec28e]/60" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 text-xs font-bold rounded-md ${item.contentType === "book" ? "bg-[#effaf6] text-[#1ec28e]" : "bg-red-50 text-red-500"}`}>
                      {item.contentType === "book" ? "Book" : "Video"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">By <span className="text-[#1ec28e] font-semibold">{item.professionalName}</span> · {item.sizeLabel}</p>
                  <p className="font-bold text-[#1ec28e] mt-1">{item.price}</p>
                </div>
                <Link href={`/shop/details/${item.slug}`}
                  className="shrink-0 bg-[#1ec28e] hover:bg-[#17a87a] text-white px-5 py-2 rounded-xl text-sm font-semibold transition no-underline">
                  View
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${page === i + 1 ? "bg-[#1ec28e] text-white shadow" : "bg-white border border-gray-200 text-gray-600 hover:border-[#1ec28e]"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
