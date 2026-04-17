import React from "react";

export default function AddBooksVideosSection({
  addContentTab,
  setAddContentTab,
  isBookFormOpen,
  setIsBookFormOpen,
  isVideoFormOpen,
  setIsVideoFormOpen,
  ...props
}) {
  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-[24px] bg-white p-3 shadow-sm">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-2xl bg-[#f7faf8] p-1">
          <button
            type="button"
            onClick={() => setAddContentTab("books")}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
              addContentTab === "books" ? "bg-[#1ec28e] text-white" : "text-slate-600 hover:bg-white"
            }`}
          >
            Books
          </button>
          <button
            type="button"
            onClick={() => setAddContentTab("videos")}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
              addContentTab === "videos" ? "bg-[#1ec28e] text-white" : "text-slate-600 hover:bg-white"
            }`}
          >
            Videos
          </button>
        </div>
      </div>
      {/* Book and Video Forms would be rendered here as children or via props */}
      {props.children}
    </div>
  );
}
