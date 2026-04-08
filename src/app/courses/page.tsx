import Navbar from "@/components/Navbar";
import PageBanner from "@/components/PageBanner";
import StatsSection from "@/components/StatsSection";
import CoursesFilteredLayout from "@/components/CoursesFilteredLayout";
import CoursesInstructorsSection from "@/components/CoursesInstructorsSection";
import CoursesPromoBanner from "@/components/CoursesPromoBanner";
 
export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef5f3] py-10">
        <PageBanner />
        <StatsSection />
        <CoursesFilteredLayout />
        <CoursesPromoBanner />
        <CoursesInstructorsSection />
      </main>
    </>
  );
}
