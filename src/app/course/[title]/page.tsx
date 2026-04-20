
"use client";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const params = useParams();
  let title = "";
  if (params?.title) {
    if (Array.isArray(params.title)) {
      title = decodeURIComponent(params.title[0] || "");
    } else {
      title = decodeURIComponent(params.title);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9fb] p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1e2a55] mb-4">{title}</h1>
      <p className="text-lg text-gray-600">Welcome to the course detail page.</p>
    </div>
  );
}