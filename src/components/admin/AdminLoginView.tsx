"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef0fb] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_22px_50px_rgba(15,23,42,0.18)] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-14 lg:py-14">
          <div className="mb-10 flex items-center gap-3">
            <span className="text-2xl font-bold tracking-[0.12em] text-slate-900">LOOKIT</span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-slate-800 sm:text-5xl">Welcome to login system</h1>
          <p className="mt-3 text-sm text-slate-400">Sign in by entering the information below</p>

          <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-3">
            <label className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Admin email"
                className="h-11 w-full rounded-full bg-[#f3f5fe] px-11 text-sm text-slate-700 outline-none ring-[#1ec28e]/35 transition focus:ring-2"
                autoComplete="email"
                required
              />
            </label>

            <label className="relative block">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="h-11 w-full rounded-full bg-[#f3f5fe] px-11 pr-11 text-sm text-slate-700 outline-none ring-[#1ec28e]/35 transition focus:ring-2"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </label>

            {error ? <p className="px-1 text-sm text-red-600">{error}</p> : null}

            <div className="pt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 min-w-[160px] items-center justify-center rounded-full bg-[#1ec28e] px-8 text-sm font-medium text-white shadow-[0_8px_20px_rgba(30,194,142,0.35)] transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Checking..." : "Login"}
              </button>
            </div>
          </form>
        </div>

        <div className="relative hidden min-h-[560px] overflow-hidden bg-[#e6f7ef] lg:block">
          <Image
            src="/jenil.png"
            alt="Admin login visual"
            fill
            sizes="(max-width: 1024px) 0px, 50vw"
            priority
            className="object-cover"
          />
        </div>
      </section>
    </main>
  );
}
