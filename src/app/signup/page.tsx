"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { UserRole } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e0f7fa] via-[#f1f8e9] to-[#e3f2fd] p-0">
      <div className="flex w-full max-w-5xl min-h-[80vh] rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Left Side - Illustration & Branding */}
        <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-linear-to-b from-[#b2dfdb] to-[#c8e6c9] p-10 relative">
          <div className="absolute top-8 left-8 text-3xl font-extrabold text-[#1ec28e] tracking-tight">LOOKIT</div>
          <Image src="/about1.png" alt="Signup Illustration" width={400} height={400} className="w-80 h-80 object-contain drop-shadow-xl" />
          <div className="mt-8 text-center">
            <h2 className="text-4xl font-bold text-[#195a44] mb-2">Join LOOKIT!</h2>
            <p className="text-lg text-[#388e3c]">Create your account to get started.</p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex flex-1 flex-col justify-center items-center p-8 sm:p-12 bg-white text-black">
          <div className="w-full max-w-xs mx-auto">
            <h1 className="text-3xl font-bold text-[#195a44] mb-6 text-center">Sign up for LOOKIT</h1>
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`px-6 py-2 rounded-l-full font-semibold border transition-all ${role === "student" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-[#1ec28e]" : " text-[#195a44] border--200"}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("professional")}
                className={`px-6 py-2 rounded-r-full font-semibold border transition-all ${role === "professional" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-[#1ec28e]" : " text-[#195a44] border--200"}`}
              >
                Professional
              </button>
            </div>

            {error && <div className="mb-4 rounded-lg border   bg-red-50 px-4 py-2 text-sm text-red-700 text-center">{error}</div>}

            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full h-12 px-4 rounded-lg border    focus:border-[#1ec28e] outline-none text-base"
                autoComplete="name"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-12 px-4 rounded-lg border   focus:border-[#1ec28e] outline-none text-base"
                autoComplete="email"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-12 px-4 pr-12 rounded-lg border focus:border-[#1ec28e] outline-none text-base"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2  hover:text-[#1ec28e]"
                  onClick={() => setShowPassword((cur) => !cur)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-lg transition hover:bg-[#15996b] disabled:opacity-60 flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm ">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#1ec28e] hover:text-[#15996b]">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
