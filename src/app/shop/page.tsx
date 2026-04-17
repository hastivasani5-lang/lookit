"use client";
import Navbar from "@/components/Navbar";
import ShopWhyChoose from "@/components/ShopWhyChoose";
import CategoriesRow from "@/components/shop/CategoriesRow";
import Sidebar from "@/components/Sidebar";
import ProductGrid from "@/components/ProductGrid";
import PopularClasses from "@/components/PopularClasses";
import WhyUpskill from "@/components/WhyUpskill";
import Footer from "@/components/Footer";
import { useCallback, useState } from "react";


export default function ShopPage() {
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null);

const handlePriceBoundsChange = useCallback((nextBounds: { min: number; max: number }) => {
    setPriceBounds((currentBounds) => {
      if (currentBounds.min === nextBounds.min && currentBounds.max === nextBounds.max) {
        return currentBounds;
      }

      return nextBounds;
    });

   setSelectedMaxPrice((current) => {
      if (current === null) {
        return nextBounds.max;
      }

      const clamped = Math.min(Math.max(current, nextBounds.min), nextBounds.max);
      return clamped === current ? current : clamped;
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden overflow-y-hidden scrollbar-hide">
      <ShopWhyChoose />
      <CategoriesRow />
      <section className="bg-[#eef5f3] min-h-screen px-4 md:px-10 lg:px-16 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
         <div className="relative lg:min-h-[70vh]">
          <div className="lg:sticky lg:top-24">
            <Sidebar
              minPrice={priceBounds.min}
              maxPrice={priceBounds.max}
              selectedMaxPrice={selectedMaxPrice ?? priceBounds.max}
              onPriceChange={setSelectedMaxPrice}
            />
          </div>
        </div>
         <div className="flex-1 overflow-y-auto  pr-2 ">
          <ProductGrid
            selectedMaxPrice={selectedMaxPrice}
            onPriceBoundsChange={handlePriceBoundsChange}
          />
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