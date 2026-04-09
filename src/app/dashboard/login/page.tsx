"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function DashboardLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter both email and password.");
      return;
    }

    setMessage("Login form submitted. Connect this with your backend auth.");
  }

  return (
    <main className="min-h-screen bg-[#f4f7f6] px-4 pt-28 pb-12">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <Image
              src="/lookit-logo.svg"
              alt="Lookit logo"
          width={160}
          height={56}
          priority
          className="mb-4 h-10 w-auto object-contain"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1ec28e]">Welcome Back</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Login to EducateX</h1>
        <p className="mt-2 text-sm text-gray-500">Enter your details to continue.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1ec28e]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1ec28e]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#1ec28e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
          >
            LOGIN
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-gray-600">{message}</p> : null}

        <p className="mt-6 text-center text-sm text-gray-500">
          Back to{" "}
          <Link href="/dashboard/students" className="font-semibold text-[#1ec28e] hover:underline">
            Students Page
          </Link>
        </p>
      </div>
    </main>
  );
}
