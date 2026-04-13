"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const footerPages = [
  { label: "Home", href: "/" },
  { label: "Find Experts", href: "/directory" },
  { label: "Categories", href: "/categories" },
  { label: "Professionals", href: "/professionals" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const payload = (await response.json()) as { redirectTo?: string };

      if (!payload.redirectTo) {
        router.push("/alert");
        return;
      }

      router.push(payload.redirectTo);
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

        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Get in Touch</h3>
            <p className="mb-4 text-base leading-relaxed text-[#9aa4b2]">
              Educate the ultimate destination for We are committed to transforming without standards
            </p>

            <p className="mb-2 flex items-center gap-2 text-2xl font-semibold text-white">
              📞 +123 (4567) 890
            </p>

            <p className="flex items-center gap-2 text-xl text-[#9aa4b2]">
              ✉ example@gmail.com
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Pages</h3>
            <ul className="space-y-3 text-xl text-[#9aa4b2]">
              {footerPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="transition hover:text-white">
                    ➜ {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Recent Posts</h3>

            <div className="space-y-4">
              <div className="flex justify-center gap-3 lg:justify-start">
                <Image src="/blog-thumb1.png" width={60} height={60} className="rounded-lg object-cover" alt="" />
                <div>
                  <p className="text-xl text-[#d6dde7]">10 Proven Strategies to Online Learning</p>
                  <p className="text-base text-[#bca582]">8 Jan, 2025</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 lg:justify-start">
                <Image src="/blog-thumb2.png" width={60} height={60} className="rounded-lg object-cover" alt="" />
                <div>
                  <p className="text-xl text-[#d6dde7]">Trends that are shaping the Learning...</p>
                  <p className="text-base text-[#bca582]">8 Jan, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-base text-[#8b95a4]">
            © 2025 <span className="text-primary">Educate</span>. Designed By Dream IT Solution
          </p>

          <div className="flex gap-3">
            {["f", "x", "in", "p"].map((item, i) => (
              <div
                key={i}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}