"use client";
import Navbar from "@/components/Navbar";
import ShopWhyChoose from "@/components/ShopWhyChoose";
import CategoriesRow from "@/components/shop/CategoriesRow";
import Sidebar from "@/components/Sidebar";
import ProductGrid from "@/components/ProductGrid";
import PopularClasses from "@/components/PopularClasses";
import WhyUpskill from "@/components/WhyUpskill";
import Footer from "@/components/Footer";

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden overflow-y-hidden scrollbar-hide">
      <ShopWhyChoose />
      <CategoriesRow />
      <section className="bg-[#eef5f3] min-h-screen px-4 md:px-10 lg:px-16 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - fixed on large screens */}
        <div className="relative lg:min-h-[70vh]">
          <div className="lg:sticky lg:top-24">
            <Sidebar />
          </div>
        </div>
        {/* Products - scrollable */}
        <div className="flex-1 overflow-y-auto  pr-2 ">
          <ProductGrid />
        </div>
      </div>
      </section>
      <PopularClasses />
      <WhyUpskill />
      <Footer />
      </main>
    </>
  );
}
