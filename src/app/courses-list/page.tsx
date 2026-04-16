import React from "react";
import CourseCard from "@/components/CourseCard";
import CourseListFilterSidebar from "@/components/CourseListFilterSidebar";
import Footer from "@/components/Footer";

const mockCourses = [
  {
    title: "Business Management Classes",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...",
    category: "Business",
    rating: 4.2,
    price: 263.99,
    tag: "Popular",
    students: 45000,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  },
  {
    title: "Networking Classes",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...",
    category: "IT",
    rating: 5.0,
    price: 745.00,
    tag: "High Rated",
    students: 75000,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
  },
  {
    title: "Beautician Classes",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...",
    category: "Beautician",
    rating: 4.3,
    price: 149.00,
    tag: "Popular",
    students: 32000,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
  },
  {
    title: "Guitar Classes",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...",
    category: "Music",
    rating: 4.9,
    price: 130.00,
    tag: "Popular",
    students: 60000,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
  },
  {
    title: "Photoshop Classes",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...",
    category: "Photography",
    rating: 4.9,
    price: 42.00,
    tag: "Popular",
    students: 70000,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135731.png"
  },
  {
    title: "DataScience Classes",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...",
    category: "Data Science",
    rating: 5.0,
    price: 122.00,
    tag: "Best Seller",
    students: 73000,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135742.png"
  },
];

export default function CoursesListPage() {
  return (
    <div className="min-h-screen bg-[#eef5f3]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <CourseListFilterSidebar />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-[#1e2a55]">Classes list</h2>
            {mockCourses.map((course, idx) => (
              <CourseCard key={idx} {...course} />
            ))}
            {/* Pagination can be added here */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}