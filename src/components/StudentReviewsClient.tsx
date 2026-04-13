"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Star } from "lucide-react";

type ProfessionalOption = {
  id: string;
  name: string;
  email: string;
  specialization: string;
};

type StudentReviewsClientProps = {
  professionals: ProfessionalOption[];
};

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
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function StudentReviewsClient({ professionals }: StudentReviewsClientProps) {
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id ?? "");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState<ReviewRow[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const selectedProfessional = useMemo(
    () => professionals.find((professional) => professional.id === professionalId) ?? professionals[0] ?? null,
    [professionals, professionalId],
  );

  const loadReviews = async () => {
    setLoadingReviews(true);

    try {
      const response = await fetch("/api/profile/reviews", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as ReviewsPayload;

      if (!response.ok) {
        setSubmittedReviews([]);
        return;
      }

      setSubmittedReviews(Array.isArray(payload.reviews) ? payload.reviews : []);
      setLastUpdated(payload.lastUpdated ?? null);
    } catch {
      setSubmittedReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/profile/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionalId, rating, review }),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setError(payload.message || "Unable to submit review.");
        return;
      }

      setMessage("Review submitted successfully.");
      setReview("");
      setRating(5);
      await loadReviews();
    } catch {
      setError("Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleSubmit} className="rounded-[24px] bg-[#eef5f3] p-6 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff]">
        <div className="flex items-center justify-between gap-4 border-b border-white/70 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Write a Review</h2>
            <p className="text-sm text-slate-500">Share your experience with a professional.</p>
          </div>
          <Star className="h-5 w-5 text-[#1ec28e]" />
        </div>

        <div className="mt-5 space-y-4">
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Professional
            <select
              value={professionalId}
              onChange={(event) => setProfessionalId(event.target.value)}
              className="h-12 w-full rounded-full border-none bg-[#f6fefb] px-4 text-slate-900 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff] outline-none focus:ring-2 focus:ring-[#1ec28e]"
            >
              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.name} — {professional.specialization}
                </option>
              ))}
            </select>
          </label>

          {selectedProfessional ? (
            <div className="rounded-2xl bg-white p-4 shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]">
              <p className="text-sm font-semibold text-slate-900">Selected professional</p>
              <p className="mt-1 text-sm text-slate-600">{selectedProfessional.name}</p>
              <p className="text-xs text-slate-500">{selectedProfessional.specialization}</p>
            </div>
          ) : null}

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Rating
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="h-12 w-full rounded-full border-none bg-[#f6fefb] px-4 text-slate-900 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff] outline-none focus:ring-2 focus:ring-[#1ec28e]"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Your review
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              rows={6}
              placeholder="Write about your experience, teaching quality, clarity, and support."
              className="w-full rounded-3xl border-none bg-[#f6fefb] px-4 py-3 text-sm text-slate-900 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff] outline-none focus:ring-2 focus:ring-[#1ec28e]"
            />
          </label>
        </div>

        {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {message ? <div className="mt-5 rounded-2xl border border-[#bfe9cb] bg-[#e8f9ee] px-4 py-3 text-sm text-[#178c43]">{message}</div> : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1ec28e] px-5 text-sm font-medium text-white transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
        </form>

        <aside className="rounded-[24px] bg-[#eef5f3] p-6 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff]">
          <h3 className="text-lg font-semibold text-slate-900">How it works</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Choose the professional you want to review.</li>
            <li>• Give a rating and write your feedback.</li>
            <li>• The review appears instantly on the professional dashboard page.</li>
          </ul>
          <div className="mt-6 rounded-2xl bg-[#f6fefb] p-4 text-sm text-slate-600 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff]">
            Reviews are stored centrally so professionals can see them in real time.
          </div>
        </aside>
      </div>

      <div className="rounded-[24px] bg-[#eef5f3] p-6 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff]">
        <div className="flex flex-col gap-2 border-b border-white/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Your Submitted Reviews</h3>
            <p className="text-sm text-slate-500">These reviews are saved and will remain visible after refresh.</p>
          </div>
          <p className="text-xs text-slate-500">{lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : "Live data"}</p>
        </div>

        {loadingReviews ? (
          <div className="mt-4 rounded-2xl bg-[#f6fefb] px-4 py-6 text-sm text-slate-500 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff]">
            Loading saved reviews...
          </div>
        ) : submittedReviews.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-[#f6fefb] px-4 py-6 text-sm text-slate-500 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff]">
            No reviews submitted yet.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {submittedReviews.map((entry) => (
              <article key={entry.id} className="rounded-[24px] bg-white p-5 shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{entry.professionalName}</p>
                    <p className="text-xs text-slate-500">{entry.studentName}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f9ee] px-3 py-1 text-xs font-semibold text-[#178c43]">
                    <Star className="h-3.5 w-3.5" />
                    {entry.rating}/5
                  </span>
                </div>

                <div className="mt-4 rounded-2xl bg-[#f6fefb] p-4 text-sm text-slate-600">
                  <p className="leading-7">{entry.review}</p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5 text-[#1ec28e]" />
                  {formatDate(entry.createdAt)}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
