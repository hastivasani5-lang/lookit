import React from "react";

export default function ComingUpClasses() {
  const upcomingCourses = [
    {
      title: "AI for Everyone: Beginner to Pro",
      instructor: "Priya Sharma",
      startDate: "25 April 2026",
      seats: 30,
      img: "/upcoming-class.png"
    },
    {
      title: "Advanced Web Development Bootcamp",
      instructor: "Rahul Mehta",
      startDate: "2 May 2026",
      seats: 20,
      img: "/upcoming-class.png"
    },
    {
      title: "Digital Marketing Mastery",
      instructor: "Sana Khan",
      startDate: "10 May 2026",
      seats: 25,
      img: "/upcoming-class.png"
    },
  ];
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-[#1e2a55] mb-6">Coming Up Classes</h2>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide py-2 px-1 snap-x snap-mandatory">
        {upcomingCourses.map((course, idx) => (
          <div key={idx} className="min-w-[320px] max-w-xs bg-[#f6faf9] rounded-xl p-6 shadow hover:shadow-lg transition snap-center flex-shrink-0 flex flex-col items-center">
            <img src={course.img} alt={course.title} className="w-24 h-24 object-cover rounded-full mb-4" />
            <h4 className="text-lg font-bold text-[#1e2a55] mb-2">{course.title}</h4>
            <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
            <p className="text-sm text-gray-500 mb-2">Starts: {course.startDate}</p>
            <p className="text-xs text-[#1ec28e] font-semibold mb-4">Seats Available: {course.seats}</p>
            <button className="rounded-full bg-[#1ec28e] px-4 py-2 text-sm text-white font-semibold shadow hover:bg-[#18ab7d] transition">Join Waitlist</button>
          </div>
        ))}
      </div>
    </section>
  );
}
