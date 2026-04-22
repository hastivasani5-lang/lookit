"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { addCartItem, getCartItems } from "@/lib/cart-store";
import type { ShopCatalogItem } from "@/lib/shop-catalog";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type StudentLibrary = {
  purchasedBooks: { id: string; contentId?: string; title: string; accessUrl?: string }[];
  watchedVideos: { id: string; contentId?: string; title: string; accessUrl?: string }[];
};

export default function DetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const slugValue = typeof slug === "string" ? slug : "";
  const { data: session } = useSession();

  const [item, setItem] = useState<ShopCatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [showContent, setShowContent] = useState(false);

  // Student purchased library
  const [studentLibrary, setStudentLibrary] = useState<StudentLibrary | null>(null);
  const [libraryLoading, setLibraryLoading] = useState(false);

  // Load item
  useEffect(() => {
    let isActive = true;
    const loadItem = async () => {
      if (!slugValue) {
        setLoadError("Invalid product slug");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await fetch(`/api/shop/items/${slugValue}`, { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as { item?: ShopCatalogItem; message?: string };
        if (!isActive) return;
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
        if (isActive) setIsLoading(false);
      }
    };
    void loadItem();
    return () => { isActive = false; };
  }, [slugValue]);

  // Load student library if logged in as student
  useEffect(() => {
    if (!session?.user?.id || session.user.role !== "student") return;
    setLibraryLoading(true);
    fetch("/api/student/library")
      .then((r) => r.json())
      .then((data: StudentLibrary) => setStudentLibrary(data))
      .catch(() => setStudentLibrary(null))
      .finally(() => setLibraryLoading(false));
  }, [session]);

  // Cart state
  useEffect(() => {
    setIsAdded(Boolean(item && getCartItems().some((entry) => entry.id === item.id)));
    const handleStorage = () => {
      setIsAdded(Boolean(item && getCartItems().some((entry) => entry.id === item.id)));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [item]);

  const isFree = useMemo(() => Boolean(item && item.amount === 0), [item]);

  // Check if THIS student has purchased THIS specific item (by contentId only)
  const hasPurchased = useMemo(() => {
    if (!studentLibrary || !item) return false;
    if (item.contentType === "book") {
      return studentLibrary.purchasedBooks.some(
        (b) => b.contentId === item.contentId
      );
    }
    return studentLibrary.watchedVideos.some(
      (v) => v.contentId === item.contentId
    );
  }, [studentLibrary, item]);

  // canAccess: free content OR this student has purchased
  const canAccess = isFree || hasPurchased;

  const heroLabel = useMemo(() => item?.title || "Shop Details", [item]);
  const imageSrc = item?.imageUrl || "/instructor.avif";

  const parsedPrice = useMemo(() => {
    if (!item) return null;
    const amount = Number.parseFloat(item.price.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      return { current: item.price, original: null };
    }
    const symbolMatch = item.price.match(/^[^\d]+/);
    const symbol = symbolMatch ? symbolMatch[0] : "₹";
    const originalAmount = amount + Math.max(10, Math.round(amount * 0.35));
    return {
      current: `${symbol}${amount.toFixed(0)}`,
      original: `${symbol}${originalAmount.toFixed(0)}`,
    };
  }, [item]);

  const handleAddToCart = () => {
    if (!item) return;
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

  // Open PDF or video - toggle inline viewer
  const handleOpenContent = () => {
    if (!item) return;
    setShowContent((prev) => !prev);
  };

  const contentUrl = item ? (item.fileUrl || item.sourceUrl || "") : "";

  // PDF Viewer component
  function PdfViewer({ url, title, sizeLabel, professionalName, contentId }: {
    url: string; title: string; sizeLabel: string; professionalName: string; contentId: string;
  }) {
    const [pdfError, setPdfError] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      // Check if the API endpoint has a real file
      if (url.startsWith("/api/")) {
        fetch(url, { method: "HEAD" })
          .then((r) => { setPdfError(!r.ok); setChecking(false); })
          .catch(() => { setPdfError(true); setChecking(false); });
      } else if (url.startsWith("/uploads/")) {
        setChecking(false); setPdfError(false);
      } else {
        setChecking(false); setPdfError(true);
      }
    }, [url]);

    if (checking) {
      return (
        <div className="flex items-center justify-center py-16 bg-[#f8f8f8] rounded-lg">
          <div className="w-8 h-8 border-4 border-[#17c28a] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (pdfError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-[#f8f8f8] rounded-lg">
          <span className="text-5xl mb-4">📄</span>
          <p className="font-semibold text-gray-700 text-lg">PDF Preview Not Available</p>
          <p className="text-sm mt-2 max-w-md text-gray-500">
            This book ({sizeLabel}) was uploaded before server storage was enabled.
            The professional needs to re-upload the PDF file.
          </p>
          <p className="text-xs mt-3 text-gray-400">By: {professionalName}</p>
        </div>
      );
    }

    return (
      <div className="w-full rounded-lg overflow-hidden border border-[#e0e0e0]" style={{ height: "80vh" }}>
        <iframe
          src={url}
          title={title}
          className="w-full h-full"
          style={{ border: "none" }}
        />
      </div>
    );
  }

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
          <Link href="/shop" className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90">
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

      {/* Hero Banner */}
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

              {/* Image */}
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

              {/* Details */}
              <div className="max-w-[690px]">
                <h2 className="text-[38px] font-semibold leading-tight text-[#13253f]">{item.title}</h2>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-[16px] tracking-[1px] text-[#ff9b1f]">★★★★★</span>
                  <span className="text-[#8a928f]">(02 Reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-end gap-3">
                  {isFree ? (
                    <span className="text-[32px] font-bold leading-none text-[#18ba8a]">Free</span>
                  ) : (
                    <>
                      <span className="text-[32px] font-bold leading-none text-[#18ba8a]">
                        {parsedPrice?.current ?? item.price}
                      </span>
                      {parsedPrice?.original && (
                        <span className="text-lg font-semibold text-[#9da7a3] line-through">{parsedPrice.original}</span>
                      )}
                    </>
                  )}
                </div>

                <p className="mt-5 max-w-[640px] text-[14px] leading-7 text-[#6f7674]">{item.description}</p>

                {/* Action Buttons */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {libraryLoading ? (
                    <div className="h-[44px] w-32 rounded-full bg-gray-200 animate-pulse" />
                  ) : isFree ? (
                    /* FREE content → direct access, no cart */
                    <button
                      type="button"
                      onClick={handleOpenContent}
                      className="inline-flex h-[44px] items-center rounded-full bg-[#17c28a] px-7 text-[14px] font-semibold text-white transition hover:bg-[#11ab78]"
                    >
                      {item.contentType === "video"
                        ? (showContent ? "▼ Hide Video" : "▶ Watch Now")
                        : (showContent ? "▼ Hide PDF" : "📄 Read / View PDF")}
                    </button>
                  ) : hasPurchased ? (
                    /* PAID + this student already purchased → direct access */
                    <button
                      type="button"
                      onClick={handleOpenContent}
                      className="inline-flex h-[44px] items-center rounded-full bg-[#17c28a] px-7 text-[14px] font-semibold text-white transition hover:bg-[#11ab78]"
                    >
                      {item.contentType === "video"
                        ? (showContent ? "▼ Hide Video" : "▶ Watch Now")
                        : (showContent ? "▼ Hide PDF" : "📄 Read / View PDF")}
                    </button>
                  ) : session?.user?.role === "student" ? (
                    /* PAID + student not yet purchased → Add to Cart */
                    <>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="inline-flex h-[44px] items-center rounded-full bg-[#17c28a] px-7 text-[14px] font-semibold text-white transition hover:bg-[#11ab78]"
                      >
                        {isAdded ? "✓ Added to Cart" : "Add to Cart"}
                      </button>
                      {isAdded && (
                        <Link
                          href="/cart"
                          className="inline-flex h-[44px] items-center rounded-full border border-[#17c28a] px-7 text-[14px] font-semibold text-[#17c28a] transition hover:bg-[#17c28a] hover:text-white no-underline"
                        >
                          Go to Cart
                        </Link>
                      )}
                    </>
                  ) : (
                    /* Not logged in or not a student */
                    <Link
                      href="/login"
                      className="inline-flex h-[44px] items-center rounded-full bg-[#17c28a] px-7 text-[14px] font-semibold text-white transition hover:bg-[#11ab78] no-underline"
                    >
                      Login to Purchase
                    </Link>
                  )}
                </div>

                {/* Access note */}
                {!isFree && hasPurchased && (
                  <p className="mt-3 text-sm text-[#17c28a] font-medium">✓ You have purchased this item</p>
                )}
                {!isFree && !hasPurchased && session?.user?.role === "student" && (
                  <p className="mt-3 text-sm text-gray-500">Purchase this item to get full access.</p>
                )}
                {isFree && (
                  <p className="mt-3 text-sm text-[#17c28a] font-medium">✓ This content is free to access</p>
                )}

                {/* Meta */}
                <div className="mt-7 space-y-3 text-[14px] text-[#717a77]">
                  <p>
                    <span className="font-semibold text-[#2f3f53]">By</span>
                    <span className="mx-2">{item.professionalName}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-[#2f3f53]">Category</span>
                    <span className="mx-2">:</span>
                    {item.category}
                  </p>
                  <p>
                    <span className="font-semibold text-[#2f3f53]">Type</span>
                    <span className="mx-2">:</span>
                    {item.contentType === "book" ? "📚 Book" : "🎬 Video"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#2f3f53]">Size</span>
                    <span className="mx-2">:</span>
                    {item.sizeLabel}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Inline Content Viewer */}
          {showContent && canAccess && (
            <section className="mt-8 rounded-[10px] bg-white px-5 py-6 shadow-[0_14px_48px_rgba(10,26,37,0.06)] md:px-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#13253f]">
                  {item.contentType === "video" ? "▶ Video Player" : "📄 PDF Viewer"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowContent(false)}
                  className="text-sm text-gray-400 hover:text-gray-700 transition"
                >
                  ✕ Close
                </button>
              </div>

              {item.contentType === "video" ? (
                /* Video */
                contentUrl ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={contentUrl}
                      title={item.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 bg-[#f8f8f8] rounded-lg">
                    <span className="text-4xl mb-3">🎬</span>
                    <p className="font-semibold text-gray-700">Video not available</p>
                    <p className="text-sm mt-1">The professional has not uploaded a video link yet.</p>
                  </div>
                )
              ) : (
                /* Book / PDF */
                <PdfViewer url={contentUrl} title={item.title} sizeLabel={item.sizeLabel} professionalName={item.professionalName} contentId={item.contentId} />
              )}
            </section>
          )}

          {/* Tabs */}
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
                  {item.description}{" "}
                  Educate the ultimate destination for knowledge seekers and educators alike — committed to transforming
                  special education and delivering impactful content to learners worldwide.
                </p>
              ) : (
                <p className="text-[13px] leading-7 text-[#6f7674]">No reviews available yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
