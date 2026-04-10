import React from "react";
import NeumorphListCard from "./NeumorphListCard";
import { Trash2 } from "lucide-react";

interface ReviewEntry {
  id: number;
  userName: string;
  professionalName: string;
  professionalDetails: string;
  review: string;
  rating: number;
  createdAt: string;
  flagged: boolean;
}

interface ReviewsListProps {
  reviewEntries: ReviewEntry[];
  deleteReview: (id: number) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviewEntries, deleteReview }) => (
  <ul className="flex flex-col gap-3">
    {reviewEntries.map((review) => (
      <NeumorphListCard
        key={review.id}
        className={review.flagged ? "bg-[#fff1f1]" : "bg-white"}
      >
        <div className="flex-1 min-w-[120px] font-medium text-slate-800">{review.userName}</div>
        <div className="flex-1 min-w-[120px]">
          <div className="font-medium text-slate-800">{review.professionalName}</div>
          <div className="text-xs text-slate-500">{review.professionalDetails}</div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="max-w-xl space-y-1">
            <p className="text-slate-700">{review.review}</p>
            {review.flagged ? (
              <span className="inline-flex rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#cc2a2a]">
                Flagged as inappropriate
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex-1 min-w-[60px] font-semibold text-slate-800">{review.rating}/5</div>
        <div className="flex-1 min-w-[100px] text-slate-600">{review.createdAt}</div>
        <div className="flex flex-1 justify-end min-w-[120px]">
          <button
            type="button"
            onClick={() => deleteReview(review.id)}
            className="inline-flex items-center gap-1 rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </NeumorphListCard>
    ))}
  </ul>
);

export default ReviewsList;
