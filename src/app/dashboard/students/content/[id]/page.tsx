"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, Video, Star, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ContentItem = {
  id: string;
  title: string;
  amount: string;
  contentId?: string;
  accessUrl?: string;
  source?: string;   // for books = professionalName
  provider?: string; // for videos = professionalName
  purchasedAt?: string;
  watchedAt?: string;
  type: "book" | "video";
};

type ReviewPayload = {
  professionalId?: string;
  rating?: number;
  review?: string;
};

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;

    // Read from localStorage (cart-store) or sessionStorage passed from dashboard
    const raw = sessionStorage.getItem("lookit-content-detail");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ContentItem;
        if (parsed.id === id) { setItem(parsed); setLoading(false); return; }
      } catch { /* ignore */ }
    }

    // Fallback: fetch from library API
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

  const handleOpen = () => {
    let url = item?.accessUrl || "";

    // Convert YouTube embed URL to watch URL
    if (url.includes("youtube.com/embed/")) {
      const videoId = url.split("/embed/")[1]?.split("?")[0];
      if (videoId) url = `https://www.youtube.com/watch?v=${videoId}`;
    }

    // For books with no URL, open W3Schools as default resource
    if (!url && item?.type === "book") {
      url = "https://www.w3schools.com";
    }

    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setReviewError("Please select a star rating."); return; }
    if (reviewText.trim().length < 5) { setReviewError("Please write at least 5 characters."); return; }

    setReviewLoading(true); setReviewError(""); setReviewSuccess("");

    try {
      // Find professionalId via contentId first, then fallback to name
      const contentId = item?.contentId;
      const profName = item?.source || item?.provider || "";
      let professionalId: string | null = null;

      const params = new URLSearchParams();
      if (contentId) params.set("contentId", contentId);
      if (profName) params.set("name", profName);

      const profRes = await fetch(`/api/student/content-professional?${params.toString()}`, { cache: "no-store" });
      if (profRes.ok) {
        const profData = (await profRes.json()) as { professionalId?: string };
        professionalId = profData.professionalId ?? null;
      }

      if (!professionalId) {
        setReviewError("Could not find the professional. Please try again.");
        setReviewLoading(false);
        return;
      }

      const payload: ReviewPayload = {
        professionalId,
        rating,
        review: reviewText.trim(),
      };

      const res = await fetch("/api/profile/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { message?: string };
      if (!res.ok) { setReviewError(data.message || "Failed to submit review."); }
      else {
        setReviewSuccess("Review submitted successfully!");
        setRating(0); setReviewText("");
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
            {/* Header banner */}
            <div className={`flex items-center justify-center h-48 ${isVideo ? "bg-gradient-to-br from-orange-100 to-amber-50" : "bg-gradient-to-br from-cyan-100 to-teal-50"}`}>
              {isVideo
                ? <Video className="h-20 w-20 text-orange-400" />
                : <BookOpen className="h-20 w-20 text-cyan-500" />
              }
            </div>

            <div className="p-6">
              {/* Badge + Title */}
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

              {/* Open Button */}
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

          {/* Review Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Leave a Review</h2>
            <p className="text-sm text-gray-500 mb-5">
              Share your experience with <span className="font-semibold text-emerald-700">{professionalName}</span>
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Your Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className="h-8 w-8"
                        fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
                        stroke={(hoverRating || rating) >= star ? "#f59e0b" : "#d1d5db"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Your Review</p>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-400/40 resize-none"
                />
              </div>

              {reviewError && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{reviewError}</p>}
              {reviewSuccess && <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{reviewSuccess}</p>}

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}
              >
                {reviewLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
