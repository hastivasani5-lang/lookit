"use client";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import WhyChoose from "@/components/WhyChoose";
import Courses from "@/components/Courses";
import FeaturedCourse from "@/components/FeaturedCourse";
import Instructors from "@/components/Instructors";
import Testimonials from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const PreciousFeaturesSection = dynamic(() => import("@/components/PreciousFeaturesSection"), {
  ssr: false,
});

export default function StudentsPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <Features />
        <About />
        <Marquee />
        <Courses />
        <WhyChoose />
        <FeaturedCourse />
        <PreciousFeaturesSection />
        <Instructors />
        <Testimonials />
        <BlogSection />

        <Footer />
      </main>
    </>
  );
}
