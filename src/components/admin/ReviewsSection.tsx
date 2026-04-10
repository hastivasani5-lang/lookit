import React from "react";
import ReviewsList from "./ReviewsList";

interface ReviewsSectionProps {
  reviewEntries: any[];
  reviewCounts: { total: number; flagged: number };
  deleteReview: (id: number) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviewEntries, reviewCounts, deleteReview }) => (
  <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl bg-[#f8fafc] p-4">
        <p className="text-sm text-slate-500">Total Reviews</p>
        <p className="mt-1 text-2xl font-semibold text-slate-800">{reviewCounts.total}</p>
      </div>
      <div className="rounded-xl bg-[#f8fafc] p-4">
        <p className="text-sm text-slate-500">Flagged Reviews</p>
        <p className="mt-1 text-2xl font-semibold text-[#cc2a2a]">{reviewCounts.flagged}</p>
      </div>
    </div>
    <ReviewsList reviewEntries={reviewEntries} deleteReview={deleteReview} />
  </div>
);

export default ReviewsSection;
