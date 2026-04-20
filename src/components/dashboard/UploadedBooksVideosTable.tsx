import React from "react";

export default function UploadedBooksVideosTable({ books, videos, ...props }: any) {
  // Render uploaded books and videos tables here
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm mt-6">
      {/* Implement table rendering for books and videos using props */}
      {props.children}
    </div>
  );
}
