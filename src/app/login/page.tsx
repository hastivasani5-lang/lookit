"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, GraduationCap, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserRole } from "@/types/auth";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const registered = params.get("registered") === "1";
    const queryEmail = params.get("email");
    const queryRole = params.get("role");
    const authError = params.get("error");
    if (queryEmail) setEmail(queryEmail);
    if (queryRole === "student" || queryRole === "professional") setRole(queryRole);
    if (registered) setSuccess("Account created successfully. Please log in.");
    if (authError === "register-first") setError("Please register first before using Google login.");
    if (authError === "approval-pending") setError("Your professional account is pending admin approval.");
    if (authError === "approval-rejected") setError("Your professional account was rejected.");
    if (["Configuration","OAuthSignin","OAuthCallback","OAuthCreateAccount","Callback"].includes(authError || "")) {
      setError("Google login is not configured correctly on the server.");
    }
  }, []);

  const handleCredentialsLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setSuccess(""); setIsSubmitting(true);
    const result = await signIn("credentials", { email, password, role, redirect: false });
    setIsSubmitting(false);
    if (!result || result.error) {
      if (result?.error === "approval-pending") setError("Professional account pending approval.");
      else if (result?.error === "approval-rejected") setError("Professional account rejected.");
      else setError("Invalid email or password.");
      return;
    }
    const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
    const sessionPayload = await sessionResponse.json().catch(() => null);
    const resolvedRole = sessionPayload?.user?.role === "professional" ? "professional" : "student";
    window.location.href = resolvedRole === "professional" ? "/dashboard/teachers" : "/dashboard/students";
  };

  const handleGoogleLogin = async () => {
    try {
      setError(""); setSuccess(""); setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: role === "professional" ? "/dashboard/teachers" : "/dashboard/students" });
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google login failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#f0faf6]">

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 60%, #34d399 100%)" }}>

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-10 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-3xl font-extrabold text-white tracking-wide">LOOKIT</span>
          </div>

          {/* Illustration */}
          <div className="relative w-72 h-72 mb-10">
            <div className="absolute inset-0 rounded-3xl bg-white/10 rotate-6" />
            <div className="absolute inset-0 rounded-3xl bg-white/10 -rotate-3" />
            <div className="relative rounded-3xl overflow-hidden w-full h-full bg-white/20">
              <Image
                src="/login1.jpg"
                alt="Login"
                fill
                className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "/about1.png"; }}
              />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Welcome Back!
          </h2>
          <p className="text-white/80 text-lg max-w-xs leading-relaxed">
            Sign in to continue your learning journey and connect with top professionals.
          </p>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            {[
              { value: "10K+", label: "Students" },
              { value: "500+", label: "Experts" },
              { value: "1K+", label: "Courses" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
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
            <h1 className="text-3xl font-bold text-gray-900">Sign in to your account</h1>
            <p className="mt-2 text-gray-500 text-sm">Enter your credentials to access your dashboard</p>
          </div>

          {/* Role Toggle */}
          <div className="flex gap-3 mb-8 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                role === "student"
                  ? "bg-white text-[#0d7a57] shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("professional")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                role === "professional"
                  ? "bg-white text-[#0d7a57] shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Professional
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1ec28e] focus:ring-2 focus:ring-[#1ec28e]/20"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1ec28e] focus:ring-2 focus:ring-[#1ec28e]/20"
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
              className="w-full h-12 rounded-xl font-semibold text-white transition-all hover:scale-[1.01] hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 100%)" }}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full h-12 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium flex items-center justify-center gap-3 transition hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-95 disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#1ec28e] hover:text-[#0d7a57] transition">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
