"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, Star, Users } from "lucide-react";

type ReviewRow = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  professionalId: string;
  professionalName: string;
  rating: number;
  review: string;
  createdAt: string;
};

type ReviewsPayload = {
  reviews?: ReviewRow[];
  totalReviews?: number;
  averageRating?: number;
  lastUpdated?: string;
  message?: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function ProfessionalReviewsClient() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadReviews = async (background = false) => {
    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/profile/reviews", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as ReviewsPayload;

      if (!response.ok) {
        setError(payload.message || "Unable to load reviews.");
        return;
      }

      setReviews(Array.isArray(payload.reviews) ? payload.reviews : []);
      setTotalReviews(typeof payload.totalReviews === "number" ? payload.totalReviews : 0);
      setAverageRating(typeof payload.averageRating === "number" ? payload.averageRating : 0);
      setLastUpdated(payload.lastUpdated ?? null);
    } catch {
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadReviews();

    const interval = setInterval(() => {
      void loadReviews(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: "Total Reviews", value: totalReviews },
      { label: "Average Rating", value: averageRating.toFixed(1) },
      { label: "Five Star Reviews", value: reviews.filter((review) => review.rating === 5).length },
    ],
    [averageRating, reviews, totalReviews],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-[24px] bg-[#eef5f3] p-5 shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] bg-[#eef5f3] p-5 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff]">
        <div className="flex flex-col gap-3 border-b border-white/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Student Reviews</h2>
            <p className="text-sm text-slate-500">All submitted reviews for your profile, updated live.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void loadReviews()}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1ec28e] px-4 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <div className="text-xs text-slate-500">{lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : "Waiting for updates..."}</div>
          </div>
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {loading ? (
          <div className="mt-4 rounded-2xl bg-[#f6fefb] px-4 py-6 text-sm text-slate-500 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff]">
            Loading live reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-[#f6fefb] px-4 py-6 text-sm text-slate-500 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff]">
            No reviews yet.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-[24px] bg-white p-5 shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{review.studentName}</p>
                    <p className="text-xs text-slate-500">{review.studentEmail}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f9ee] px-3 py-1 text-xs font-semibold text-[#178c43]">
                    <Star className="h-3.5 w-3.5" />
                    {review.rating}/5
                  </span>
                </div>

                <div className="mt-4 rounded-2xl bg-[#f6fefb] p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">{review.professionalName}</p>
                  <p className="mt-1 leading-7">{review.review}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Submitted: {formatDate(review.createdAt)}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f6fefb] px-3 py-1 font-semibold text-[#2c5a48]">
                    <Users className="h-3.5 w-3.5" />
                    Live
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
