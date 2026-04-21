"use client";

export default function NewsletterSection() {
  return (
    <section className="bg-[#f7f9fb] py-14 px-6 rounded-2xl shadow mt-12 mb-8 text-center">
      <h3 className="text-2xl font-bold text-[#1e2a55] mb-2">Stay Updated!</h3>
      <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest offers and updates.</p>
      <form className="flex flex-col sm:flex-row justify-center gap-3 max-w-xl mx-auto">
        <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-[#1ec28e] w-full sm:w-auto" />
        <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 hover:shadow-md transition">Subscribe</button>
      </form>
    </section>
  );
}