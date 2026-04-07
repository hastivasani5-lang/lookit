"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { UserRole } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trial = useMemo(() => searchParams.get("trial") === "1", [searchParams]);
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!trial) {
      router.replace("/");
      return;
    }

    setIsAllowed(true);
  }, [router, trial]);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const result = (await response.json()) as { message?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.message || "Registration failed.");
      return;
    }

    router.push(`/login?trial=1&registered=1&email=${encodeURIComponent(email)}&role=${role}`);
  };

  if (!isAllowed) {
    return null;
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#d9ef9a] p-4 md:p-6">
      <section className="mx-auto flex h-full w-full max-w-[1440px] flex-col overflow-hidden rounded-[36px] bg-[#b7e18d] shadow-[0_30px_80px_rgba(33,64,35,0.22)] lg:flex-row">
        <div className="relative flex min-h-[420px] flex-1 items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#d9f1b2_0%,#c3e68f_55%,#8bcc62_100%)] pt-16 lg:min-h-0">
          <div className="pointer-events-none absolute left-10 top-10 h-14 w-14 rounded-full border-[4px] border-[#304430] bg-white/70 shadow-[0_8px_18px_rgba(49,70,49,0.2)]" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-48 w-24 rounded-t-[60px] bg-[#eef6d1]/75" />
          <div className="pointer-events-none absolute left-1/2 top-7 z-20 w-full max-w-[560px] -translate-x-1/2 px-6 text-center text-[#1f3b25] md:top-10">
            <h2 className="text-5xl font-extrabold leading-none tracking-tight md:text-7xl">Welcome</h2>
            <p className="mt-1 text-2xl font-semibold leading-tight md:mt-2 md:text-4xl">to the website</p>
          </div>
          <div className="relative z-10 h-[90%] w-[92%] max-w-[640px] animate-float-slow">
            <Image
              src="/about1.png"
              alt="Person reading a book"
              width={640}
              height={640}
              className="h-full w-full object-contain object-bottom drop-shadow-[0_18px_30px_rgba(24,64,29,0.2)]"
              priority
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 lg:px-10">
          <div className="w-full max-w-[420px] text-center">
            <p className="mx-auto mb-6 flex w-fit items-center gap-2 text-lg font-semibold text-slate-800">
              <span className="h-3 w-3 rounded-sm bg-lime-500" />
              EducateX
            </p>

            <h1 className="text-4xl font-semibold leading-[0.96] tracking-tight text-slate-900 md:text-5xl">
              Create account
            </h1>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="mt-7 space-y-4 text-left">
              <div className="grid grid-cols-2 rounded-full bg-[#f2f5ec] p-1">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    role === "student" ? "bg-lime-400 text-slate-950 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("professional")}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    role === "professional" ? "bg-lime-400 text-slate-950 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Professional
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  className="h-14 w-full rounded-full border border-[#e2e6db] px-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-400"
                  autoComplete="name"
                  required
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="h-14 w-full rounded-full border border-[#e2e6db] px-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-400"
                  autoComplete="email"
                  required
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="h-14 w-full rounded-full border border-[#e2e6db] px-5 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-400"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
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
                className="flex h-14 w-full items-center justify-center rounded-full bg-lime-400 font-semibold text-slate-950 transition hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Have an account?{" "}
              <Link href="/login?trial=1" className="font-semibold text-lime-700 transition hover:text-lime-800">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
