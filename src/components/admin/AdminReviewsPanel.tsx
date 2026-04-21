import { Star, Trash2 } from "lucide-react";

type ReviewEntry = {
  id: string;
  userName: string;
  professionalName: string;
  professionalDetails: string;
  review: string;
  rating: number;
  createdAt: string;
  flagged: boolean;
};

type AdminReviewsPanelProps = {
  reviewCounts: { total: number; flagged: number };
  reviewsError: string;
  reviewsLoading: boolean;
  reviewEntries: ReviewEntry[];
  paginatedReviewEntries: ReviewEntry[];
  reviewsPageStart: number;
  itemsPerPage: number;
  reviewsCurrentPage: number;
  reviewsTotalPages: number;
  onDeleteReview: (id: string) => void | Promise<void>;
  onReviewsPageChange: (page: number) => void;
};

const getInitials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "NA";

export default function AdminReviewsPanel({
  reviewCounts,
  reviewsError,
  reviewsLoading,
  reviewEntries,
  paginatedReviewEntries,
  reviewsPageStart,
  itemsPerPage,
  reviewsCurrentPage,
  reviewsTotalPages,
  onDeleteReview,
  onReviewsPageChange,
}: AdminReviewsPanelProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-xs text-slate-500">Total Reviews</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{reviewCounts.total}</p>
        </div>
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-xs text-slate-500">Flagged Reviews</p>
          <p className="mt-1 text-2xl font-semibold text-[#cc2a2a]">{reviewCounts.flagged}</p>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {reviewsError ? (
          <li className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">{reviewsError}</li>
        ) : null}

        {reviewsLoading ? (
          <li className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">Loading reviews...</li>
        ) : null}

        {!reviewsLoading && reviewEntries.length === 0 ? (
          <li className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">No reviews found.</li>
        ) : null}

        {!reviewsLoading && paginatedReviewEntries.length > 0 ? (
          <li className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 lg:block">
            <div className="grid grid-cols-[1.1fr_1.3fr_2.4fr_0.8fr_1.3fr_0.8fr] gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Student</span>
              <span>Professional</span>
              <span>Review</span>
              <span>Rating</span>
              <span>Date</span>
              <span className="text-right">Action</span>
            </div>
          </li>
        ) : null}

        {!reviewsLoading &&
          paginatedReviewEntries.map((review) => (
            <li
              key={review.id}
              className={`rounded-2xl border px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-5 ${review.flagged ? "border-red-200 bg-red-50/60" : "border-slate-200 bg-white"}`}
            >
              <div className="grid gap-4 lg:grid-cols-[1.1fr_1.3fr_2.4fr_0.8fr_1.3fr_0.8fr] lg:items-start">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">Student</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {getInitials(review.userName)}
                    </span>
                    <p className="text-sm font-semibold text-slate-800">{review.userName}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">Professional</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                      {getInitials(review.professionalName)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{review.professionalName}</p>
                      <p className="text-xs text-slate-500">{review.professionalDetails}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">Review</p>
                  <div className="mt-1 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2">
                    <p className="text-sm leading-6 text-slate-700">"{review.review}"</p>
                  </div>
                  {review.flagged ? (
                    <span className="mt-2 inline-flex rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                      Flagged
                    </span>
                  ) : null}
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">Rating</p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {review.rating}/5
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">Date</p>
                  <span className="mt-1 inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 sm:text-sm">
                    {review.createdAt}
                  </span>
                </div>

                <div className="flex lg:justify-end">
                  <button
                    type="button"
                    onClick={() => void onDeleteReview(review.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>

      {!reviewsLoading && reviewEntries.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f9fbfb] p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>
                Showing {Math.min(reviewsPageStart + 1, reviewEntries.length)} to {Math.min(reviewsPageStart + itemsPerPage, reviewEntries.length)} of {reviewEntries.length} entries
              </span>
              <span className="rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-2.5 py-0.5 text-xs font-semibold text-[#178c43]">
                Page {reviewsCurrentPage} / {reviewsTotalPages}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onReviewsPageChange(Math.max(1, reviewsCurrentPage - 1))}
                disabled={reviewsCurrentPage === 1}
                className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Prev
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: reviewsTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onReviewsPageChange(page)}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl border text-xs font-semibold transition ${
                      page === reviewsCurrentPage
                        ? "border-[#178c43] bg-[#178c43] text-white shadow-[0_8px_18px_rgba(23,140,67,0.25)]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onReviewsPageChange(Math.min(reviewsTotalPages, reviewsCurrentPage + 1))}
                disabled={reviewsCurrentPage === reviewsTotalPages}
                className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
