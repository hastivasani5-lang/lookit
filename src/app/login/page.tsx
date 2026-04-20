
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
    if (authError === "approval-pending") setError("Your professional account is pending admin approval. Please wait and try again later.");
    if (authError === "approval-rejected") setError("Your professional account was rejected by the admin.");
    if (["Configuration","OAuthSignin","OAuthCallback","OAuthCreateAccount","Callback"].includes(authError || "")) setError("Login is temporarily unavailable because authentication is not configured correctly on the server.");
  }, []);

  const handleCredentialsLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    const result = await signIn("credentials", { email, password, role, redirect: false });
    setIsSubmitting(false);
    if (!result || result.error) {
      if (result?.error === "approval-pending") setError("Your professional account is pending admin approval. Please wait and try again later.");
      else if (result?.error === "approval-rejected") setError("Your professional account was rejected by the admin.");
      else setError("Invalid email or password.");
      return;
    }
    const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
    const sessionPayload = (await sessionResponse.json().catch(() => null)) as { user?: { role?: UserRole } } | null;
    const resolvedRole = sessionPayload?.user?.role === "professional" ? "professional" : "student";
    window.location.href = resolvedRole === "professional" ? "/dashboard/teachers" : "/dashboard/students";
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    await signIn("google", { callbackUrl: role === "professional" ? "/dashboard/teachers" : "/dashboard/students" });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e0f7fa] via-[#f1f8e9] to-[#e3f2fd] p-0">
      <div className="flex w-full max-w-5xl min-h-[80vh] rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Left Side - Illustration & Branding */}
        <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-linear-to-b from-[#b2dfdb] to-[#c8e6c9] p-10 relative">
          <div className="absolute top-8 left-8 text-3xl font-extrabold text-[#1ec28e] tracking-tight">LOOKIT</div>
          <Image src="/about1.png" alt="Login Illustration" width={400} height={400} className="w-80 h-80 object-contain drop-shadow-xl" />
          <div className="mt-8 text-center">
            <h2 className="text-4xl font-bold text-[#195a44] mb-2">Welcome Back!</h2>
            <p className="text-lg text-[#388e3c]">Sign in to access your personalized dashboard.</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-1 flex-col justify-center items-center p-8 sm:p-12 bg-white">
          <div className="w-full max-w-xs mx-auto">
            <h1 className="text-3xl font-bold text-[#195a44] mb-6 text-center">Log in to LOOKIT</h1>
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`px-6 py-2 rounded-l-full font-semibold border transition-all ${role === "student" ? "bg-[#1ec28e] text-white border-[#1ec28e]" : "bg-gray-100 text-[#195a44] border-gray-200"}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("professional")}
                className={`px-6 py-2 rounded-r-full font-semibold border transition-all ${role === "professional" ? "bg-[#1ec28e] text-white border-[#1ec28e]" : "bg-gray-100 text-[#195a44] border-gray-200"}`}
              >
                Professional
              </button>
            </div>

            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 text-center">{error}</div>}
            {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 text-center">{success}</div>}

            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[#1ec28e] outline-none text-base"
                autoComplete="email"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-200 focus:border-[#1ec28e] outline-none text-base"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1ec28e]"
                  onClick={() => setShowPassword((cur) => !cur)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-lg bg-[#1ec28e] text-white font-semibold text-lg transition hover:bg-[#15996b] disabled:opacity-60 flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Log in"}
              </button>
            </form>

            <div className="my-6 flex items-center justify-center gap-2">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-gray-400 text-sm">or</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-lg border border-gray-200 bg-[#f4fbf7] text-[#1b6f53] font-semibold text-base flex items-center justify-center gap-2 transition hover:bg-[#e9f8f0]"
              aria-label="Continue with Google"
              title="Continue with Google"
            >
              <svg width="22" height="22" viewBox="0 0 48 48" className="mr-2"><g><path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.5-.3-3.5z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.1 29.5 3 24 3c-7.2 0-13.3 3.1-17.7 8.1z"/><path fill="#FBBC05" d="M24 43c5.4 0 10.4-1.8 14.3-4.9l-6.6-5.4C29.7 34.7 27 35.5 24 35.5c-5.6 0-10.3-3.6-12-8.5l-6.6 5.1C10.7 39.9 16.9 43 24 43z"/><path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.3 3.5-4.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.5-.3-3.5z"/></g></svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-[#1ec28e] hover:text-[#15996b]">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
