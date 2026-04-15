"use client";
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Globe,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

const footerColumns = [
  {
    title: "Categories",
    items: [
      { label: "Software Development", href: "/categories" },
      { label: "Web Development", href: "/categories" },
      { label: "Web Designing", href: "/categories" },
      { label: "Business Classes", href: "/categories" },
      { label: "Animation Classes", href: "/categories" },
      { label: "Networking Classes", href: "/categories" },
    ],
  },
  {
    title: "Courses",
    items: [
      { label: "Angular", href: "/courses" },
      { label: "Java", href: "/courses" },
      { label: "HTML", href: "/courses" },
      { label: "Devops", href: "/courses" },
      { label: "Php Laravel", href: "/courses" },
      { label: "Digital Marketing", href: "/courses" },
    ],
  },
  {
    title: "Our Company",
    items: [
      { label: "Our Team", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/about" },
      { label: "Blog News", href: "/blog" },
      { label: "Online Classes", href: "/courses" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Home", href: "/" },
      { label: "Sitemap", href: "/sitemap" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cooky Policy", href: "/privacy-policy" },
      { label: "Web User Policy", href: "/privacy-policy" },
      { label: "Terms and Services", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { label: "Website", icon: Globe, href: "https://example.com" },
  { label: "Email", icon: Mail, href: "mailto:info@example.com" },
  { label: "Chat", icon: MessageCircle, href: "https://example.com" },
  { label: "Send", icon: Send, href: "https://example.com" },
  { label: "Courses", icon: BookOpen, href: "/courses" },
];

const paymentLabels = ["American Express", "VISA", "MC", "maestro", "PayPal", "DISCOVER"];

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
    <footer className="mt-24 bg-[#242637] text-white">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#5b61d9_0%,#5d57e6_45%,#7a66eb_100%)] px-4 pt-12 text-white">
        <div className="absolute inset-0 opacity-35">
          <div className="absolute left-10 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute left-1/3 top-16 h-px w-56 rotate-12 bg-white/20" />
          <div className="absolute right-1/4 top-24 h-px w-72 -rotate-12 bg-white/20" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_60%)]" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 pb-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Subscribe</h2>
            <p className="mt-4 text-lg text-white/90">Many desktop publishing packages and web page editors.</p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="flex overflow-hidden rounded-xl bg-white shadow-[0_18px_45px_rgba(11,17,26,0.25)]">
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void handleSubscribe();
                  }
                }}
                className="h-14 flex-1 px-5 text-base text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleSubscribe()}
                className="h-14 bg-[#ef5350] px-8 text-base font-medium text-white transition hover:bg-[#e54744] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-10 rounded-t-[48px] bg-[#242637] px-4 pb-10 pt-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
            <div>
              <SiteLogo size="footer" onDark className="mb-5" />
              <p className="max-w-sm text-sm leading-7 text-white/55">Second street, New York, NY 10012, US</p>
              <p className="mt-4 text-sm leading-7 text-white/55">info@example.com, info@edomi.com</p>
              <p className="mt-2 text-sm leading-7 text-white/55">+ 01 234 567 88</p>
              <p className="text-sm leading-7 text-white/55">+ 01 234 567 89</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-md bg-white/8 text-white transition hover:bg-white/15"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-5 text-2xl font-medium text-white">{column.title}</h3>
                <ul className="space-y-4 text-sm text-white/50">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="inline-flex items-center gap-2 transition hover:text-white">
                        <ChevronRight className="h-4 w-4 text-white/40" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 border-b border-white/10 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3 opacity-75">
              {paymentLabels.map((label) => (
                <span
                  key={label}
                  className="rounded border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <select className="h-11 w-56 appearance-none rounded-lg border border-white/10 bg-[#f7f7fb] px-4 pr-10 text-sm text-slate-700 outline-none">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
              <div className="relative">
                <select className="h-11 w-56 appearance-none rounded-lg border border-white/10 bg-[#f7f7fb] px-4 pr-10 text-sm text-slate-700 outline-none">
                  <option>USD</option>
                  <option>INR</option>
                  <option>EUR</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-5 py-7 text-center lg:flex-row lg:text-left">
            <p className="text-sm text-white/70">
              Copyright © 2026 <span className="text-[#7c86ff]">Edomi</span>. Designed with <span className="text-[#ef5350]">♥</span> by <span className="text-[#7c86ff]">Spruko</span> All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}