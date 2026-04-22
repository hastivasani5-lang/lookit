"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";

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

function getCurrentUserId() {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("current_student_id") || "guest";
  }
  return "guest";
}

export default function StudentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [belowFoldReady, setBelowFoldReady] = useState(false);
  const userId = getCurrentUserId();

  useEffect(() => {
    // Load below-fold content after first paint
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shown = localStorage.getItem(`student_auto_modal_shown_${userId}`);
    if (!shown) {
      const timer = setTimeout(() => setShowModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const handleCloseModal = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`student_auto_modal_shown_${userId}`, "1");
    }
    setShowModal(false);
  };

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
