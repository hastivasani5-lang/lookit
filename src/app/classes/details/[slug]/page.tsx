"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoSlider from "@/components/VideoSlider";

// Dummy classes data (same as in PopularClasses)
const classes = [
  {
    title: "The Complete Digital Marketing Course",
    rating: "4.6",
    image: "/classes/class1.png",
    tag: "Beginner",
    description: "Master digital marketing with this comprehensive course covering SEO, social media, and more.",
  },
  {
    title: "The Business Startup Guide to Become an Entrepreneur",
    rating: "4.8",
    image: "/classes/class2.png",
    tag: "Beginner",
    description: "Learn how to start and grow your own business from scratch with expert guidance.",
  },
  {
    title: "Best Way to Learn German Language: Full Beginner",
    rating: "4.9",
    image: "/classes/class3.png",
    tag: "Beginner",
    description: "Start speaking German quickly with this beginner-friendly language course.",
  },
  {
    title: "Complete Web & Mobile Designer in 2023: UI/UX",
    rating: "4.7",
    image: "/classes/class4.png",
    tag: "Beginner",
    description: "Become a professional web and mobile designer with hands-on UI/UX projects.",
  },
];

export default function ClassDetailsPage() {
  const { slug } = useParams();
  if (!slug || typeof slug !== "string") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-2xl font-bold text-gray-500">
          Invalid class slug
        </div>
        <Footer />
      </div>
    );
  }
  const cls = classes.find(
    (c) => c.title.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  if (!cls) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-2xl font-bold text-gray-500">
        Class not found
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6faf9] flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 md:px-10 lg:px-32 py-10">
        <div className="bg-white rounded-2xl shadow p-10 flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Class Image */}
          <div className="w-full lg:w-[320px] flex-shrink-0 flex justify-center items-center mb-8 lg:mb-0">
            <div className="bg-[#e9f3ef] rounded-xl p-4 w-[260px] h-[340px] flex items-center justify-center shadow-md">
              <Image
                src={cls.image}
                alt={cls.title}
                width={220}
                height={300}
                className="rounded-xl object-contain"
              />
            </div>
          </div>
          {/* Right: Details & Videos */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{cls.title}</h1>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="text-gray-500 text-sm">({cls.rating} Reviews)</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[#1ec28e] text-base font-semibold bg-[#e5f8f2] px-3 py-1 rounded">{cls.tag}</span>
            </div>
            <p className="text-gray-700 mb-6 max-w-2xl leading-relaxed">
              {cls.description}
            </p>
            <button className="px-8 py-2 rounded-full bg-[#1ec28e] text-white font-semibold hover:bg-[#169e6d] transition mb-8">
              Enroll Now
            </button>
            {/* Instructor Videos Slider */}
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Instructor Videos</h3>
              <VideoSlider />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
