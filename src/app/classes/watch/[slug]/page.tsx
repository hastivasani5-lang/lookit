"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

type VideoEntry = {
  id: string;
  title: string;
  url: string;
  thumb: string;
  duration: string;
  source: "file" | "youtube";
};

type WatchClassPayload = {
  classItem?: {
    title: string;
    image: string;
    selectedVideoIndex: number;
    videos: VideoEntry[];
  };
};

export default function WatchClassPage() {
  const { slug } = useParams();
  const [cls, setCls] = useState<WatchClassPayload["classItem"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slug || typeof slug !== "string") {
      setLoading(false);
      setCls(null);
      return;
    }

    let isMounted = true;

    const loadClass = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/classes/advanced/${slug}`, { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as WatchClassPayload;

        if (!isMounted) {
          return;
        }

        if (!response.ok || !payload.classItem) {
          setCls(null);
          return;
        }

        setCls(payload.classItem);
        setCurrent(payload.classItem.selectedVideoIndex ?? 0);
      } catch {
        if (isMounted) {
          setCls(null);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-2xl font-bold text-gray-500">
          Loading class...
        </div>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#181818] flex flex-col">
      <Navbar />
      <main className="flex-1 px-2 md:px-10 lg:px-24 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Video */}
        <div className="flex-1 flex flex-col items-center lg:items-start">
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-4">
            {cls.videos[current]?.source === "youtube" ? (
              <iframe
                src={cls.videos[current].url}
                title={cls.videos[current].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video
                src={cls.videos[current]?.url}
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
                poster={cls.videos[current]?.thumb}
              />
            )}
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">{cls.videos[current].title}</h2>
        </div>
        {/* Video List */}
        <aside className="w-full lg:w-[380px] flex-shrink-0 bg-[#232323] rounded-2xl p-4 flex flex-col gap-4 h-fit">
          <h3 className="text-white text-lg font-bold mb-2">All Videos</h3>
          {cls.videos.map((v, idx) => (
            <div
              key={`${v.id}-${idx}`}
              className={`flex gap-4 items-center rounded-lg p-2 cursor-pointer transition border border-transparent hover:border-[#1ec28e] ${current === idx ? "bg-[#1ec28e] bg-opacity-10 border-[#1ec28e]" : ""}`}
              onClick={() => setCurrent(idx)}
            >
              <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src={v.thumb} alt={v.title} fill unoptimized className="object-cover" />
                <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                  {v.duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${current === idx ? "text-[#1ec28e]" : "text-white"}`}>{v.title}</div>
              </div>
            </div>
          ))}
        </aside>
      </main>
      <Footer />
    </div>
  );
}
