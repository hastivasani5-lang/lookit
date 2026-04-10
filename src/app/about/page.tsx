import Navbar from "@/components/Navbar";
import About from "@/components/Aboutbannar";
import AboutHero from "@/components/AboutHero";
import FeaturesStrip from "@/components/FeaturesStrip";
import FeaturedCourse from "@/components/FeaturedCourse";
import Testimonials1 from "@/components/Testimonials1";
import Footer from "@/components/Footer";
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <About />
        <AboutHero />
        <FeaturesStrip />
        <FeaturedCourse />
        <Testimonials1 />
        <Footer />
      </main>
    </>
  );
}
