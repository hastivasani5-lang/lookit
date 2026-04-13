"use client";
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
        <Instructors />
        <Testimonials />
        <BlogSection />
        <section className="mx-auto mb-8 w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="rounded-[24px] bg-[#eef5f3] p-6 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2c5a48]">Student Dashboard</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Write a Review</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Share feedback for a professional so it appears on their dashboard in real time.
            </p>
            <a
              href="/dashboard/students/reviews"
              className="mt-5 inline-flex rounded-full bg-[#1ec28e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
            >
              Go to Reviews
            </a>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
