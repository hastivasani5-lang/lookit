"use client";
import Navbar from "@/components/Navbar";
import HeroCourses from "@/components/HeroCourses";
import TopCategories from "@/components/TopCategories";
import About from "@/components/About";
import StudentsViewing from "@/components/StudentsViewing";
import StatsPixelPerfect from "@/components/StatsPixelPerfect";
// import Courses from "@/components/Courses";
import Footer from "@/components/Footer";
import { i } from "framer-motion/client";

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden overflow-y-hidden scrollbar-hide">
        <section data-aos="fade-up">
          <HeroCourses />
        </section>
        <section data-aos="fade-up" data-aos-delay="100">
          <TopCategories />
        </section>
        <section data-aos="fade-up" data-aos-delay="200">
          <About />
        </section>
        <section data-aos="fade-up" data-aos-delay="300">
          <StudentsViewing />
        </section>
        <section data-aos="fade-up" data-aos-delay="400">
          {/* <Courses /> */}
        </section>
        <section data-aos="fade-up" data-aos-delay="500">
          <StatsPixelPerfect />
        </section>
        <section data-aos="fade-up" data-aos-delay="100">
          <Footer />
        </section>
      </main>
    </>
  );
}