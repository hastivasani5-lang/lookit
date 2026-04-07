import Link from "next/link";
import Navbar from "@/components/Navbar";

const quickLinks = [
  { label: "Students Dashboard", href: "/dashboard/students" },
  { label: "Teachers Dashboard", href: "/dashboard/teachers" },
  { label: "Admin Panel", href: "/dashboard/adminpanel" },
  { label: "Login", href: "/dashboard/login" },
  { label: "Signup", href: "/signup" },
];

export default function PagesIndexPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f8f7] px-4 pb-12 pt-28">
        <section className="mx-auto w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1ec28e]">Explore</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">All Platform Pages</h1>
          <p className="mt-3 text-sm text-gray-600">Jump directly to key pages from this menu.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-700 transition hover:-translate-y-0.5 hover:border-[#1ec28e] hover:text-[#1ec28e]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
