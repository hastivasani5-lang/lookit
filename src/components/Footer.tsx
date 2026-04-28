"use client";

import Link from "next/link";
import { useState } from "react";
import SiteLogo from "@/components/SiteLogo";

const categoriesItems = [
  "Software Development",
  "Web Development",
  "Web Designing",
  "Business Classes",
  "Animation Classes",
  "Networking Classes",
];

const coursesItems = ["Angular", "Java", "HTML", "Devops", "Php Laravel", "Digital Marketing"];

const companyItems = ["Our Team", "Contact US", "About Us", "Services", "Blog News", "Online Classes"];

const supportItems = ["Home", "Sitemap", "Privacy Policy", "Cooky Policy", "Web User Plocy", "Terms and Services"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubscribe = async () => {
    const trimmedEmail = email.trim();

    // Clear previous messages
    setValidationError("");
    setSuccessMessage("");

    // Validation: Empty email
    if (!trimmedEmail) {
      setValidationError("Please enter your email address.");
      return;
    }

    // Validation: Invalid email format
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const payload = (await response.json()) as { redirectTo?: string; message?: string };

      // Check if email is not registered
      if (payload.redirectTo === "/alert" || !response.ok) {
        setValidationError("This email address is not registered.");
        return;
      }

      // Success
      setSuccessMessage("✓ Successfully subscribed!");
      setEmail("");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch {
      setValidationError("Unable to process your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Clear error message when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  return (
    <footer className="bg-[#0b111a] px-4 pb-10 text-[#c7ced8] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="-translate-y-1/2">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mx-auto flex items-center rounded-full border border-white/10 bg-white px-2 py-1.5 shadow-[0_15px_40px_rgba(2,8,23,0.35)]">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !isSubmitting) {
                    void handleSubscribe();
                  }
                }}
                className="h-11 flex-1 rounded-full bg-transparent px-5 text-sm text-[#374151] placeholder:text-[#9ca3af] outline-none"
              />
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleSubscribe()}
                className="h-11 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-7 text-xs font-semibold tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "CHECKING..." : "SUBSCRIBE"}
              </button>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="mt-2 text-sm text-red-400 px-5">
                {validationError}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mt-2 text-sm text-emerald-400 px-5">
                {successMessage}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div>
            <SiteLogo size="footer" onDark className="mb-4" />
            <p className="mb-3 text-sm leading-relaxed text-[#9aa4b2]">Second stret, New York, NY 10012, US</p>
            <p className="mb-3 text-sm leading-relaxed text-[#9aa4b2]">info@example.com, info@edomi.com</p>
            <p className="mb-1.5 text-sm leading-relaxed text-[#9aa4b2]">+ 01 234 567 88</p>
            <p className="text-sm leading-relaxed text-[#9aa4b2]">+ 01 234 567 89</p>

            <div className="mt-6 flex gap-2">
              {["f", "t", "g+", "in", "gh"].map((item, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Categories</h3>
            <ul className="space-y-3 text-sm text-[#9aa4b2]">
              {categoriesItems.map((item) => (
                <li key={item}>
                  <Link href="/categories" className="transition hover:text-white">
                    ➜ {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Courses</h3>
            <ul className="space-y-3 text-sm text-[#9aa4b2]">
              {coursesItems.map((item) => (
                <li key={item}>
                  <Link href="/courses" className="transition hover:text-white">
                    ➜ {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Our Company</h3>
            <ul className="space-y-3 text-sm text-[#9aa4b2]">
              {companyItems.map((item) => (
                <li key={item}>
                  <Link href={item === "Contact US" ? "/contact" : "/about"} className="transition hover:text-white">
                    ➜ {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Support</h3>
            <ul className="space-y-3 text-sm text-[#9aa4b2]">
              {supportItems.map((item) => (
                <li key={item}>
                  <Link href="/" className="transition hover:text-white">
                    ➜ {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-base text-[#8b95a4]">
            Copyright © 2026 <span className="text-primary">Edomi</span>. Designed with ❤️ by <span className="text-primary">Spruko</span> All rights reserved.
          </p>

          <div />
        </div>
      </div>
    </footer>
  );
}