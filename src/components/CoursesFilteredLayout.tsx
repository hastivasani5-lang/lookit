"use client";

import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import CourseFilterSection from "@/components/CourseFilterSection";
import ContentTypeTabs, { type ContentType } from "@/components/ContentTypeTabs";
import CourseGridSection, {
  allBooks,
  allCourses,
  allOnlinePlatforms,
  allVideoLearnings,
} from "@/components/CourseGridSection";

type CoursesFilteredLayoutProps = {
  contentType?: ContentType;
  searchQuery?: string;
};

export default function CoursesFilteredLayout({
  contentType: initialContentType = "courses",
  searchQuery = "",
}: CoursesFilteredLayoutProps) {
  const [contentType, setContentType] = useState<ContentType>(initialContentType);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReview, setSelectedReview] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    if (!isFiltersOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFiltersOpen]);

  const activeItems = useMemo(() => {
    if (contentType === "books") {
      return allBooks;
    }
    if (contentType === "video-learning") {
      return allVideoLearnings;
    }
    if (contentType === "apps") {
      return allOnlinePlatforms;
    }
    return allCourses;
  }, [contentType]);

  const categories = useMemo(
    () => Array.from(new Set(activeItems.map((course) => course.category))),
    [activeItems]
  );

  useEffect(() => {
    if (selectedCategory !== "all" && !categories.includes(selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

  const filteredCourses = useMemo(() => {
    return activeItems.filter((course) => {
      const searchMatch =
        normalizedSearchQuery.length === 0 ||
        course.title.toLowerCase().includes(normalizedSearchQuery) ||
        course.category.toLowerCase().includes(normalizedSearchQuery);

      const categoryMatch =
        selectedCategory === "all" || course.category === selectedCategory;

      const reviewMatch =
        selectedReview === "all" ||
        (selectedReview === "100+" && course.reviewCount >= 100) ||
        (selectedReview === "300+" && course.reviewCount >= 300) ||
        (selectedReview === "500+" && course.reviewCount >= 500);

      const ratingMatch =
        selectedRating === "all" ||
        (selectedRating === "4+" && course.rating >= 4) ||
        (selectedRating === "4.5+" && course.rating >= 4.5);

      return searchMatch && categoryMatch && reviewMatch && ratingMatch;
    });
  }, [activeItems, normalizedSearchQuery, selectedCategory, selectedReview, selectedRating]);

  const handleDesktopLockedScroll = (event: WheelEvent<HTMLDivElement>) => {
    if (typeof window === "undefined" || window.innerWidth < 1024) {
      return;
    }

    const pane = rightPaneRef.current;
    if (!pane) {
      return;
    }

    const { deltaY } = event;
    if (deltaY === 0) {
      return;
    }

    const canScrollDown = pane.scrollTop + pane.clientHeight < pane.scrollHeight - 1;
    const canScrollUp = pane.scrollTop > 0;

    if ((deltaY > 0 && canScrollDown) || (deltaY < 0 && canScrollUp)) {
      event.preventDefault();
      pane.scrollTop += deltaY;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedReview("all");
    setSelectedRating("all");
  };

  return (
    <section className="mx-auto w-full max-w-400 px-4 py-10 md:px-8 lg:px-6 xl:px-4">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#dbe8e4] bg-white p-3 shadow-sm lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Filters</p>
          <p className="text-sm font-medium text-gray-800">Refine content</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFiltersOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start" onWheel={handleDesktopLockedScroll}>
        {/* Filter Sidebar - Sticky */}
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <CourseFilterSection
            categories={categories}
            selectedCategory={selectedCategory}
            selectedReview={selectedReview}
            selectedRating={selectedRating}
            onCategoryChange={setSelectedCategory}
            onReviewChange={setSelectedReview}
            onRatingChange={setSelectedRating}
          />
        </aside>

        {/* Content Area - Scrollable */}
        <div ref={rightPaneRef} className="flex flex-col lg:h-[calc(100vh-4rem)] lg:overflow-y-auto hide-scrollbar lg:pr-1">
          <ContentTypeTabs
            contentType={contentType}
            onContentTypeChange={setContentType}
          />

          <CourseGridSection courses={filteredCourses} />
        </div>
      </div>

      {isFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Course filters">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFiltersOpen(false)}
            aria-label="Close filters"
          />

          <aside className="absolute right-0 top-0 h-full w-[88vw] max-w-88 overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setIsFiltersOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={clearAllFilters}
              className="mb-4 text-sm font-medium text-primary hover:underline"
            >
              Clear All
            </button>

            <CourseFilterSection
              categories={categories}
              selectedCategory={selectedCategory}
              selectedReview={selectedReview}
              selectedRating={selectedRating}
              onCategoryChange={setSelectedCategory}
              onReviewChange={setSelectedReview}
              onRatingChange={setSelectedRating}
            />

            <button
              type="button"
              onClick={() => setIsFiltersOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
            >
              Apply Filters
            </button>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
