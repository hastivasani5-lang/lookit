"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, Video, Star, ArrowLeft, ExternalLink, Loader2, Calendar, User } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ContentItem = {
  id: string;
  title: string;
  amount: string;
  contentId?: string;
  accessUrl?: string;
  source?: string;
  provider?: string;
  purchasedAt?: string;
  watchedAt?: string;
  type: "book" | "video";
};

type ReviewRecord = {
  id: string;
  studentId: string;
  studentName: string;
  rating: number;
  review: string;
  createdAt: string;
};

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];
  return null;
}

function StarRow({ value, size = 5 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`h-${size} w-${size}`}
          fill={value >= s ? "#f59e0b" : "none"}
          stroke={value >= s ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;
    const load = async () => {
      try {
        const res = await fetch("/api/student/content-detail?id=" + id, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { item: ContentItem };
          setItem(data.item);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    void load();
  }, [id, status, router]);

  useEffect(() => {
    if (!item) return;
    const fetchProfId = async () => {
      const params = new URLSearchParams();
      if (item.contentId) params.set("contentId", item.contentId);
      const profName = item.source || item.provider || "";
      if (profName) params.set("name", profName);
      try {
        const res = await fetch(`/api/student/content-professional?${params.toString()}`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { professionalId?: string };
          if (data.professionalId) setProfessionalId(data.professionalId);
        }
      } catch { /* ignore */ }
    };
    void fetchProfId();
  }, [item]);

  useEffect(() => {
    if (!professionalId) return;
    setReviewsLoading(true);
    fetch(`/api/student/professional-reviews?professionalId=${professionalId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { reviews?: ReviewRecord[] }) => setReviews(Array.isArray(data.reviews) ? data.reviews : []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [professionalId]);

  const handleOpen = () => {
    let url = item?.accessUrl || "";
    const ytId = getYouTubeId(url);
    if (ytId) url = `https://www.youtube.com/watch?v=${ytId}`;
    if (!url && item?.type === "book") url = "https://www.w3schools.com";
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setReviewError("Please select a star rating."); return; }
    if (reviewText.trim().length < 5) { setReviewError("Please write at least 5 characters."); return; }
    if (!professionalId) { setReviewError("Could not find the professional."); return; }
    setReviewLoading(true); setReviewError(""); setReviewSuccess("");
    try {
      const res = await fetch("/api/profile/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionalId, rating, review: reviewText.trim() }),
      });
      const data = (await res.json()) as { message?: string; review?: ReviewRecord };
      if (!res.ok) { setReviewError(data.message || "Failed to submit review."); }
      else {
        setReviewSuccess("Review submitted!");
        setRating(0); setReviewText("");
        if (data.review) setReviews((prev) => [data.review!, ...prev]);
      }
    } catch { setReviewError("Something went wrong."); }
    setReviewLoading(false);
  };

  if (loading || status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] gap-4">
          <p className="text-gray-500 text-lg">Content not found.</p>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-emerald-600 font-semibold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const isVideo = item.type === "video";
  const professionalName = item.source || item.provider || "Unknown";
  const purchasedDate = item.purchasedAt || item.watchedAt;
  const ytId = isVideo ? getYouTubeId(item.accessUrl || "") : null;
  const ytThumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e8f5f0] py-8 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-emerald-700 font-semibold mb-5 hover:underline text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* LEFT — Content Info (2/5) */}
            <div className="lg:col-span-2 space-y-4">

              {/* Thumbnail card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="relative w-full h-48">
                  {isVideo && ytThumbnail ? (
                    <>
                      <Image src={ytThumbnail} alt={item.title} fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : isVideo ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50">
                      <Video className="h-16 w-16 text-orange-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 to-teal-50 gap-2">
                      <BookOpen className="h-16 w-16 text-cyan-500" />
                      <span className="text-cyan-700 font-bold text-xs tracking-widest uppercase">Book</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${isVideo ? "bg-orange-500" : "bg-cyan-600"}`}>
                      {isVideo ? "Video" : "Book"}
                    </span>
                  </div>
                  <h1 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{item.title}</h1>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4 text-emerald-500" />
                      <span>by <span className="font-semibold text-gray-700">{professionalName}</span></span>
                    </div>
                    {purchasedDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        <span>{new Date(purchasedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-emerald-600">{item.amount}</span>
                    </div>
                  </div>

                  {/* Rating summary */}
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 p-2.5 bg-amber-50 rounded-xl">
                      <StarRow value={Math.round(avgRating)} size={4} />
                      <span className="text-sm font-bold text-amber-600">{avgRating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
                    </div>
                  )}

                  {/* Open button */}
                  <button onClick={handleOpen}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold text-sm transition hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}>
                    <ExternalLink className="h-4 w-4" />
                    {isVideo ? "Watch on YouTube" : "Open Book / Resource"}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — Reviews (3/5) */}
            <div className="lg:col-span-3 space-y-4">

              {/* Submit Review */}
              <div className="bg-white rounded-2xl shadow-md p-5">
                <h2 className="text-base font-bold text-gray-900 mb-3">Leave a Review</h2>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110">
                        <Star className="h-7 w-7"
                          fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
                          stroke={(hoverRating || rating) >= star ? "#f59e0b" : "#d1d5db"}
                        />
                      </button>
                    ))}
                    {rating > 0 && <span className="ml-2 text-xs text-amber-600 font-semibold">{["","Poor","Fair","Good","Very Good","Excellent"][rating]}</span>}
                  </div>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                    placeholder={`Share your experience with ${professionalName}...`} rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-400/40 resize-none"
                  />
                  {reviewError && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{reviewError}</p>}
                  {reviewSuccess && <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{reviewSuccess}</p>}
                  <button type="submit" disabled={reviewLoading}
                    className="w-full py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}>
                    {reviewLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
                  </button>
                </form>
              </div>

              {/* All Reviews */}
              <div className="bg-white rounded-2xl shadow-md p-5">
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  Student Reviews
                  {reviews.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length})</span>}
                </h2>
                {reviewsLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-emerald-500" /></div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">No reviews yet. Be the first!</div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {reviews.map((r) => (
                      <div key={r.id} className={`rounded-xl p-3 border ${r.studentId === session?.user?.id ? "border-emerald-200 bg-emerald-50/50" : "border-gray-100 bg-gray-50/60"}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {r.studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-800 leading-none">
                                {r.studentName}
                                {r.studentId === session?.user?.id && <span className="ml-1 text-emerald-600">(You)</span>}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                            </div>
                          </div>
                          <StarRow value={r.rating} size={3} />
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed pl-9">{r.review}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
