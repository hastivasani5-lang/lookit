"use client";

import { useState } from "react";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  agreedToTerms: boolean;
};

const initialState: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
  agreedToTerms: false,
};

export default function ContactFormCard() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatusMessage("");
    setStatusType("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: form.subject,
          message: form.message,
          agreedToTerms: form.agreedToTerms,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setStatusType("error");
        setStatusMessage(payload.message ?? "Unable to send message.");
        return;
      }

      setStatusType("success");
      setStatusMessage("Your message has been sent successfully.");
      setForm(initialState);
    } catch {
      setStatusType("error");
      setStatusMessage("Unable to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-[22px] border border-[#ececec] bg-white px-5 py-7 shadow-[0_18px_40px_rgba(15,23,42,0.04)] md:px-7 md:py-9 lg:px-8 lg:py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#22c58b]">Contact Us</p>
      <h3 className="mt-2 text-center text-3xl font-extrabold tracking-[-0.02em] text-[#1d2027] md:text-4xl">Feel Free to Contact Us</h3>

      <form onSubmit={onSubmit} className="mt-7 space-y-4 md:space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <input
            type="text"
            placeholder="Your Name *"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="h-[52px] rounded-lg border border-[#e5e5e5] px-5 text-base font-medium text-[#18323f] outline-none placeholder:text-[#18323f]"
            required
          />
          <input
            type="text"
            placeholder="Phone No"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            className="h-[52px] rounded-lg border border-[#e5e5e5] px-5 text-base font-medium text-[#18323f] outline-none placeholder:text-[#18323f]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <input
            type="email"
            placeholder="Enter E-Mail *"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="h-[52px] rounded-lg border border-[#e5e5e5] px-5 text-base font-medium text-[#18323f] outline-none placeholder:text-[#18323f]"
            required
          />
          <input
            type="text"
            placeholder="Select Subjects *"
            value={form.subject}
            onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
            className="h-[52px] rounded-lg border border-[#e5e5e5] px-5 text-base font-medium text-[#18323f] outline-none placeholder:text-[#18323f]"
            required
          />
        </div>

        <textarea
          rows={4}
          placeholder="Write Message :"
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="min-h-[138px] w-full rounded-lg border border-[#e5e5e5] px-5 py-4 text-base font-medium text-[#18323f] outline-none placeholder:text-[#18323f]"
          required
        />

        <label className="flex items-center gap-3 pt-1 text-base font-medium text-[#666b72]">
          <input
            type="checkbox"
            checked={form.agreedToTerms}
            onChange={(event) => setForm((current) => ({ ...current, agreedToTerms: event.target.checked }))}
            className="h-4 w-4 rounded border-[#cfcfcf] accent-[#22c58b]"
          />
          <span>Agree with Terms and Conditions</span>
        </label>

        {statusMessage ? (
          <p className={`text-sm ${statusType === "error" ? "text-red-600" : "text-emerald-600"}`}>{statusMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 inline-flex h-[48px] items-center justify-center rounded-full bg-[#22c58b] px-8 text-base font-bold text-white transition hover:bg-[#1dad7a] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
