"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import WhyChooseHero from "@/components/WhyChooseHero";
import WhyChoose from "@/components/WhyChoose";
import WhyChooseSection from "@/components/WhyChooseSection";
import Footer from "@/components/Footer";
export default function EnrollNowPage() {
  return (
    <div className="bg-[#f3f8f6] min-h-screen">
      <Navbar />
      <WhyChooseHero />
      <WhyChoose />
      <WhyChooseSection />
      <Footer />
        </div>
  );
}   