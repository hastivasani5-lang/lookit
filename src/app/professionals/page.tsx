import { Suspense } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import ProfessionalsContent from "./professionals-content";

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<ProfessionalsLoadingFallback />}>
      <ProfessionalsContent />
    </Suspense>
  );
}

function ProfessionalsLoadingFallback() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef5f3]">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading professionals...</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
