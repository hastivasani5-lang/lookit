"use client";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2c5a48]">Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-gray-500">Students</p>
          <p className="text-3xl font-bold text-[#2c5a48]">0</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-gray-500">Courses</p>
          <p className="text-3xl font-bold text-[#2c5a48]">0</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-gray-500">Reviews</p>
          <p className="text-3xl font-bold text-[#2c5a48]">0</p>
        </div>
      </div>
    </div>
  );
}
