"use client";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-[#1ec28e]/90 to-[#18ab7d]/90 py-16 px-6 text-center text-white rounded-2xl shadow-xl my-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Shopping?</h2>
      <p className="mb-6 text-lg">Discover exclusive deals and top-rated products curated just for you.</p>
      <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-8 py-3 rounded-full shadow hover:scale-105 hover:shadow-md transition">Start Shopping Now</button>
    </section>
  );
}