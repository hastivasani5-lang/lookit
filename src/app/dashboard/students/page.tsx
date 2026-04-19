 
"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import WhyChoose from "@/components/WhyChoose";
import Cominup from "@/components/Cominup";
import FeaturedCourse from "@/components/FeaturedCourse";
import Instructors from "@/components/Instructors";
import Testimonials from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";
import StatsPixelPerfect from "@/components/StatsPixelPerfect";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import AutoPopupModal from "@/components/AutoPopupModal";

// Get user id from localStorage or session (simulate, replace with real user id if available)
function getCurrentUserId() {
  if (typeof window !== "undefined") {
    // If you have user id in context/session, use that instead
    return window.localStorage.getItem("current_student_id") || "guest";
  }
  return "guest";
}

export default function StudentsPage() {
  const [showModal, setShowModal] = useState(false);
  const userId = getCurrentUserId();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const autoModalFlag = localStorage.getItem(`student_auto_modal_shown_${userId}`);
      if (!autoModalFlag) {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
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
      </main>
    </>
  );
}
