"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, Video, Star, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
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

type ReviewPayload = {
  professionalId?: string;
  rating?: number;
  review?: string;
};

// Extract YouTube video ID from embed or watch URL
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

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Submit review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  // Always load from API (not sessionStorage) so refresh doesn't lose data
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

  // Fetch professionalId once item is loaded
  useEffect(() => {
    if (!item) return;
    const fetchProfId = async () => {
      const contentId = item.contentId;
      const profName = item.source || item.provider || "";
      const params = new URLSearchParams();
      if (contentId) params.set("contentId", contentId);
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

  // Fetch all reviews for this professional
  useEffect(() => {
    if (!professionalId) return;
    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/student/professional-reviews?professionalId=${professionalId}`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { reviews: ReviewRecord[] };
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        }
      } catch { /* ignore */ }
      setReviewsLoading(false);
    };
    void loadReviews();
  }, [professionalId]);

  const handleOpen = () => {
    let url = item?.accessUrl || "";
    // Convert YouTube embed/watch URL
    const ytId = getYouTubeId(url);
    if (ytId) url = `https://www.youtube.com/watch?v=${ytId}`;
    // Book fallback
    if (!url && item?.type === "book") url = "https://www.w3schools.com";
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setReviewError("Please select a star rating."); return; }
    if (reviewText.trim().length < 5) { setReviewError("Please write at least 5 characters."); return; }
    if (!professionalId) { setReviewError("Could not find the professional. Please try again."); return; }

    setReviewLoading(true); setReviewError(""); setReviewSuccess("");
    try {
      const payload: ReviewPayload = { professionalId, rating, review: reviewText.trim() };
      const res = await fetch("/api/profile/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { message?: string; review?: ReviewRecord };
      if (!res.ok) { setReviewError(data.message || "Failed to submit review."); }
      else {
        setReviewSuccess("Review submitted successfully!");
        setRating(0); setReviewText("");
        // Add new review to list immediately
        if (data.review) setReviews((prev) => [data.review!, ...prev]);
      }
    } catch {
      setReviewError("Something went wrong. Please try again.");
    }
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e8f5f0] py-10 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-emerald-700 font-semibold mb-6 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>

          {/* Content Card */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
            {/* Thumbnail */}
            <div className="relative w-full h-52 overflow-hidden">
              {isVideo && ytThumbnail ? (
                <Image
                  src={ytThumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : isVideo ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50">
                  <Video className="h-20 w-20 text-orange-400" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 to-teal-50 gap-3">
                  <BookOpen className="h-20 w-20 text-cyan-500" />
                  <span className="text-cyan-700 font-semibold text-sm tracking-wide uppercase">Book</span>
                </div>
              )}
              {/* Play overlay for video */}
              {isVideo && ytThumbnail && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-red-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${isVideo ? "bg-orange-500" : "bg-cyan-600"}`}>
                  {isVideo ? "Video" : "Book"}
                </span>
                <span className="text-xs text-gray-400">by {professionalName}</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl font-bold text-emerald-600">{item.amount}</span>
                {purchasedDate && (
                  <span className="text-xs text-gray-400">
                    Purchased on {new Date(purchasedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>

              {(item.accessUrl || item.type === "book") ? (
                <button
                  onClick={handleOpen}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-base transition hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}
                >
                  <ExternalLink className="h-5 w-5" />
                  {isVideo ? "Watch on YouTube" : "Open Book / Resource"}
                </button>
              ) : (
                <div className="w-full py-3 rounded-2xl bg-gray-100 text-gray-400 text-center text-sm font-medium">
                  No access link available
                </div>
              )}
            </div>
          </div>

          {/* Submit Review */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Leave a Review</h2>
            <p className="text-sm text-gray-500 mb-5">
              Share your experience with <span className="font-semibold text-emerald-700">{professionalName}</span>
            </p>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Your Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className="h-8 w-8"
                        fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
                        stroke={(hoverRating || rating) >= star ? "#f59e0b" : "#d1d5db"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Your Review</p>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..." rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-400/40 resize-none"
                />
              </div>
              {reviewError && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{reviewError}</p>}
              {reviewSuccess && <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{reviewSuccess}</p>}
              <button type="submit" disabled={reviewLoading}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}
              >
                {reviewLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
              </button>
            </form>
          </div>

          {/* All Reviews */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Student Reviews
              {reviews.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length})</span>}
            </h2>
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No reviews yet. Be the first to review!</div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className={`rounded-2xl p-4 border ${r.studentId === session?.user?.id ? "border-emerald-200 bg-emerald-50/40" : "border-gray-100 bg-gray-50/50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          {r.studentName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {r.studentName}
                            {r.studentId === session?.user?.id && <span className="ml-1 text-xs text-emerald-600">(You)</span>}
                          </p>
                          <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className="h-4 w-4"
                            fill={r.rating >= s ? "#f59e0b" : "none"}
                            stroke={r.rating >= s ? "#f59e0b" : "#d1d5db"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{r.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
