"use client";

export type ContentType = "courses" | "books" | "video-learning" | "apps";

export const tabs: Array<{ label: string; value: ContentType }> = [
  { label: "All Courses", value: "courses" },
  { label: "Books", value: "books" },
  { label: "Video Learning", value: "video-learning" },
  { label: "Apps", value: "apps" },
];

type ContentTypeTabsProps = {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
};

export default function ContentTypeTabs({
  contentType,
  onContentTypeChange,
}: ContentTypeTabsProps) {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-3">
      {tabs.map((tab) => {
        const isActive = contentType === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onContentTypeChange(tab.value)}
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
  );
}
