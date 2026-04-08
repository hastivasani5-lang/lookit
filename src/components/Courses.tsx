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
];

const Courses = () => {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 md:px-8 lg:px-10">

      {/* CONTAINER */}
      <div className="mx-auto w-full max-w-400">

   <div className="max-w-7xl mx-auto mb-16">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          {/* LEFT */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              CORE FEATURES
            </div>

            {/* LINE */}
            <div className="mt-3 w-full h-px bg-gray-300"></div>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight text-left lg:text-right">
             Our Courses – Comprehensive <br />
Available all programs
            </h2>
          </div>

        </div>

      </div>
    

        {/* FILTER */}
    <div className="flex flex-wrap justify-center gap-4 mb-12">
  {["All Categorize", "Wordpress", "Business", "Networking", "Finance", "Designing"].map((item, i) => (
    <button
      key={i}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        i === 0
          ? "bg-primary text-white"
          : "bg-gray-100 hover:bg-primary/10"
      }`}
    >
      {item}
    </button>
  ))}
</div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">

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
                  className="h-50 w-full rounded-xl object-cover"
                />
    {/* PRICE BADGE */}
    <div className={`absolute bottom-4 left-4 ${course.badgeColor} text-white text-sm px-4 py-2 rounded-full shadow-md`}>
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

  {/* FOOTER (LESSONS + STUDENTS) */}
    
 <div className="relative mt-4 h-10">

  {/* FOOTER (DEFAULT) */}
  <div className="
    flex justify-between items-center text-sm
    absolute w-full transition-all duration-300
    group-hover:opacity-0 group-hover:translate-y-4
  ">
    <div className="flex items-center gap-2 text-gray-600">
      <span className="text-blue-500">📄</span>
      <span>{course.lessons}</span>
    </div>

    <div className="flex items-center gap-2 text-gray-600">
      <span className="text-purple-500">👤</span>
      <span>{course.students}</span>
    </div>
  </div>

  {/* BUTTON (HOVER) */}
  <div className="
    absolute w-full flex justify-end
    opacity-0 translate-y-4
    transition-all duration-300
    group-hover:opacity-100 group-hover:translate-y-0
  ">
    <button className="rounded-full bg-primary px-6 py-2 text-sm text-white hover:bg-[#18ab7d]">
      ENROL NOW →
    </button>
  </div>


  </div>


</div>

          ))}

        </div>

      </div>

      {/* LEFT CHARACTER (DO NOT REMOVE) */}
      <Image
        src="/person.png"
        alt="char"
        width={140}
        height={100}
        className="absolute bottom-0 left-0 hidden h-auto w-35 animate-float lg:block"
      />

    </section>
  );
};

export default Courses;