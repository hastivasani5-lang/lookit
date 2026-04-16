"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ClassCard = {
  id: string;
  title: string;
  rating: string;
  image: string;
  tag: string;
  slug: string;
  videoCount: number;
};


export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassCard[]>([]);
  const [modal, setModal] = useState<{open: boolean, video?: string, title?: string}>({open: false});

  useEffect(() => {
    let isMounted = true;

    const loadClasses = async () => {
      try {
        const response = await fetch("/api/classes/advanced", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as { classes?: ClassCard[] };

        if (!isMounted || !response.ok) {
          return;
        }

        setClasses(Array.isArray(payload.classes) ? payload.classes : []);
      } catch {
        if (isMounted) {
          setClasses([]);
        }
      }
    };

    void loadClasses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6faf9]">
      <Navbar />
      <main className="flex-1">
        <section className="px-4 md:px-10 lg:px-16 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">All Classes</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {classes.map((item) => (
              <Link
                key={item.id}
                href={`/classes/watch/${item.slug}`}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition flex flex-col items-center group border border-transparent hover:border-primary cursor-pointer"
              >
                <div className="relative w-full h-45 mb-4 flex items-center justify-center">
                  <Image
                    src={item.image}
                    width={300}
                    height={180}
                    unoptimized
                    className="rounded-xl object-cover w-full h-full"
                    alt={item.title}
                  />
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {item.tag}
                  </span>
                  {item.videoCount && (
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      {item.videoCount} video{item.videoCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {/* Title moved to bottom only */}
                <div className="flex flex-col items-center gap-1 mb-4 mt-2">
                  <h3 className="text-lg font-semibold text-gray-800 leading-snug group-hover:text-primary transition text-center">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm justify-center">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-gray-600">{item.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {/* Video Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-lg w-full relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setModal({open: false})}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">{modal.title}</h2>
            <video controls autoPlay className="rounded-lg w-full h-64 object-cover">
              <source src={modal.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
