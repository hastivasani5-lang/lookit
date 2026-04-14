import { notFound } from "next/navigation";

const courses = [
  {
    slug: "business-innovation-and-development",
    title: "Business Innovation And Development",
    description: "Learn how to innovate and grow your business with modern strategies.",
    price: "$30",
    instructor: "John D. Alexon",
  },
  {
    slug: "fundamentals-of-network-and-domains",
    title: "Fundamentals of Network And Domains",
    description: "Master the basics of networking and domain management.",
    price: "Free",
    instructor: "David Watson",
  },
  {
    slug: "creative-graphic-design-with-adobe-suite",
    title: "Creative Graphic Design with Adobe Suite",
    description: "Unlock your creativity with hands-on Adobe Suite training.",
    price: "$35",
    instructor: "Nelson Mendela",
  },
];

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = courses.find((c) => c.slug === params.slug);
  if (!course) return notFound();

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center bg-[#eaf7f2] py-16 px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-[#1a2c47] mb-2">{course.title}</h1>
        <p className="text-[#1ec28e] font-semibold mb-4">{course.price}</p>
        <p className="mb-6 text-gray-700">{course.description}</p>
        <div className="mb-4 text-gray-600">Instructor: <span className="font-semibold text-[#1a2c47]">{course.instructor}</span></div>
        <button className="rounded-full bg-[#1ec28e] px-6 py-2 text-white font-semibold shadow hover:bg-[#18ab7d] transition">Enroll Now</button>
      </div>
    </section>
  );
}
