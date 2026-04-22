"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, GraduationCap, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import type { UserRole } from "@/types/auth";

const slides = [
  {
    image: "/login1.jpg",
    title: "Learn from the Best",
    desc: "Connect with top-rated professionals and grow your skills.",
  },
  {
    image: "/login2.jpg",
    title: "Teach & Inspire",
    desc: "Share your expertise and build a community of learners.",
  },
  {
    image: "/students.png",
    title: "Grow Together",
    desc: "Join thousands of students and professionals on LOOKIT.",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Slider state
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  // Auto-slide
  useEffect(() => {
    const t = setInterval(() => next(), 4000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const result = (await response.json()) as { message?: string };
    setIsSubmitting(false);
    if (!response.ok) {
      setError(result.message || "Registration failed.");
      return;
    }
    router.push(`/login?registered=1&email=${encodeURIComponent(email)}&role=${role}`);
  };

  return (
    <main className="min-h-screen flex bg-[#f0faf6]">

      {/* ── LEFT PANEL - Slider ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 60%, #34d399 100%)" }}>

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center text-center px-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-3xl font-extrabold text-white tracking-wide">LOOKIT</span>
          </div>

          {/* Slider Image */}
          <div className="relative w-72 h-64 mb-8">
            <div
              className={`absolute inset-0 rounded-3xl overflow-hidden transition-all duration-300 ${animating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
              <div className="absolute inset-0 rounded-3xl bg-white/10 rotate-3" />
              <div className="relative rounded-3xl overflow-hidden w-full h-full bg-white/20">
                <Image
                  src={slides[current].image}
                  alt={slides[current].title}
                  fill
                  className="object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/about1.png"; }}
                />
              </div>
            </div>
          </div>

          {/* Slide text */}
          <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
            <h2 className="text-3xl font-bold text-white mb-3">{slides[current].title}</h2>
            <p className="text-white/80 text-base max-w-xs">{slides[current].desc}</p>
          </div>

          {/* Slider controls */}
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL - Form ──────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 sm:px-12 bg-white lg:bg-[#f0faf6]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#1ec28e] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-[#0d7a57]">LOOKIT</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-2 text-gray-500 text-sm">Join thousands of learners and professionals</p>
          </div>

          {/* Role Toggle */}
          <div className="flex gap-3 mb-8 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                role === "student" ? "bg-white text-[#0d7a57] shadow-md" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("professional")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                role === "professional" ? "bg-white text-[#0d7a57] shadow-md" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Professional
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1ec28e] focus:ring-2 focus:ring-[#1ec28e]/20"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1ec28e] focus:ring-2 focus:ring-[#1ec28e]/20"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1ec28e] focus:ring-2 focus:ring-[#1ec28e]/20"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1ec28e] transition"
                  onClick={() => setShowPassword((c) => !c)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl font-semibold text-white transition-all hover:scale-[1.01] hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 100%)" }}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#1ec28e] hover:text-[#0d7a57] transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
