"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserRole } from "@/types/auth";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const registered = params.get("registered") === "1";
    const queryEmail = params.get("email");
    const queryRole = params.get("role");
    const authError = params.get("error");

    if (queryEmail) {
      setEmail(queryEmail);
    }

    if (queryRole === "student" || queryRole === "professional") {
      setRole(queryRole);
    }

    if (registered) {
      setSuccess("Account created successfully. Please log in.");
    }

    if (authError === "register-first") {
      setError("Please register first before using Google login.");
    }

    if (authError === "approval-pending") {
      setError("Your professional account is pending admin approval. Please wait and try again later.");
    }

    if (authError === "approval-rejected") {
      setError("Your professional account was rejected by the admin.");
    }

    if (authError === "Configuration" || authError === "OAuthSignin" || authError === "OAuthCallback" || authError === "OAuthCreateAccount" || authError === "Callback") {
      setError("Login is temporarily unavailable because authentication is not configured correctly on the server.");
    }
  }, []);

  const handleCredentialsLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      if (result?.error === "approval-pending") {
        setError("Your professional account is pending admin approval. Please wait and try again later.");
      } else if (result?.error === "approval-rejected") {
        setError("Your professional account was rejected by the admin.");
      } else {
        setError("Invalid credentials, role mismatch, or account not found. Please register first.");
      }
      return;
    }

    window.location.href = role === "professional" ? "/dashboard/teachers" : "/dashboard/students";
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    await signIn("google", {
      callbackUrl: role === "professional" ? "/dashboard/teachers" : "/dashboard/students",
    });
  };

  return (
    <main className="min-h-screen overflow-auto bg-[#d8f0dc] p-3 sm:p-4 md:p-6">
      <section className="mx-auto flex h-auto min-h-screen w-full max-w-[1440px] flex-col overflow-hidden rounded-[36px] bg-[#bfe4c5] shadow-[0_30px_80px_rgba(18,76,54,0.22)] lg:h-screen lg:flex-row">
        <div className="relative flex flex-1 items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#daf4df_0%,#c6eccf_55%,#9dddae_100%)] py-8 sm:py-12 md:py-16 lg:pt-16">
          <div className="pointer-events-none absolute left-8 top-8 h-14 w-14 rounded-full border-[4px] border-[#195a44] bg-white/70 shadow-[0_8px_18px_rgba(25,90,68,0.2)]" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-48 w-24 rounded-t-[60px] bg-[#e4f6e8]/80" />
          <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-full max-w-[560px] -translate-x-1/2 px-3 sm:px-4 md:px-6 text-center text-[#124533]">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-none tracking-tight">Welcome</h2>
            <p className="mt-1 text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold">to the website</p>
          </div>
          <div className="relative z-10 h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90%] w-[95%] sm:w-[92%] max-w-[640px] animate-float-slow">
            <Image
              src="/about1.png"
              alt="Learning illustration"
              width={640}
              height={640}
              className="h-full w-full object-contain object-bottom drop-shadow-[0_18px_30px_rgba(18,76,54,0.2)]"
              priority
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-white px-4 sm:px-6 py-8 md:py-10 lg:px-10">
          <div className="w-full max-w-[420px] text-center">
            <p className="mx-auto mb-4 text-2xl font-bold tracking-[0.12em] text-slate-900 sm:mb-6">LOOKIT</p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-[0.96] tracking-tight text-slate-900">Log in</h1>

            {error && (
              <div className="mt-4 sm:mt-5 rounded-2xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-700">{error}</div>
            )}

            {success && (
              <div className="mt-4 sm:mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleCredentialsLogin} className="mt-6 sm:mt-7 space-y-3 sm:space-y-4 text-left">
              <div className="grid grid-cols-2 rounded-full bg-[#f1f7f3] p-1">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
                    role === "student" ? "bg-[#1ec28e] text-white shadow-sm" : "text-slate-500"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("professional")}
                  className={`rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
                    role === "professional" ? "bg-[#1ec28e] text-white shadow-sm" : "text-slate-500"
                  }`}
                >
                  Professional
                </button>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="h-12 sm:h-14 w-full rounded-full border border-[#e2e6db] px-4 sm:px-5 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                  autoComplete="email"
                  required
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="h-12 sm:h-14 w-full rounded-full border border-[#e2e6db] px-4 sm:px-5 pr-12 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 sm:h-14 w-full items-center justify-center rounded-full bg-[#1ec28e] text-sm sm:text-base font-semibold text-white transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Log in"}
              </button>
            </form>

            <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-slate-600">or log in with</p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mx-auto mt-2 sm:mt-3 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full border border-[#d6eadf] bg-[#f4fbf7] text-base sm:text-lg font-bold text-[#1b6f53] transition hover:bg-[#e9f8f0]"
              aria-label="Continue with Google"
              title="Continue with Google"
            >
              G
            </button>

            <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-[#1b8c65] transition hover:text-[#0f6c4b]">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
