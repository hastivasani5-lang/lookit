"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

type UpcomingClass = {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalImage: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  link: string;
  description: string;
};

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23e6f4ef'/%3E%3Ccircle cx='40' cy='30' r='18' fill='%2398b8ab'/%3E%3Crect x='14' y='54' width='52' height='30' rx='20' fill='%2398b8ab'/%3E%3C/svg%3E";

export default function UpcomingClasses() {
  const [classes, setClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [selectedClass, setSelectedClass] = useState<UpcomingClass | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetch("/api/upcoming-classes")
      .then((r) => r.json())
      .then((data: { classes?: UpcomingClass[] }) => setClasses(data.classes ?? []))
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  const openBooking = (cls: UpcomingClass) => {
    setSelectedClass(cls);
    setStudentName(""); setStudentEmail(""); setStudentPhone("");
    setMessage(""); setBookingError(""); setBookingSuccess(false);
  };

  const closeBooking = () => {
    setSelectedClass(null);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    if (!studentName.trim() || !studentEmail.trim()) {
      setBookingError("Name and email are required.");
      return;
    }
    setBookingError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/advance-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass.id,
          classTitle: selectedClass.title,
          classDate: selectedClass.date,
          classTime: selectedClass.time,
          platform: selectedClass.platform,
          professionalId: selectedClass.professionalId,
          professionalName: selectedClass.professionalName,
          studentName, studentEmail, studentPhone, message,
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) { setBookingError(data.message || "Booking failed."); return; }
      setBookingSuccess(true);
    } catch {
      setBookingError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <div className="mx-auto mb-16 max-w-7xl text-center lg:text-left">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">
            <div className="w-full lg:w-1/2" data-aos="fade-right">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
                <span className="h-2 w-2 rounded-full bg-[#1ec28e]"></span>
                Upcoming Classes
              </div>
              <div className="mt-3 w-full h-px bg-gray-300"></div>
            </div>
            <div className="w-full lg:w-1/2" data-aos="fade-left">
              <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-right">
                Learn from the best <br />instructors in the industry
              </h2>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#1ec28e] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && classes.length === 0 && (
          <div className="py-16 text-gray-400 text-sm">No upcoming classes scheduled yet.</div>
        )}

        {!loading && classes.length > 0 && (
          <div className="overflow-hidden mt-16 pt-12 pb-8 group">
            <div
              className="flex gap-10 animate-marquee group-hover:paused-marquee"
              style={{ width: "max-content" }}
            >
              {[...classes, ...classes].map((cls, index) => (
                <div key={`${cls.id}-${index}`} className="relative flex justify-center">
                  <div className="absolute w-48 h-48 bg-[#1ec28e]/20 rounded-3xl rotate-12 top-6" />
                  <div className="relative bg-white rounded-2xl shadow-lg p-6 w-72 text-center">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                      <Image
                        src={cls.professionalImage || PLACEHOLDER_SVG}
                        alt={cls.professionalName}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-white shadow-md object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_SVG; }}
                      />
                    </div>
                    <div className="mt-12">
                      <h3 className="text-base font-bold text-gray-800 line-clamp-1">{cls.title}</h3>
                      <p className="text-sm text-[#1ec28e] font-semibold mt-1">{cls.professionalName}</p>
                      <div className="mt-3 space-y-1 text-xs text-gray-500">
                        <p>📅 {cls.date} &nbsp; ⏰ {cls.time}</p>
                        {cls.duration && <p>⏱ {cls.duration}</p>}
                        <p>📡 {cls.platform}</p>
                      </div>
                      {cls.description && (
                        <p className="text-gray-400 text-xs mt-2 line-clamp-2">{cls.description}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => openBooking(cls)}
                        className="mt-3 inline-block rounded-full bg-[#1ec28e] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#17a87a] transition"
                      >
                        Join Now
                      </button>
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow">⭐</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Booking Modal ─────────────────────────────────────────────── */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1ec28e]">Advance Booking</p>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedClass.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedClass.date} · {selectedClass.time} · {selectedClass.platform}
                </p>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {bookingSuccess ? (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#effaf6]">
                  <svg className="h-8 w-8 text-[#1ec28e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Booking Confirmed!</h4>
                <p className="text-sm text-slate-500">
                  Your advance booking for <span className="font-semibold text-slate-700">{selectedClass.title}</span> has been submitted.
                  The professional will confirm shortly.
                </p>
                <button
                  type="button"
                  onClick={closeBooking}
                  className="mt-2 rounded-full bg-[#1ec28e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#17a87a] transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message (optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any questions or notes for the instructor..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                  />
                </div>

                {bookingError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{bookingError}</div>
                )}

                <div className="flex gap-3 pt-2 pb-2">
                  <button
                    type="button"
                    onClick={closeBooking}
                    className="flex-1 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-10 rounded-lg bg-[#1ec28e] text-sm font-semibold text-white hover:bg-[#17a87a] transition disabled:opacity-60"
                  >
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
