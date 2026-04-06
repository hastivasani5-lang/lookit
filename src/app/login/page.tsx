"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-300 to-lime-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="relative w-full max-w-md h-96">
            {/* Background elements */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Clock */}
              <div className="absolute top-12 left-20 w-16 h-16 border-4 border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-1 h-6 bg-gray-800 absolute"></div>
                <div className="w-6 h-1 bg-gray-800 absolute"></div>
              </div>

              {/* Plant pot left */}
              <div className="absolute top-16 -left-8">
                <div className="w-16 h-20 bg-white rounded-lg shadow-lg relative">
                  <div className="absolute -top-8 left-2 w-3 h-12 bg-green-600 rounded"></div>
                  <div className="absolute -top-6 left-5 w-3 h-10 bg-green-600 rounded"></div>
                  <div className="absolute -top-10 left-1 w-2 h-14 bg-green-600 rounded"></div>
                </div>
              </div>

              {/* Main Character */}
              <div className="relative z-10 mb-4">
                {/* Head */}
                <div className="w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2 relative">
                  {/* Hair */}
                  <div className="absolute -top-1 left-1 w-10 h-6 bg-amber-800 rounded-t-full"></div>
                  {/* Face */}
                  <div className="flex items-center justify-center h-full gap-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  </div>
                  {/* Beard */}
                  <div className="absolute bottom-1 left-2 w-8 h-2 border-b-2 border-amber-900"></div>
                </div>

                {/* Neck */}
                <div className="w-3 h-2 bg-amber-100 mx-auto"></div>

                {/* Body */}
                <div className="w-16 h-20 bg-green-500 rounded-lg mx-auto flex items-center justify-center relative">
                  <div className="w-4 h-12 bg-blue-600 rounded mx-1"></div>
                  <div className="w-4 h-12 bg-blue-600 rounded mx-1"></div>
                </div>

                {/* Hands holding laptop */}
                <div className="absolute top-16 left-4 w-2 h-4 bg-amber-100 rounded-full"></div>
                <div className="absolute top-16 right-4 w-2 h-4 bg-amber-100 rounded-full"></div>

                {/* Laptop */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-14 bg-gray-800 rounded-lg shadow-lg border-4 border-gray-900"></div>

                {/* Shoes */}
                <div className="flex gap-4 justify-center mt-1">
                  <div className="w-6 h-4 bg-purple-600 rounded-full"></div>
                  <div className="w-6 h-4 bg-purple-600 rounded-full"></div>
                </div>
              </div>

              {/* Desk */}
              <div className="w-56 h-4 bg-green-700 rounded-full shadow-2xl mt-4"></div>

              {/* Plant pot right */}
              <div className="absolute -bottom-8 right-12">
                <div className="w-20 h-24 bg-gray-300 rounded-t-3xl shadow-lg relative">
                  <div className="absolute -top-12 left-2 w-4 h-16 bg-green-600 rounded-full"></div>
                  <div className="absolute -top-10 left-8 w-4 h-14 bg-green-600 rounded-full"></div>
                  <div className="absolute -top-14 left-14 w-4 h-18 bg-green-600 rounded-full"></div>
                </div>
              </div>

              {/* Chair */}
              <div className="absolute -bottom-6 left-12">
                <div className="w-12 h-3 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 max-w-md">
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="text-2xl font-bold text-green-600">
                <span className="text-green-500">📚</span> EducateX
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Welcome back
            </h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-green-500 transition text-gray-700 placeholder-gray-400"
              />

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-green-500 transition text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-lime-500 hover:bg-lime-600 text-gray-900 font-bold py-3 rounded-full transition mt-6"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="text-center text-gray-500 text-sm my-6">
              or sign in with
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button className="w-12 h-12 rounded-full bg-lime-100 hover:bg-lime-200 flex items-center justify-center font-bold text-lg transition">
                G
              </button>
              <button className="w-12 h-12 rounded-full bg-lime-100 hover:bg-lime-200 flex items-center justify-center transition">
                ⊞
              </button>
              <button className="w-12 h-12 rounded-full bg-lime-100 hover:bg-lime-200 flex items-center justify-center transition">
                ⚙
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center mb-6">
              <Link href="#" className="text-lime-600 hover:text-lime-700 text-sm font-semibold">
                Forgot password?
              </Link>
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/signup" className="text-lime-600 hover:text-lime-700 font-semibold">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
