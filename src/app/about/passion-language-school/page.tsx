"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Globe, Users, Award, Clock, Star, CheckCircle, ArrowLeft } from "lucide-react";

const stats = [
  { icon: Users, value: "235K+", label: "Worldwide Students" },
  { icon: BookOpen, value: "3.5K+", label: "Free Courses" },
  { icon: Star, value: "4.7", label: "Average Rating" },
  { icon: Globe, value: "50+", label: "Languages Offered" },
];

const features = [
  "Expert-led English & Foreign Language courses",
  "Flexible online & in-person learning options",
  "Beginner to advanced proficiency levels",
  "Certified instructors with global experience",
  "Interactive live sessions & recorded classes",
  "Personalized learning paths for every student",
  "Career-focused curriculum with real-world practice",
  "Supportive community of learners worldwide",
];

const courses = [
  { name: "English for Beginners", level: "Beginner", duration: "8 weeks", rating: 4.8 },
  { name: "Business English Mastery", level: "Advanced", duration: "12 weeks", rating: 4.9 },
  { name: "Spanish Essentials", level: "Beginner", duration: "10 weeks", rating: 4.7 },
  { name: "French Conversation", level: "Intermediate", duration: "8 weeks", rating: 4.6 },
  { name: "German Language Pro", level: "Intermediate", duration: "14 weeks", rating: 4.8 },
  { name: "IELTS Preparation", level: "Advanced", duration: "6 weeks", rating: 4.9 },
];

export default function PassionLanguageSchoolPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f9fb]">

        {/* Hero Banner */}
        <section className="relative bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-500 text-white py-20 px-4 md:px-10 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-white blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto relative z-10">
            <Link href="/about" className="inline-flex items-center gap-2 text-emerald-100 hover:text-white text-sm mb-6 transition">
              <ArrowLeft className="w-4 h-4" /> Back to About
            </Link>
            <p className="text-emerald-200 text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              Passion Language<br />
              <span className="text-emerald-200">School</span>
            </h1>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-2xl">
              Empowering learners worldwide with innovative language education. We combine creativity,
              technology, and expert instruction to help you master any language.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 md:px-10 bg-white shadow-sm">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <s.icon className="w-7 h-7 text-emerald-600 mb-2" />
                <h3 className="text-2xl font-extrabold text-emerald-700">{s.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 md:px-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — compact text + features */}
            <div>
              <p className="text-sm text-[#ff5a3c] font-semibold uppercase tracking-widest mb-2">Our Story</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1c39] leading-tight mb-3">
                Why Choose Passion<br />Language School?
              </h2>
              <p className="text-gray-500 text-sm leading-6 mb-5">
                We offer English and Online Foreign Language Courses at various proficiency levels,
                combining creativity, enjoyment, and a supportive learning atmosphere.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — colorful diamond design */}
            <div className="relative flex justify-center items-center min-h-[420px]">
              {/* Background card */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">

                {/* Rotated colored shapes */}
                <div className="absolute w-52 h-52 rounded-3xl rotate-12 bg-gradient-to-br from-pink-400 to-rose-500 opacity-90 shadow-xl" />
                <div className="absolute w-52 h-52 rounded-3xl -rotate-12 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-80 shadow-xl" />
                <div className="absolute w-52 h-52 rounded-3xl rotate-45 bg-gradient-to-br from-orange-400 to-amber-500 opacity-70 shadow-xl" />

                {/* Decorative circles */}
                <div className="absolute top-4 right-8 w-8 h-8 rounded-full border-4 border-blue-500 bg-white z-10" />
                <div className="absolute bottom-8 right-4 w-5 h-5 rounded-full border-4 border-orange-400 bg-white z-10" />
                <div className="absolute top-8 left-4 w-4 h-4 rounded-full bg-blue-500 z-10" />

                {/* Plus signs */}
                <div className="absolute top-6 left-16 text-white text-2xl font-bold z-10 opacity-80">+</div>
                <div className="absolute bottom-10 right-16 text-white text-xl font-bold z-10 opacity-80">+</div>

                {/* Main person image */}
                <Image
                  src="/shopban.png"
                  alt="Student"
                  width={260}
                  height={300}
                  className="relative z-20 object-contain drop-shadow-2xl"
                />
              </div>

              {/* Stat — top right */}
              <div className="absolute top-2 right-0 bg-white shadow-xl rounded-2xl px-4 py-3 border border-gray-100 z-30">
                <h4 className="font-extrabold text-xl text-emerald-600">235K+</h4>
                <p className="text-gray-500 text-xs">Happy Students</p>
              </div>

              {/* Stat — bottom left */}
              <div className="absolute bottom-2 left-0 bg-white shadow-xl rounded-2xl px-4 py-3 border border-gray-100 z-30">
                <h4 className="font-extrabold text-xl text-amber-500">4.7 ⭐</h4>
                <p className="text-gray-500 text-xs">Avg Rating</p>
              </div>
            </div>

          </div>
        </section>

        {/* Courses */}
        <section className="py-16 px-4 md:px-10 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm text-emerald-600 font-semibold uppercase tracking-widest mb-2 text-center">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c39] text-center mb-10">
              Popular Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-[#f8fbfa] p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {c.level}
                    </span>
                    <span className="text-xs text-amber-500 font-bold">★ {c.rating}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{c.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    {c.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 md:px-10 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <Award className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Start Your Language Journey Today
            </h2>
            <p className="text-emerald-100 text-base leading-relaxed mb-8">
              Join 235,000+ students worldwide and unlock new career opportunities with our
              expert-led language courses.
            </p>
            <Link
              href="/directory"
              className="inline-block bg-white text-emerald-700 font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
            >
              Explore All Courses →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
