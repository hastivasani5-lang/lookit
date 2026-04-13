"use client";
import React from "react";
import ShopHero from "./ShopHero";
import FilterBar from "./FilterBar";
import ProductGrid from "./ProductGrid";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import CartDrawer from "./CartDrawer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ShopPage() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ShopHero />
        <div className="relative z-10">
          <FilterBar />
        </div>
        <ProductGrid />
        <FeaturesSection />
        <TestimonialsSection />
        <CartDrawer />
      </main>
      <Footer />
    </div>
  );
}
