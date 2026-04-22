"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoSlider from "@/components/VideoSlider";
import { useEffect, useState } from "react";

type InstructorVideo = {
  title: string;
  url: string;
  thumb: string;
};

type ClassDetails = {
  title: string;
  rating: string;
  image: string;
  tag: string;
  description: string;
  videos: InstructorVideo[];
};

export default function ClassDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [cls, setCls] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug || typeof slug !== "string") {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let isMounted = true;

    const loadClass = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const response = await fetch(`/api/classes/popular/${slug}`, { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as { classItem?: ClassDetails };

        if (!isMounted) {
          return;
        }

        if (!response.ok || !payload.classItem) {
          setCls(null);
          setNotFound(true);
          return;
        }

        setCls(payload.classItem);
      } catch {
        if (isMounted) {
          setCls(null);
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadClass();

    return () => {
      isMounted = false;
    };
  }, [slug]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-2xl font-bold text-gray-500">
          Loading class details...
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !cls) return (
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
                unoptimized
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
            <button className="px-8 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:opacity-90 transition mb-8">
              Enroll Now
            </button>
            {/* Instructor Videos Slider */}
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Instructor Videos</h3>
              <VideoSlider videos={cls.videos} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
