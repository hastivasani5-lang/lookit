"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UserRole } from "@/types/auth";

export default function DashboardLoginPage() {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-screen flex items-center justify-center bg-[#eef3f1] p-4">
      <section className="w-full max-w-[1400px] min-h-[90vh] overflow-hidden rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row">
        <div className="flex-1 bg-gradient-to-br from-[#36b39b] to-[#2aa58f] text-white flex flex-col justify-center px-14 py-20">
          <div className="max-w-[420px]">
            <h1 className="text-6xl font-bold">Guilar</h1>
            <p className="text-2xl mt-3 font-medium">TODO List App</p>
            <p className="mt-6 text-white/90 leading-relaxed">
              Elevate your productivity with Guilar,
              the sleek todo list app designed
              to keep you organized and on track.
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-[#f3f1ee]">
          <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-9">
            <h2 className="text-3xl font-semibold text-[#2aa58f] text-center">Welcome</h2>

            <p className="text-center text-gray-500 mt-2 text-sm">Please enter your email and password</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 rounded-full bg-[#eef6f2] p-1">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`rounded-full py-2 text-sm font-semibold transition ${
                    role === "student" ? "bg-[#2aa58f] text-white" : "text-gray-500"
                  }`}
                >
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => setRole("professional")}
                  className={`rounded-full py-2 text-sm font-semibold transition ${
                    role === "professional" ? "bg-[#2aa58f] text-white" : "text-gray-500"
                  }`}
                >
                  Professional
                </button>
              </div>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="h-12 w-full rounded-lg border border-gray-200 px-4 outline-none focus:border-[#2aa58f]"
              />

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 pr-12 outline-none focus:border-[#2aa58f]"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-500">
                <input type="checkbox" />
                Remember me
              </label>

              <button type="submit" className="h-12 w-full rounded-lg bg-[#2aa58f] text-white font-semibold hover:bg-[#23957f]">
                Login
              </button>
            </form>

            {message ? <p className="mt-4 text-sm text-gray-600">{message}</p> : null}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Or continue with</p>

              <div className="flex justify-center gap-4 mt-3">
                <button className="h-10 w-10 rounded-full border flex items-center justify-center">G</button>
                <button className="h-10 w-10 rounded-full border">f</button>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#2aa58f] font-semibold">
                  Register now!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
