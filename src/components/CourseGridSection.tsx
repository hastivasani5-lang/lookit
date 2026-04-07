"use client";

import Image from "next/image";

const courses = [
  {
    img: "/about1.png",
    price: "$30",
    category: "Business",
    title: "Business Innovation And Development",
    instructor: "John D. Alexon",
    lessons: "12 Lessons",
    students: "1200 Students",
    color: "bg-[#eaf4fb]",
    badgeColor: "bg-blue-500",
  },
  {
    img: "/hero.png",
    price: "Free",
    category: "Networking",
    title: "Fundamentals of Network And Domains",
    instructor: "David Watson",
    lessons: "16 Lessons",
    students: "1500 Students",
    color: "bg-[#f6efe9]",
    badgeColor: "bg-orange-400",
  },
  {
    img: "/start.png",
    price: "$35",
    category: "Designing",
    title: "Creative Graphic Design with Adobe Suite",
    instructor: "Nelson Mendela",
    lessons: "15 Lessons",
    students: "1600 Students",
    color: "bg-[#eef7f3]",
    badgeColor: "bg-[#1ec28e]",
  },
   {
    img: "/about1.png",
    price: "$30",
    category: "Business",
    title: "Business Innovation And Development",
    instructor: "John D. Alexon",
    lessons: "12 Lessons",
    students: "1200 Students",
    color: "bg-[#eaf4fb]",
    badgeColor: "bg-blue-500",
  },
  {
    img: "/hero.png",
    price: "Free",
    category: "Networking",
    title: "Fundamentals of Network And Domains",
    instructor: "David Watson",
    lessons: "16 Lessons",
    students: "1500 Students",
    color: "bg-[#f6efe9]",
    badgeColor: "bg-orange-400",
  },
  {
    img: "/start.png",
    price: "$35",
    category: "Designing",
    title: "Creative Graphic Design with Adobe Suite",
    instructor: "Nelson Mendela",
    lessons: "15 Lessons",
    students: "1600 Students",
    color: "bg-[#eef7f3]",
    badgeColor: "bg-[#1ec28e]",
  },
];

export default function CourseGridSection() {
  return (
    <section>
      {/* GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {courses.map((course, i) => (
            <div
              key={i}
              className={`${course.color} p-5 rounded-2xl transition hover:-translate-y-2 hover:shadow-xl group`}
            >

              {/* IMAGE */}
              <div className="relative mb-4">
                <Image
                  src={course.img}
                  alt="course"
                  width={400}
                  height={250}
                  className="rounded-xl w-full h-50 object-cover"
                />

                {/* PRICE BADGE */}
                <div
                  className={`absolute bottom-4 left-4 ${course.badgeColor} text-white text-sm px-4 py-2 rounded-full shadow-md`}
                >
                  {course.price}
                </div>
              </div>

              {/* CATEGORY */}
              <span className="text-xs px-3 py-1 rounded-full bg-white shadow text-gray-600 inline-block mb-3">
                {course.category}
              </span>

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-2">
                {course.title}
              </h3>

              {/* RATING */}
              <div className="flex items-center gap-2 text-sm mb-4">
                <div className="text-orange-500">★★★★★</div>
                <span className="text-gray-500">(4.5/3 Ratings)</span>
              </div>

              {/* INSTRUCTOR */}
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/person.png"
                  alt="user"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {course.instructor}
                  </p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* FOOTER + HOVER */}
              <div className="mt-4 relative h-10">

                {/* DEFAULT */}
                <div className="flex justify-between items-center text-sm absolute w-full transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4">

                  <div className="flex items-center gap-2 text-gray-600">
                    📄 <span>{course.lessons}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    👤 <span>{course.students}</span>
                  </div>

                </div>

                {/* HOVER BUTTON */}
                <div className="absolute w-full flex justify-end opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <button className="bg-primary text-white px-6 py-2 rounded-full text-sm hover:bg-[#18ab7d]">
                    ENROL NOW →
                  </button>
                </div>

              </div>

            </div>
          ))}

      </div>

      {/* SHOW MORE */}
      <div className="mt-12 flex justify-center">
        <button className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#18ab7d]">
          SHOW MORE
        </button>
      </div>
    </section>
  );
}