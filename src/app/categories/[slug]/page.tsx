"use client";
"use client";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBanner from "@/components/CategoryBanner";
import CategoryInfo from "@/components/CategoryInfo";
import { useParams } from "next/navigation";


import { categories } from "../../../data/categories";

const defaultImage = "/uploads/categories/default.jpg";

export default function CategoryPage() {
  const params = useParams();
  if (!params) return notFound();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
  const category = categories.find(cat => cat.slug === slug);
  if (!category) return notFound();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Navbar />
      <CategoryBanner />
      <CategoryInfo title={category.title} />
      <Footer />

    </div>
  );
}