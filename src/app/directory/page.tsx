"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageBanner from "@/components/PageBanner";
import StatsSection from "@/components/StatsSection";
import CoursesFilteredLayout from "@/components/CoursesFilteredLayout";
 import CoursesPromoBanner from "@/components/CoursesPromoBanner";
import StepFlow from "@/components/StepFlow";
import Footer from "@/components/Footer";

function DirectoryPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim() ?? "";

  return (
    <main className="min-h-screen bg-[#eef5f3] ">
      <PageBanner />
      <StatsSection />
      <CoursesFilteredLayout searchQuery={searchQuery} />
      <CoursesPromoBanner />
      <StepFlow />
      <Footer />
    </main>
  );
}

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<main className="min-h-screen bg-[#eef5f3]" />}>
        <DirectoryPageContent />
      </Suspense>
    </>
  );
}
