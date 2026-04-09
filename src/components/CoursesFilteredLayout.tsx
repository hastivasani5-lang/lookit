"use client";

import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import CourseFilterSection from "@/components/CourseFilterSection";
import ContentTypeTabs, { type ContentType } from "@/components/ContentTypeTabs";
import CourseGridSection, {
  allBooks,
  allCourses,
  allOnlinePlatforms,
  allVideoLearnings,
} from "@/components/CourseGridSection";

type CoursesFilteredLayoutProps = {
  searchQuery: string;
};

function scoreMatch(itemText: string, query: string) {
  const normalizedText = itemText.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return 0;
  }

  if (normalizedText === normalizedQuery) {
    return 100;
  }

  if (normalizedText.startsWith(normalizedQuery)) {
    return 80;
  }

  if (normalizedText.includes(normalizedQuery)) {
    return 60;
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  if (terms.length > 1 && terms.every((term) => normalizedText.includes(term))) {
    return 50;
  }

  return 0;
}

export default function CoursesFilteredLayout({ searchQuery }: CoursesFilteredLayoutProps) {
  const [contentType, setContentType] = useState<ContentType>("courses");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReview, setSelectedReview] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const rightPaneRef = useRef<HTMLDivElement | null>(null);

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
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

    return activeItems.filter((course) => {
      const categoryMatch =
        selectedCategory === "all" || course.category === selectedCategory;

      const searchText = `${course.title} ${course.category}`.toLowerCase();
      const searchMatch =
        queryTerms.length === 0 ||
        queryTerms.every((term) => searchText.includes(term));

      const reviewMatch =
        selectedReview === "all" ||
        (selectedReview === "100+" && course.reviewCount >= 100) ||
        (selectedReview === "300+" && course.reviewCount >= 300) ||
        (selectedReview === "500+" && course.reviewCount >= 500);

      const ratingMatch =
        selectedRating === "all" ||
        (selectedRating === "4+" && course.rating >= 4) ||
        (selectedRating === "4.5+" && course.rating >= 4.5);

      return categoryMatch && reviewMatch && ratingMatch && searchMatch;
    }).sort((firstItem, secondItem) => {
      if (!normalizedQuery) {
        return 0;
      }

      const firstScore = scoreMatch(`${firstItem.title} ${firstItem.category}`, normalizedQuery);
      const secondScore = scoreMatch(`${secondItem.title} ${secondItem.category}`, normalizedQuery);

      return secondScore - firstScore;
    });
  }, [activeItems, searchQuery, selectedCategory, selectedReview, selectedRating]);

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

  return (
    <section className="mx-auto w-full max-w-400 px-4 py-10 md:px-8 lg:px-6 xl:px-4">
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start" onWheel={handleDesktopLockedScroll}>
        {/* Filter Sidebar - Sticky */}
        <aside className="self-start lg:sticky lg:top-24">
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
    </section>
  );
}
