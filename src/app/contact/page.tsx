"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send, Bell, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const COUNTRIES = [
  { name: "India",          code: "IN", dial: "+91",  digits: 10, flag: "🇮🇳" },
  { name: "United States",  code: "US", dial: "+1",   digits: 10, flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial: "+44",  digits: 10, flag: "🇬🇧" },
  { name: "UAE",            code: "AE", dial: "+971",  digits: 9, flag: "🇦🇪" },
  { name: "Canada",         code: "CA", dial: "+1",   digits: 10, flag: "🇨🇦" },
  { name: "Australia",      code: "AU", dial: "+61",  digits: 9,  flag: "🇦🇺" },
  { name: "Germany",        code: "DE", dial: "+49",  digits: 11, flag: "🇩🇪" },
  { name: "France",         code: "FR", dial: "+33",  digits: 9,  flag: "🇫🇷" },
  { name: "Singapore",      code: "SG", dial: "+65",  digits: 8,  flag: "🇸🇬" },
  { name: "Pakistan",       code: "PK", dial: "+92",  digits: 10, flag: "🇵🇰" },
  { name: "Bangladesh",     code: "BD", dial: "+880", digits: 10, flag: "🇧🇩" },
  { name: "Nepal",          code: "NP", dial: "+977", digits: 10, flag: "🇳🇵" },
];

function PhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const [digits, setDigits] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelected(country);
    setOpen(false);
    setDigits("");
    onChange(`${country.dial}`);
  };

  const handleDigitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const limited = raw.slice(0, selected.digits);
    setDigits(limited);
    onChange(`${selected.dial}${limited}`);
  };

  if (!mounted) {
    return (
      <div className="flex rounded-xl border border-gray-200 bg-gray-50 h-[46px] animate-pulse" />
    );
  }

  return (
    <div className="flex rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#1ec28e] focus-within:ring-2 focus-within:ring-[#1ec28e]/20 transition">
      {/* Country selector */}
      <div className="relative" ref={dropRef}>
        <button type="button" onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 px-3 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border-r border-gray-200 hover:bg-gray-200 transition whitespace-nowrap h-full">
          <span>{selected.flag}</span>
          <span className="text-xs text-gray-500">{selected.dial}</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
        {open && (
          <div className="absolute left-0 top-full z-[9999] mt-1 w-52 rounded-xl border border-gray-100 bg-white shadow-xl max-h-60 overflow-y-auto">
            {COUNTRIES.map((c) => (
              <button key={c.code} type="button" onClick={() => handleCountrySelect(c)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-[#effaf6] transition ${selected.code === c.code ? "bg-[#effaf6] font-semibold text-[#1ec28e]" : "text-gray-700"}`}>
                <span>{c.flag}</span>
                <span className="flex-1">{c.name}</span>
                <span className="text-xs text-gray-400">{c.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Number input */}
      <input
        type="tel"
        value={digits}
        onChange={handleDigitChange}
        placeholder={`${"X".repeat(selected.digits)}`}
        maxLength={selected.digits}
        className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400 text-gray-800"
      />
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", agreedToTerms: false });
  const [newsletter, setNewsletter] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError((data as { message?: string }).message ?? "Failed to send message. Please try again.");
        return;
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      return;
    }
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "", agreedToTerms: false });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f6f9f8]">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 px-4 text-center"
          style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 60%, #34d399 100%)" }}>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white mb-4">
              💬 Get In Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              We&apos;d Love to<br /><span className="text-yellow-300">Talk to You</span>
            </h1>
            <p className="text-white/80 text-base">
              Have a question or want to work together? Reach out and we&apos;ll get back to you shortly.
            </p>
          </motion.div>
        </section>

        {/* ── INFO CARDS ───────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Phone, label: "Call Us",        value: "+91 93279 42704",      bg: "bg-[#effaf6]", color: "text-[#1ec28e]" },
              { icon: Mail,  label: "Email Us",       value: "hello@lookit.com",     bg: "bg-blue-50",   color: "text-blue-600" },
              { icon: MapPin,label: "Headquarters",   value: "Surat, Gujarat, India",bg: "bg-purple-50", color: "text-purple-600" },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center hover:-translate-y-1 transition-all">
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-5 h-5 ${c.color}`} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{c.value}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── FORM + NEWSLETTER ────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-14">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-8">

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }} viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Send a Message</h2>
              <p className="text-sm text-gray-500 mb-6">Fill out the form and we&apos;ll respond within 24 hours.</p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#effaf6] flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#1ec28e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Message Sent!</h3>
                  <p className="text-sm text-gray-500">We&apos;ll get back to you soon.</p>
                  <button onClick={() => { setSubmitted(false); setFormError(""); }}
                    className="mt-4 text-sm text-[#1ec28e] font-semibold hover:underline">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com" required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#1ec28e] focus:bg-white focus:ring-2 focus:ring-[#1ec28e]/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                      <PhoneInput
                        value={form.phone}
                        onChange={(v) => setForm({ ...form, phone: v })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name" required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#1ec28e] focus:bg-white focus:ring-2 focus:ring-[#1ec28e]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                    <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="What is this about?" required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#1ec28e] focus:bg-white focus:ring-2 focus:ring-[#1ec28e]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help you?" rows={4} required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#1ec28e] focus:bg-white focus:ring-2 focus:ring-[#1ec28e]/20 resize-none" />
                  </div>
                  <div className="flex items-start gap-2">
                    <input id="agreedToTerms" type="checkbox" checked={form.agreedToTerms}
                      onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })} required
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1ec28e] focus:ring-[#1ec28e]" />
                    <label htmlFor="agreedToTerms" className="text-xs text-gray-500">
                      I agree to the <span className="text-[#1ec28e] font-semibold">Terms and Conditions</span>
                    </label>
                  </div>
                  {formError && (
                    <p className="text-sm text-red-600 font-medium">{formError}</p>
                  )}
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:scale-[1.01] hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}>
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Newsletter */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}
              className="rounded-3xl overflow-hidden relative flex flex-col"
              style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 100%)" }}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:20px_20px] pointer-events-none" />
              <div className="relative p-8 flex flex-col flex-1">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Our Newsletter</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Stay updated with the latest courses, expert tips, and exclusive offers. Subscribe and never miss out!
                </p>

                {newsletterDone ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">You&apos;re subscribed!</p>
                  </div>
                ) : (
                  <div className="space-y-3 mt-auto">
                    <input type="email" value={newsletter} onChange={(e) => setNewsletter(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:bg-white/30 transition" />
                    <button type="button" onClick={() => { if (newsletter) setNewsletterDone(true); }}
                      className="w-full rounded-xl bg-white py-3 text-sm font-bold text-[#0d7a57] transition hover:bg-white/90 hover:shadow-lg">
                      Subscribe Now →
                    </button>
                  </div>
                )}

                {/* Decorative circles */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute top-10 -right-5 w-20 h-20 rounded-full bg-white/10" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAP ──────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-14">
          <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100">
            <iframe
              title="Map"
              src="https://maps.google.com/maps?q=surat+gujarat&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-[320px] border-0"
            />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
