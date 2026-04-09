import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
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
      <Hero />
      <Features />
      <About />
      <Courses />
      <WhyChoose />
      <FeaturedCourse />
      <Instructors />
      <Testimonials />
      <BlogSection />
      <Footer />
    </>
  );
}
