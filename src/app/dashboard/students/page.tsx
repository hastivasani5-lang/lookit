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

export default function StudentsPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Marquee />
      <Courses />
      <WhyChoose />
      <FeaturedCourse />
      <Instructors />
      <Testimonials />
    </>
  );
}
