"use client";

import Image from "next/image";

const courses = [
  {
    img: "/course1.jpg",
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
    img: "/course2.jpg",
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
    img: "/course3.jpg",
    price: "$35",
    category: "Designing",
    title: "Creative Graphic Design with Adobe Suite",
    instructor: "Nelson Mendela",
    lessons: "15 Lessons",
    students: "1600 Students",
    color: "bg-[#eef7f3]",
    badgeColor: "bg-green-500",
  },
];

const Courses = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden px-4">

      {/* CONTAINER */}
      <div className="max-w-[1150px] mx-auto">

        {/* TOP */}<div className="grid md:grid-cols-2 items-center gap-10 mb-16">

  {/* LEFT SIDE */}
  <div>
    <div className="flex items-center gap-3 mb-4">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      <p className="text-sm text-gray-500 tracking-wide">
        OUR COURSES
      </p>
    </div>

    {/* LINE */}
    <div className="w-full h-[1px] bg-gray-200"></div>
  </div>

  {/* RIGHT SIDE */}
  <div>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
      Our Courses – Comprehensive <br />
      Available all programs
    </h2>
  </div>

</div>       

        {/* FILTER */}
    <div className="flex flex-wrap justify-center gap-4 mb-12">
  {["All Categorize", "Wordpress", "Business", "Networking", "Finance", "Designing"].map((item, i) => (
    <button
      key={i}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        i === 0
          ? "bg-green-500 text-white"
          : "bg-gray-100 hover:bg-green-100"
      }`}
    >
      {item}
    </button>
  ))}
</div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {courses.map((course, i) => (
            <div
              key={i}
              data-aos="fade-up"
              className={`${course.color} p-5 rounded-2xl transition hover:-translate-y-2 hover:shadow-xl group`}
            >
              {/* IMAGE */}
              <div className="relative mb-4">
                <Image
                  src={course.img}
                  alt="course"
                  width={400}
                  height={250}
                  className="rounded-xl w-full h-[200px] object-cover"
                />

                {/* PRICE */}
                <div className={`absolute bottom-4 left-4 ${course.badgeColor} text-white text-sm px-4 py-2 rounded-full shadow`}>
                  {course.price}
                </div>
              </div>

              {/* CATEGORY */}
              <span className="text-xs px-3 py-1 rounded-full bg-white shadow text-gray-600">
                {course.category}
              </span>

              {/* TITLE */}
              <h3 className="mt-3 text-lg font-semibold text-gray-900 leading-snug">
                {course.title}
              </h3>

              {/* RATING */}
              <p className="text-orange-500 text-sm mt-2">
                ★★★★★ <span className="text-gray-500">(4.5/3 Ratings)</span>
              </p>

              {/* INSTRUCTOR */}
              <div className="flex items-center gap-3 mt-4">
                <Image
                  src="/avatar.jpg"
                  alt="user"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {course.instructor}
                  </p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>

              {/* LINE */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* FOOTER */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>📄 {course.lessons}</span>
                <span>👤 {course.students}</span>
              </div>

              {/* BUTTON */}
              <button className="mt-5 bg-green-500 text-white px-5 py-2 rounded-full text-sm transition hover:bg-green-600">
                ENROL NOW →
              </button>
            </div>
          ))}

        </div>

      </div>

      {/* LEFT CHARACTER (DO NOT REMOVE) */}
      <Image
        src="/person.png"
        alt="char"
        width={120}
        height={100}
        className="absolute bottom-0 left-0 hidden lg:block animate-float"
      />

    </section>
  );
};

export default Courses;