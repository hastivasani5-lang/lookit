import Navbar from "@/components/Navbar";
import PageBanner from "@/components/PageBanner";
import CourseFilterSection from "@/components/CourseFilterSection";
import CourseGridSection from "@/components/CourseGridSection";
 
export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef5f3] pt-20">
        <PageBanner />

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-16">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <CourseFilterSection />
          </aside>

          <div>
            <CourseGridSection />
          </div>
        </section>
      </main>
    </>
  );
}
