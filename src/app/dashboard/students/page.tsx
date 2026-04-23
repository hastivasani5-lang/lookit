"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Hero skeleton shown while Hero loads
const HeroSkeleton = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#e9f7ef] via-[#e6f4f1] to-[#eef5ff] px-4 py-14 sm:px-6 sm:py-20 lg:px-16 animate-pulse">
    <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="h-4 w-32 rounded-full bg-[#1ec28e]/20" />
        <div className="h-10 w-3/4 rounded-lg bg-gray-200" />
        <div className="h-10 w-1/2 rounded-lg bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-5/6 rounded bg-gray-100" />
        <div className="flex gap-4 pt-2">
          <div className="h-10 w-32 rounded-full bg-[#1ec28e]/30" />
          <div className="h-10 w-28 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center">
        <div className="h-[420px] w-[340px] rounded-2xl bg-gray-100" />
      </div>
    </div>
  </div>
);

// Generic section skeleton
const SectionSkeleton = () => (
  <div className="w-full py-16 px-4 animate-pulse">
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="h-6 w-48 rounded bg-gray-200 mx-auto" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  </div>
);

// Lazy-load Hero (heavy — framer-motion + images)
const Hero = dynamic(() => import("@/components/Hero"), {
  loading: () => <HeroSkeleton />,
  ssr: false,
});

// Lazy-load everything below the fold
const Features = dynamic(() => import("@/components/Features"), { loading: () => <SectionSkeleton /> });
const About = dynamic(() => import("@/components/About"));
const Marquee = dynamic(() => import("@/components/Marquee"));
const WhyChoose = dynamic(() => import("@/components/WhyChoose"));
const Cominup = dynamic(() => import("@/components/Cominup"), { loading: () => <SectionSkeleton /> });
const FeaturedCourse = dynamic(() => import("@/components/FeaturedCourse"));
const Instructors = dynamic(() => import("@/components/Instructors"), { loading: () => <SectionSkeleton /> });
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const BlogSection = dynamic(() => import("@/components/BlogSection"));
const StatsPixelPerfect = dynamic(() => import("@/components/StatsPixelPerfect"));
const Footer = dynamic(() => import("@/components/Footer"));
const AutoPopupModal = dynamic(() => import("@/components/AutoPopupModal"));

export default function StudentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [belowFoldReady, setBelowFoldReady] = useState(false);

  // Handle authentication state
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load below-fold content after first paint
  useEffect(() => {
    let id: number | ReturnType<typeof setTimeout>;
    if (typeof requestIdleCallback !== "undefined") {
      id = requestIdleCallback(() => setBelowFoldReady(true));
    } else {
      id = setTimeout(() => setBelowFoldReady(true), 200);
    }
    return () => {
      if (typeof requestIdleCallback !== "undefined") cancelIdleCallback(id as number);
      else clearTimeout(id as ReturnType<typeof setTimeout>);
    };
  }, []);

  // Show modal 3s after login if student hasn't filled profile yet
  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.role !== "student") return;

    const userId = session.user.id;
    if (!userId) return;

    // Check if already dismissed for this user
    const dismissed = localStorage.getItem(`student_profile_modal_done_${userId}`);
    if (dismissed) return;

    // Check if profile already has location (country) filled — means already submitted
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/student/profile/check");
        if (!res.ok) { setShowModal(true); return; }
        const data = (await res.json()) as { filled: boolean };
        if (!data.filled) setShowModal(true);
      } catch {
        setShowModal(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [status, session]);

  const handleCloseModal = () => {
    const userId = session?.user?.id;
    if (userId) {
      localStorage.setItem(`student_profile_modal_done_${userId}`, "1");
    }
    setShowModal(false);
  };

  const userId = session?.user?.id ?? "guest";

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1ec28e] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (redirect will happen)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        {showModal && <AutoPopupModal onClose={handleCloseModal} userId={userId} />}
        <Hero />
        {belowFoldReady && (
          <>
            <Features />
            <About />
            <Marquee />
            <Cominup />
            <WhyChoose />
            <FeaturedCourse />
            <Instructors />
            <Testimonials />
            <BlogSection />
            <StatsPixelPerfect />
            <Footer />
          </>
        )}
      </main>
    </>
  );
}
