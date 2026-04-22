"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Lazy-load everything below the fold
const Features = dynamic(() => import("@/components/Features"));
const About = dynamic(() => import("@/components/About"));
const Marquee = dynamic(() => import("@/components/Marquee"));
const WhyChoose = dynamic(() => import("@/components/WhyChoose"));
const Cominup = dynamic(() => import("@/components/Cominup"));
const FeaturedCourse = dynamic(() => import("@/components/FeaturedCourse"));
const Instructors = dynamic(() => import("@/components/Instructors"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const BlogSection = dynamic(() => import("@/components/BlogSection"));
const StatsPixelPerfect = dynamic(() => import("@/components/StatsPixelPerfect"));
const Footer = dynamic(() => import("@/components/Footer"));
const AutoPopupModal = dynamic(() => import("@/components/AutoPopupModal"));

export default function StudentsPage() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [belowFoldReady, setBelowFoldReady] = useState(false);

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
