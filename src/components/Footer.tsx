"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      router.push("/alert");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const payload = (await response.json()) as { redirectTo?: string };
      router.push(payload.redirectTo || "/alert");
    } catch {
      router.push("/alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="mt-28 bg-[#0b111a] px-4 pb-10 text-[#c7ced8] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="-translate-y-1/2">
          <div className="mx-auto flex w-full max-w-2xl items-center rounded-full border border-white/10 bg-white px-2 py-1.5 shadow-[0_15px_40px_rgba(2,8,23,0.35)]">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleSubscribe();
                }
              }}
              className="h-11 flex-1 rounded-full bg-transparent px-5 text-sm text-[#374151] placeholder:text-[#9ca3af] outline-none"
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void handleSubscribe()}
              className="h-11 rounded-full bg-[#1ec28e] px-7 text-xs font-semibold tracking-[0.12em] text-white transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "CHECKING..." : "SUBSCRIBE"}
            </button>
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