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

    if (queryRole === "student" || queryRole === "professional")
      setRole(queryRole);

    if (registered)
      setSuccess("Account created successfully. Please log in.");

    if (authError === "register-first")
      setError("Please register first before using Google login.");

    if (authError === "approval-pending")
      setError("Your professional account is pending admin approval.");

    if (authError === "approval-rejected")
      setError("Your professional account was rejected.");

    if (
      ["Configuration",
       "OAuthSignin",
       "OAuthCallback",
       "OAuthCreateAccount",
       "Callback"].includes(authError || "")
    ) {
      setError(
        "Google login is not configured correctly on the server."
      );
    }

  }, []);

  // ===============================
  // Credentials Login
  // ===============================

  const handleCredentialsLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false
    });

    setIsSubmitting(false);

    if (!result || result.error) {

      if (result?.error === "approval-pending")
        setError("Professional account pending approval.");

      else if (result?.error === "approval-rejected")
        setError("Professional account rejected.");

      else
        setError("Invalid email or password.");

      return;
    }

    const sessionResponse = await fetch(
      "/api/auth/session",
      { cache: "no-store" }
    );

    const sessionPayload =
      await sessionResponse.json().catch(() => null);

    const resolvedRole =
      sessionPayload?.user?.role === "professional"
        ? "professional"
        : "student";

    window.location.href =
      resolvedRole === "professional"
        ? "/dashboard/teachers"
        : "/dashboard/students";
  };

  // ===============================
  // Google Login
  // ===============================

  const handleGoogleLogin = async () => {

    try {

      setError("");
      setSuccess("");
      setIsGoogleLoading(true);

      await signIn("google", {
        callbackUrl:
          role === "professional"
            ? "/dashboard/teachers"
            : "/dashboard/students"
      });

    } catch (err) {

      console.error("Google Login Error:", err);

      setError("Google login failed.");

      setIsGoogleLoading(false);

    }

  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e0f7fa] via-[#f1f8e9] to-[#e3f2fd]">

      <div className="flex w-full max-w-5xl min-h-[80vh] rounded-3xl shadow-2xl overflow-hidden bg-white">

        {/* Left Side */}

        <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-linear-to-b from-[#b2dfdb] to-[#c8e6c9] p-10 relative">

          <div className="absolute top-8 left-8 text-3xl font-extrabold text-[#1ec28e]">
            LOOKIT
          </div>

          <Image
            src="/about1.png"
            alt="Login Illustration"
            width={400}
            height={400}
            className="w-80 h-80 object-contain"
          />

          <div className="mt-8 text-center">

            <h2 className="text-4xl font-bold text-[#195a44]">
              Welcome Back!
            </h2>

            <p className="text-lg text-[#388e3c]">
              Sign in to access your dashboard.
            </p>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex flex-1 flex-col justify-center items-center p-8 sm:p-12 bg-white">

          <div className="w-full max-w-xs mx-auto">

            <h1 className="text-3xl font-bold text-[#195a44] mb-6 text-center">
              Log in to LOOKIT
            </h1>

            {/* Role Switch */}

            <div className="flex justify-center mb-6">

              <button
                type="button"
                onClick={() => setRole("student")}
                className={`px-6 py-2 rounded-l-full font-semibold border
                ${role === "student"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-[#1ec28e]"
                  : "bg-gray-100 text-[#195a44] border-gray-200"}`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole("professional")}
                className={`px-6 py-2 rounded-r-full font-semibold border
                ${role === "professional"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-[#1ec28e]"
                  : "bg-gray-100 text-[#195a44] border-gray-200"}`}
              >
                Professional
              </button>

            </div>

            {/* Errors */}

            {error && (
              <div className="mb-4 text-red-600 text-center text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 text-green-600 text-center text-sm">
                {success}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleCredentialsLogin}
              className="space-y-4"
            >

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email address"
                className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1ec28e]"
                required
              />

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Password"
                  className="w-full h-12 px-4 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1ec28e]"
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1ec28e]"
                  onClick={() =>
                    setShowPassword((cur) => !cur)
                  }
                >

                  {showPassword
                    ? <EyeOff size={20}/>
                    : <Eye size={20}/>}

                </button>

              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:bg-[#15996b] transition disabled:opacity-50 flex items-center justify-center"
              >

                {isSubmitting
                  ? <Loader2 className="animate-spin" size={20}/>
                  : "Log in"}

              </button>

            </form>

            {/* Divider */}

            <div className="my-6 flex items-center justify-center gap-2">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-500">or</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Button with Official Icon */}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full h-12 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-base flex items-center justify-center gap-3 transition hover:bg-gray-50 hover:shadow-md active:scale-98"
            >

              {isGoogleLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {/* Official Google G Logo */}
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}

            </button>

            <p className="mt-8 text-center text-sm text-gray-500">

              Don't have an account?{' '}

              <Link
                href="/signup"
                className="font-semibold text-[#1ec28e] hover:text-[#15996b] transition"
              >
                Create account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </main>

  );

}