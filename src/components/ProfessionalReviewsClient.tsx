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
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#effaf6] text-[#1ec28e]">
              <Star className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Reviews</h2>
            <p className="text-sm text-slate-500">All submitted reviews for your profile, updated live.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void loadReviews()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <span className="text-xs text-slate-400">
              {lastUpdated ? `Updated: ${formatDate(lastUpdated)}` : "Waiting..."}
            </span>
          </div>
        </div>

        {error ? (
          <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1ec28e] border-t-transparent" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
            <Star className="h-10 w-10 opacity-30" />
            <p className="text-sm">No reviews yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <div key={review.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition">
                {/* Avatar */}
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#effaf6] text-sm font-bold text-[#1ec28e]">
                  {review.studentName.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{review.studentName}</p>
                    <p className="text-xs text-slate-400">{review.studentEmail}</p>
                    {/* Star rating */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <span className="rounded-full bg-[#effaf6] px-2 py-0.5 text-[11px] font-semibold text-[#1ec28e]">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{review.review}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(review.createdAt)}</p>
                </div>

                {/* Live dot */}
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
