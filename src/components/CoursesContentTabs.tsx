"use client";

import { useState } from "react";
import CoursesFilteredLayout from "@/components/CoursesFilteredLayout";

type ContentType = "courses" | "books" | "video-learning";

const tabs: Array<{ label: string; value: ContentType }> = [
  { label: "All Courses", value: "courses" },
  { label: "Books", value: "books" },
  { label: "Video Learning", value: "video-learning" },
];

export default function CoursesContentTabs() {
  const [activeTab, setActiveTab] = useState<ContentType>("courses");

  return (
    <div>
      <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 md:px-10 lg:px-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                  : "bg-white text-gray-700 shadow-sm hover:bg-[#e6f7f1]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <CoursesFilteredLayout contentType={activeTab} />
    </div>
  );
}
