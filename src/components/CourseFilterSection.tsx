"use client";

type CourseFilterSectionProps = {
  categories: string[];
  selectedCategory: string;
  selectedReview: string;
  selectedRating: string;

  onCategoryChange: (value: string) => void;
  onReviewChange: (value: string) => void;
  onRatingChange: (value: string) => void;
};

export default function CourseFilterSection({
  categories,
  selectedCategory,
  selectedReview,
  selectedRating,
  onCategoryChange,
  onReviewChange,
  onRatingChange,
}: CourseFilterSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#0f172a]">
          Filter
        </h2>
        <button className="text-sm text-[#1ec28e] hover:underline">
          Clear All
        </button>
      </div>

      {/* CATEGORY */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Category
        </h3>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Price
        </h3>
        <select className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm">
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* LEVEL */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Level
        </h3>
        <select className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm">
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* DURATION */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Duration
        </h3>
        <select className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm">
          <option value="all">All Durations</option>
          <option value="0-5">0–5 Hours</option>
          <option value="5-10">5–10 Hours</option>
          <option value="10+">10+ Hours</option>
        </select>
      </div>

      {/* LANGUAGE */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Language
        </h3>
        <select className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm">
          <option value="all">All Languages</option>
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
      </div>

      {/* REVIEW */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Reviews
        </h3>
        <select
          value={selectedReview}
          onChange={(e) => onReviewChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
        >
          <option value="all">All Reviews</option>
          <option value="100+">100+ Reviews</option>
          <option value="300+">300+ Reviews</option>
          <option value="500+">500+ Reviews</option>
        </select>
      </div>

      {/* RATING */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Rating
        </h3>
        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
        >
          <option value="all">All Ratings</option>
          <option value="4+">4.0+</option>
          <option value="4.5+">4.5+</option>
        </select>
      </div>

    </div>
  );
}