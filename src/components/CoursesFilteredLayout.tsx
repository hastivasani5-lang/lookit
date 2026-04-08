"use client";

import { useEffect, useMemo, useState } from "react";
import CourseFilterSection from "@/components/CourseFilterSection";
import ContentTypeTabs, { type ContentType } from "@/components/ContentTypeTabs";
import CourseGridSection, {
  allBooks,
  allCourses,
  allOnlinePlatforms,
  allVideoLearnings,
} from "@/components/CourseGridSection";

export default function CoursesFilteredLayout() {
  const [contentType, setContentType] = useState<ContentType>("courses");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReview, setSelectedReview] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

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
      const categoryMatch =
        selectedCategory === "all" || course.category === selectedCategory;

      const reviewMatch =
        selectedReview === "all" ||
        (selectedReview === "100+" && course.reviewCount >= 100) ||
        (selectedReview === "300+" && course.reviewCount >= 300) ||
        (selectedReview === "500+" && course.reviewCount >= 500) ||
        (selectedReview === "700+" && course.reviewCount >= 700);

      const ratingMatch =
        selectedRating === "all" ||
        (selectedRating === "4+" && course.rating >= 4) ||
        (selectedRating === "4.5+" && course.rating >= 4.5);

      return categoryMatch && reviewMatch && ratingMatch;
    });
  }, [activeItems, selectedCategory, selectedReview, selectedRating]);

  return (
    <section className="mx-auto w-full max-w-400 px-4 py-10 md:px-8 lg:px-6 xl:px-4">
      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
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
        <div className="flex flex-col">
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
