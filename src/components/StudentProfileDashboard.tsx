
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Printer,
  Share2,
  TriangleAlert,
  Users,
  Video,
} from "lucide-react";

type DashboardTab =
  | "profile"
  | "calendar"
  | "wishlist"
  | "following"
  | "edit"
  | "courses"
  | "followers"
  | "reviews"
  | "buy-courses";

type CourseCard = {
  id: string;
  title: string;
  amount: string;
  badge: string;
  rating: number;
  enrollments: number;
  kind: "book" | "video";
};

type StudentProfileDashboardProps = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    contactNumber?: string;
    location?: string;
    createdAt: string;
  };
  library: {
    purchasedBooks: Array<{
      id: string;
      title: string;
      amount: string;
      contentId?: string;
      accessUrl?: string;
      source?: string;
      purchasedAt?: string;
    }>;
    watchedVideos: Array<{
      id: string;
      title: string;
      amount: string;
      contentId?: string;
      accessUrl?: string;
      provider?: string;
      watchedAt?: string;
    }>;
  };
};

const tabItems: Array<{ key: string; label: string }> = [
   { key: "following", label: "Following" },
  { key: "buy-courses", label: "Buy Courses" },
  { key: "calendar", label: "Calendar" },
  { key: "wishlist", label: "Wishlist" },
];

const skillRows = [
  { label: "Adobe Photoshop", value: 85 },
  { label: "Digital Marketing", value: 65 },
  { label: "HTML", value: 95 },
  { label: "Web Server Management", value: 60 },
  { label: "Bootstrap", value: 88 },
  { label: "Visual Designing", value: 80 },
];

const followersSeed = [
  { id: "f1", name: "Olivia Parker", role: "Student", status: "Active" },
  { id: "f2", name: "Ava Martinez", role: "Student", status: "Active" },
  { id: "f3", name: "Sophia Khan", role: "Learner", status: "Pending" },
  { id: "f4", name: "Noah Patel", role: "Student", status: "Active" },
];

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = String(parsed.getUTCDate()).padStart(2, "0");
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const year = parsed.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

function getWebsiteFromEmail(email: string) {
  const domain = email.split("@")[1]?.trim();
  return domain ? `https://${domain}` : "https://lookit.com";
}


function CalendarWidget({ userId }: { userId: string }) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const storageKey = `lookit-work-session-${userId}-${todayKey}`;
  const goalKey = `lookit-work-goal-${userId}`;

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [workedHours, setWorkedHours] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeline, setTimeline] = useState<Array<{ start: string; end: string; hours: number }>>([]);
  const intervalRef = useState<ReturnType<typeof setInterval> | null>(null);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [maxHours, setMaxHours] = useState(12);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      // Load goal
      const savedGoal = localStorage.getItem(goalKey);
      if (savedGoal) setMaxHours(Number(savedGoal) || 12);

      // Load today's session data
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw) as { workedHours: number; timeline: Array<{ start: string; end: string; hours: number }> };
        if (typeof data.workedHours === "number") setWorkedHours(data.workedHours);
        if (Array.isArray(data.timeline)) setTimeline(data.timeline);
      }
    } catch { /* ignore */ }
  }, [storageKey, goalKey]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ workedHours, timeline }));
    } catch { /* ignore */ }
  }, [workedHours, timeline, storageKey, mounted]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleStartStop = () => {
    if (!isTracking) {
      const now = new Date();
      setStartTime(now);
      setSessionStart(now);
      setIsTracking(true);
      // Set goal-based auto-logout timer
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      const remainingMs = Math.max(0, (maxHours * 3600000) - (workedHours * 3600000));
      if (remainingMs > 0) {
        logoutTimerRef.current = setTimeout(() => {
          setShowLogoutPopup(true);
        }, remainingMs);
      }
    } else {
      const end = new Date();
      const diffHours = startTime ? (end.getTime() - startTime.getTime()) / 3600000 : 0;
      const rounded = Math.round(diffHours * 100) / 100;
      setWorkedHours(h => Math.round((h + rounded) * 100) / 100);
      setTimeline(prev => [...prev, {
        start: startTime ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
        end: end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hours: rounded,
      }]);
      setStartTime(null);
      setSessionStart(null);
      setIsTracking(false);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    }
  };

  const maxHours = 12;
  const progressPct = Math.min((workedHours / maxHours) * 100, 100);

  return (
    <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-5">
      {/* Calendar */}
      <div className="rounded-lg sm:rounded-xl lg:rounded-2xl border border-[#dbe8e4] bg-white p-2 sm:p-3 lg:p-5 shadow-sm w-full max-w-sm">
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
          <button onClick={prevMonth} className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full bg-[#f0faf7] hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white text-[#1ec28e] font-bold transition flex items-center justify-center text-xs sm:text-sm lg:text-base">‹</button>
          <span className="font-bold text-[#1f2937] text-xs sm:text-sm lg:text-base">{monthNames[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full bg-[#f0faf7] hover:bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-white text-[#1ec28e] font-bold transition flex items-center justify-center text-xs sm:text-sm lg:text-base">›</button>
        </div>
        <div className="grid grid-cols-7 mb-0.5 sm:mb-1 lg:mb-2">
          {dayNames.map(d => (
            <div key={d} className="text-center text-[9px] sm:text-[10px] lg:text-xs font-semibold text-[#9ca3af] py-0.5 sm:py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5 sm:gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const dateStr = `${viewYear}-${viewMonth}-${day}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`mx-auto w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full text-xs sm:text-sm font-medium transition flex items-center justify-center
                  ${isSelected ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" :
                    isToday ? "bg-[#e8f7f1] text-[#1ec28e] font-bold ring-1 sm:ring-2 ring-[#1ec28e]" :
                    "hover:bg-[#f0faf7] text-[#374151]"}`}
              >
                {day}
              </button>
            );
          })}
        </div>
        {selectedDate && (
          <div className="mt-2 sm:mt-3 lg:mt-4 rounded-md sm:rounded-lg lg:rounded-xl bg-[#f0faf7] px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-xs sm:text-sm text-[#1b8c65] font-medium">
            Selected: {monthNames[viewMonth]} {selectedDate.split("-")[2]}, {viewYear}
          </div>
        )}
        <div className="mt-1.5 sm:mt-2 lg:mt-3 text-[9px] sm:text-[10px] lg:text-xs text-center text-[#9ca3af]">
          Today: {monthNames[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
        </div>
      </div>

      {/* Work Timeline */}
      <div className="rounded-lg sm:rounded-xl lg:rounded-2xl border border-[#dbe8e4] bg-white p-2 sm:p-3 lg:p-5 shadow-sm flex-1">
        <h4 className="font-bold text-[#1f2937] text-xs sm:text-sm lg:text-base mb-0.5">Today's Work Hours</h4>
        <p className="text-[9px] sm:text-[10px] lg:text-xs text-[#9ca3af] mb-2 sm:mb-3 lg:mb-4">{today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>

        {/* Progress bar */}
        <div className="mb-0.5 sm:mb-1 lg:mb-2 flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-[#1b8c65]">{workedHours} hrs worked</span>
          <span className="text-[#9ca3af]">Goal: {maxHours} hrs</span>
        </div>
        <div className="h-1.5 sm:h-2 lg:h-3 w-full rounded-full bg-[#eceff5] overflow-hidden mb-2 sm:mb-3 lg:mb-4">
          <div
            className="h-1.5 sm:h-2 lg:h-3 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Start/Stop button */}
        <button
          onClick={handleStartStop}
          className={`w-full py-1 sm:py-1.5 lg:py-2.5 rounded-md sm:rounded-lg lg:rounded-xl text-xs sm:text-sm font-bold transition mb-2 sm:mb-3 lg:mb-5 ${
            isTracking
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90"
          }`}
        >
          {isTracking ? `⏹ Stop (started ${startTime?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})` : "▶ Start Work Session"}
        </button>

        {/* Timeline entries */}
        <div className="space-y-1 sm:space-y-1.5 lg:space-y-2 max-h-24 sm:max-h-32 lg:max-h-48 overflow-y-auto pr-1">
          {timeline.length === 0 ? (
            <p className="text-[9px] sm:text-[10px] lg:text-xs text-[#9ca3af] text-center py-2 sm:py-3 lg:py-4">No sessions logged yet. Press Start to begin.</p>
          ) : (
            [...timeline].reverse().map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 rounded-md sm:rounded-lg lg:rounded-xl bg-[#f8fbfa] border border-[#dbe8e4] px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 shrink-0" />
                <div className="flex-1 text-[9px] sm:text-[10px] lg:text-xs text-[#374151]">
                  <span className="font-semibold">{entry.start}</span> → <span className="font-semibold">{entry.end}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-[#1ec28e]">{entry.hours}h</span>
              </div>
            ))
          )}
        </div>

        {timeline.length > 0 && (
          <button
            onClick={() => {
              setTimeline([]); setWorkedHours(0);
              try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
            }}
            className="mt-1.5 sm:mt-2 lg:mt-3 text-[9px] sm:text-[10px] lg:text-xs text-red-400 hover:text-red-600 transition"
          >
            Reset today's log
          </button>
        )}
      </div>

      {/* 12hr Session Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Session Time Limit Reached</h3>
            <p className="text-sm text-gray-500 mb-2">
              You have been working for <span className="font-semibold text-emerald-600">{maxHours} hours</span> — your goal for today!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              For your wellbeing, please take a break. You will be logged out now.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLogoutPopup(false);
                  // Stop session
                  const end = new Date();
                  const diffHours = startTime ? (end.getTime() - startTime.getTime()) / 3600000 : 0;
                  const rounded = Math.round(diffHours * 100) / 100;
                  setWorkedHours(h => Math.round((h + rounded) * 100) / 100);
                  setTimeline(prev => [...prev, {
                    start: startTime ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
                    end: end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    hours: rounded,
                  }]);
                  setStartTime(null);
                  setSessionStart(null);
                  setIsTracking(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0d7a57, #1ec28e)" }}
              >
                Logout Now
              </button>
              <button
                onClick={() => {
                  setShowLogoutPopup(false);
                  // Restart 12hr timer
                  if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
                  logoutTimerRef.current = setTimeout(() => setShowLogoutPopup(true), 12 * 60 * 60 * 1000);
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentProfileDashboard({ user, library }: StudentProfileDashboardProps) {
  const profileStorageKey = `student-profile-preview-${user.id}`;
  const [activeTab, setActiveTab] = useState<DashboardTab>("buy-courses");
  const [likes, setLikes] = useState(678);
  const [actionMessage, setActionMessage] = useState("");
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.contactNumber ?? "+125 254 3562");
  const [editLocation, setEditLocation] = useState(user.location ?? "USA");
  const [editWebsite, setEditWebsite] = useState(getWebsiteFromEmail(user.email));
  const [profileAnswers, setProfileAnswers] = useState<any>(null);
  const [wishlistItems, setWishlistItems] = useState<Array<{ id: string; title: string; price: string; imageUrl: string; contentType: string; professionalName: string; slug: string }>>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [followingList, setFollowingList] = useState<Array<{ professionalId: string; professionalName: string | null; professionalImage: string | null; followedAt: string }>>([]);
  const [followingLoading, setFollowingLoading] = useState(false);

  useEffect(() => {
    try {
       const raw = window.localStorage.getItem(profileStorageKey);
      if (raw) {
        const saved = JSON.parse(raw) as {
          name?: string;
          email?: string;
          phone?: string;
          location?: string;
          website?: string;
        };
        if (typeof saved.name === "string" && saved.name.trim()) {
          setEditName(saved.name);
        }
        if (typeof saved.email === "string" && saved.email.trim()) {
          setEditEmail(saved.email);
        }
        if (typeof saved.phone === "string" && saved.phone.trim()) {
          setEditPhone(saved.phone);
        }
        if (typeof saved.location === "string" && saved.location.trim()) {
          setEditLocation(saved.location);
        }
        if (typeof saved.website === "string" && saved.website.trim()) {
          setEditWebsite(saved.website);
        }
      }
    
      const answersRaw = window.localStorage.getItem(`student_profile_answers_${user.id}`);
      if (answersRaw) {
        setProfileAnswers(JSON.parse(answersRaw));
      }
    } catch {
      // Ignore invalid saved data.
    }
  }, [profileStorageKey]);

  useEffect(() => {
    if (activeTab !== "wishlist") return;
    setWishlistLoading(true);
    fetch("/api/student/wishlist", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { items?: Array<{ id: string; title: string; price: string; imageUrl: string; contentType: string; professionalName: string; slug: string }> }) => {
        setWishlistItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => setWishlistItems([]))
      .finally(() => setWishlistLoading(false));
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "following") return;
    setFollowingLoading(true);
    fetch(`/api/follows?studentId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setFollowingList(Array.isArray(data) ? data : []);
      })
      .catch(() => setFollowingList([]))
      .finally(() => setFollowingLoading(false));
  }, [activeTab, user.id]);

  const courseCards = useMemo<CourseCard[]>(() => {
    const fromBooks = library.purchasedBooks.slice(0, 3).map((book, index) => ({
      id: `book-${book.id}`,
      title: book.title,
      amount: book.amount,
      badge: index === 0 ? "Popular" : "Book",
      rating: 4.1 + (index % 2) * 0.4,
      enrollments: 42525 + index * 1200,
      kind: "book" as const,
    }));

    const fromVideos = library.watchedVideos.slice(0, 3).map((video, index) => ({
      id: `video-${video.id}`,
      title: video.title,
      amount: video.amount,
      badge: index === 0 ? "High Rated" : "Video",
      rating: 4.4 + (index % 2) * 0.5,
      enrollments: 12095 + index * 980,
      kind: "video" as const,
    }));

    const merged = [...fromBooks, ...fromVideos];

    if (merged.length > 0) {
      return merged;
    }

    return [
      {
        id: "seed-1",
        title: "Business Management",
        amount: "$263.99",
        badge: "Popular",
        rating: 4.2,
        enrollments: 42525,
        kind: "book",
      },
      {
        id: "seed-2",
        title: "Networking Classes",
        amount: "$745.00",
        badge: "High Rated",
        rating: 5,
        enrollments: 12095,
        kind: "video",
      },
    ];
  }, [library.purchasedBooks, library.watchedVideos]);

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (navigator.share) {
        await navigator.share({ title: "Lookit Student Profile", url: shareUrl });
        setActionMessage("Shared successfully.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setActionMessage("Profile link copied.");
    } catch {
      setActionMessage("Could not share right now.");
    }
  };

  const handleReport = () => {
    window.location.href = `mailto:support@lookit.com?subject=${encodeURIComponent("Report profile issue")}`;
    setActionMessage("Report mail draft opened.");
  };

  const handlePrint = () => {
    window.print();
    setActionMessage("Print started.");
  };

  const handleEditSave = () => {
    const payload = {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      location: editLocation.trim(), 
      website: editWebsite.trim(),
    };

    window.localStorage.setItem(profileStorageKey, JSON.stringify(payload));
    setActionMessage("Profile details saved locally.");
    setActiveTab("profile");
  };

  return (
    <section className="h-full w-full p-1.5 sm:p-2.5 md:p-4">
      <div className="grid h-full gap-2 sm:gap-3 lg:gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-lg sm:rounded-xl lg:rounded-2xl border border-[#dbe8e4] bg-white shadow-sm sm:shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#e8eeec] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 text-center">
            <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 grid h-16 w-16 sm:h-20 sm:w-20 lg:h-26 lg:w-26 place-items-center overflow-hidden rounded-full border-3 sm:border-4 border-[#e9f8f2] bg-[#eef6f3] text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c5a48]">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="Student avatar" className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1f2937]">{user.name}</h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-[#6b7280]">{profileAnswers?.profession || "UI/UX Student"}</p>
            <div className="mt-1.5 sm:mt-2 lg:mt-3 flex items-center justify-center gap-0.5 sm:gap-1 text-[#f59e0b]">
              <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-[#d1d5db]">★</span>
              <span className="ml-1 sm:ml-2 text-xs font-semibold text-[#6b7280]">4.0</span>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 px-3 sm:px-4 lg:px-5 py-3 sm:py-4 lg:py-5 text-xs sm:text-sm text-[#4b5563]">
            <h3 className="text-sm sm:text-base font-semibold text-[#1f2937]">Contact Info</h3>
            {profileAnswers ? (
              <>
                {profileAnswers.country && (
                  <p className="flex items-center gap-1 sm:gap-2"><span className="font-semibold">Country:</span> <span className="truncate">{profileAnswers.country}</span></p>
                )}
                {profileAnswers.source && (
                  <p className="flex items-center gap-1 sm:gap-2"><span className="font-semibold">Heard About Us:</span> <span className="truncate">{profileAnswers.source}</span></p>
                )}
                {profileAnswers.studyTime && (
                  <p className="flex items-center gap-1 sm:gap-2"><span className="font-semibold">Daily Work Time:</span> <span className="truncate">{profileAnswers.studyTime}</span></p>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-xs sm:text-sm">No details provided yet.</p>
            )}
          </div>

          <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5">
            <button
              type="button"
              onClick={async () => {
                await signOut({ callbackUrl: "/" });
              }}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 sm:py-2 lg:py-2.5 text-xs sm:text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="h-full overflow-y-auto space-y-3 sm:space-y-4 lg:space-y-6 pr-1">
          <article className="rounded-lg sm:rounded-xl lg:rounded-2xl border border-[#dbe8e4] bg-white p-2 sm:p-3 lg:p-5 shadow-sm sm:shadow-[0_20px_40px_rgba(15,23,42,0.08)] md:p-6">
            {/* Minimal tab system for Profile and Calendar */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
              
              <button
                type="button"
                onClick={() => setActiveTab("buy-courses")}
                className={`rounded-md px-2 sm:px-2.5 lg:px-3.5 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium ${activeTab === "buy-courses" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Buy           
              </button>


              <button
                type="button"
                onClick={() => setActiveTab("calendar")}
                className={`rounded-md px-2 sm:px-2.5 lg:px-3.5 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium ${activeTab === "calendar" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Calendar
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("wishlist")}
                className={`rounded-md px-2 sm:px-2.5 lg:px-3.5 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium ${activeTab === "wishlist" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Wishlist
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("following")}
                className={`rounded-md px-2 sm:px-2.5 lg:px-3.5 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium ${activeTab === "following" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Following
              </button> 

            </div>
            {activeTab === "wishlist" && (
              <div className="my-3 sm:my-4 lg:my-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 lg:mb-4 text-[#1f2937]">Wishlist</h3>
                {wishlistLoading ? (
                  <p className="text-xs sm:text-sm text-gray-400">Loading...</p>
                ) : wishlistItems.length === 0 ? (
                  <div className="rounded-lg sm:rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-2 sm:p-3 lg:p-4">
                    <p className="text-xs sm:text-sm text-[#4b5563]">Your wishlist is empty. Heart items in the shop or categories to save them here.</p>
                  </div>
                ) : (
                  <div className="grid gap-1.5 sm:gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="rounded-lg sm:rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-2 sm:p-3 lg:p-4 flex flex-col gap-1 sm:gap-2">
                        {item.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.title} className="h-16 sm:h-20 lg:h-28 w-full object-cover rounded-md sm:rounded-lg" />
                        )}
                        <p className="font-semibold text-[#1f2937] line-clamp-2 text-xs sm:text-sm lg:text-base">{item.title}</p>
                        {item.professionalName && <p className="text-xs text-gray-500">By {item.professionalName}</p>}
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs sm:text-sm font-bold text-[#1ec28e]">{item.price || "—"}</span>
                          <span className="text-xs rounded-full bg-emerald-50 px-1 sm:px-1.5 lg:px-2 py-0.5 text-emerald-700 capitalize">{item.contentType}</span>
                        </div>
                        {item.slug && (
                          <Link href={`/shop/details/${item.slug}`} className="mt-1 text-center text-xs font-semibold text-[#1ec28e] hover:underline">
                            View in Shop →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="my-3 sm:my-4 lg:my-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 lg:mb-4 text-[#1f2937]">Following</h3>
                {followingLoading ? (
                  <p className="text-xs sm:text-sm text-gray-400">Loading...</p>
                ) : followingList.length === 0 ? (
                  <div className="rounded-lg sm:rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-2 sm:p-3 lg:p-4">
                    <p className="text-xs sm:text-sm text-[#4b5563]">You are not following anyone yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-1.5 sm:gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2">
                    {followingList.map((item) => (
                      <Link
                        key={item.professionalId}
                        href={`/professionals/${item.professionalId}`}
                        className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 rounded-lg sm:rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 hover:border-[#1ec28e] hover:bg-[#effaf6] transition-all"
                      >
                        <div className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full overflow-hidden bg-[#e8f7f1] flex items-center justify-center text-xs sm:text-sm font-bold text-[#1b8c65] shrink-0">
                          {item.professionalImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.professionalImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            (item.professionalName ?? "P").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1f2937] truncate text-xs sm:text-sm lg:text-base">{item.professionalName ?? "Professional"}</p>
                          <p className="text-xs text-[#6b7280]">Following since {new Date(item.followedAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs text-[#1ec28e] font-semibold">View →</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "calendar" && (
              <div className="my-4 sm:my-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#1f2937]">Calendar</h3>
                <CalendarWidget userId={user.id} />
              </div>
            )}
 

            {activeTab === "edit" ? (
              <div className="mt-3 sm:mt-4 lg:mt-6 grid gap-2 sm:gap-3 lg:gap-4 md:grid-cols-2">
                <label className="text-xs sm:text-sm font-medium text-[#374151]">
                  Full Name
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="mt-1 h-8 sm:h-9 lg:h-11 w-full rounded-lg sm:rounded-xl border border-[#dbe8e4] px-2 sm:px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="text-xs sm:text-sm font-medium text-[#374151]">
                  Email
                  <input
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    className="mt-1 h-8 sm:h-9 lg:h-11 w-full rounded-lg sm:rounded-xl border border-[#dbe8e4] px-2 sm:px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="text-xs sm:text-sm font-medium text-[#374151]">
                  Phone
                  <input
                    value={editPhone}
                    onChange={(event) => setEditPhone(event.target.value)}
                    className="mt-1 h-8 sm:h-9 lg:h-11 w-full rounded-lg sm:rounded-xl border border-[#dbe8e4] px-2 sm:px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="text-xs sm:text-sm font-medium text-[#374151]">
                  Location
                  <input
                    value={editLocation}
                    onChange={(event) => setEditLocation(event.target.value)}
                    className="mt-1 h-8 sm:h-9 lg:h-11 w-full rounded-lg sm:rounded-xl border border-[#dbe8e4] px-2 sm:px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="text-xs sm:text-sm font-medium text-[#374151] md:col-span-2">
                  Website
                  <input
                    value={editWebsite}
                    onChange={(event) => setEditWebsite(event.target.value)}
                    className="mt-1 h-8 sm:h-9 lg:h-11 w-full rounded-lg sm:rounded-xl border border-[#dbe8e4] px-2 sm:px-3 outline-none focus:border-primary"
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleEditSave}
                    className="rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 sm:px-4 lg:px-5 py-1 sm:py-1.5 lg:py-2.5 text-xs sm:text-sm font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut({ callbackUrl: "/" });
                    }}
                    className="rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 sm:px-4 lg:px-5 py-1 sm:py-1.5 lg:py-2.5 text-xs sm:text-sm font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : null}

            {activeTab === "courses" ? (
              <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                {courseCards.slice(0, 4).map((course) => (
                  <article key={course.id} className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#dbe8e4] bg-white shadow-sm">
                    <div className={`flex h-24 sm:h-34 items-center justify-center ${course.kind === "book" ? "bg-[#dff3fa]" : "bg-[#f1e9e0]"}`}>
                      {course.kind === "book" ? <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-[#0891b2]" /> : <Video className="h-8 w-8 sm:h-12 sm:w-12 text-[#b45309]" />}
                    </div>
                    <div className="p-3 sm:p-4">
                      <span className="rounded bg-gradient-to-r from-emerald-600 to-teal-600 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-white">{course.badge}</span>
                      <h4 className="mt-2 sm:mt-3 text-base sm:text-xl font-bold text-[#1f2937]">{course.title}</h4>
                      <p className="mt-1 text-xs sm:text-sm text-[#6b7280]">Structured student content with practical lessons.</p>
                      <div className="mt-2 sm:mt-3 flex items-center justify-between text-xs sm:text-sm">
                        <p className="font-semibold text-[#374151]">{course.rating.toFixed(1)}</p>
                        <p className="text-[#9ca3af]">({course.enrollments.toLocaleString()})</p>
                      </div>
                      <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-[#2c5a48]">{course.amount}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === "followers" ? (
              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                {followersSeed.map((follower) => (
                  <div key={follower.id} className="flex items-center justify-between rounded-lg sm:rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full bg-[#e8f7f1] text-xs sm:text-sm font-bold text-[#1b8c65]">
                        {follower.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-semibold text-[#1f2937] text-sm sm:text-base">{follower.name}</p>
                        <p className="text-xs text-[#6b7280]">{follower.role}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold ${follower.status === "Active" ? "bg-[#e8f7f1] text-[#1b8c65]" : "bg-[#fff7ed] text-[#c2410c]"}`}>
                      {follower.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {activeTab === "reviews" ? (
              <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-[#dbe8e4] bg-[#f8fbfa] p-3 sm:p-5">
                <h4 className="text-lg sm:text-xl font-bold text-[#1f2937]">Student Reviews Center</h4>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4b5563]">Write and manage reviews for professionals directly from your student dashboard.</p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                  <Link href="/dashboard/students/reviews" className="rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
                    Open Reviews Page
                  </Link>
                  <Link href="/dashboard/students/library" className="rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
                    Open Library
                  </Link>
                </div>
              </div>
            ) : null}

            {activeTab === "buy-courses" && (
              <div className="mt-3 sm:mt-4 lg:mt-6 space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Purchased Videos */}
                <section>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#1f2937] mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                    <Video className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-[#b45309]" /> Purchased Videos
                  </h3>
                  {library.watchedVideos.length === 0 ? (
                    <div className="rounded-lg sm:rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-3 sm:p-4 lg:p-6 text-center">
                      <Video className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-gray-300 mx-auto mb-1 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-[#4b5563]">No purchased videos yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2">
                      {library.watchedVideos.map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => {
                            sessionStorage.setItem("lookit-content-detail", JSON.stringify({ ...video, type: "video" }));
                            window.location.href = `/dashboard/students/content/${video.id}`;
                          }}
                          className="group text-left overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl border border-[#dbe8e4] bg-white shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-200 hover:-translate-y-0.5"
                        >
                          <div className="flex h-20 sm:h-24 lg:h-32 items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 relative">
                            <Video className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-orange-400 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 lg:top-3 lg:left-3 rounded-full bg-orange-500 px-1 sm:px-1.5 lg:px-2.5 py-0.5 text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-white">Video</span>
                          </div>
                          <div className="p-2 sm:p-3 lg:p-4">
                            <h4 className="text-xs sm:text-sm lg:text-base font-bold text-[#1f2937] group-hover:text-orange-600 transition-colors line-clamp-1">{video.title}</h4>
                            {video.provider && <p className="text-xs text-gray-400 mt-0.5">by {video.provider}</p>}
                            <div className="flex items-center justify-between mt-1.5 sm:mt-2 lg:mt-3">
                              <p className="text-sm sm:text-base lg:text-lg font-bold text-emerald-700">{video.amount}</p>
                              <span className="text-xs text-orange-500 font-semibold group-hover:underline">View Details →</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                {/* Purchased Books */}
                <section>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#1f2937] mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-[#0891b2]" /> Purchased Books
                  </h3>
                  {library.purchasedBooks.length === 0 ? (
                    <div className="rounded-lg sm:rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-3 sm:p-4 lg:p-6 text-center">
                      <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-gray-300 mx-auto mb-1 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-[#4b5563]">No purchased books yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2">
                      {library.purchasedBooks.map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => {
                            sessionStorage.setItem("lookit-content-detail", JSON.stringify({ ...book, type: "book" }));
                            window.location.href = `/dashboard/students/content/${book.id}`;
                          }}
                          className="group text-left overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl border border-[#dbe8e4] bg-white shadow-sm hover:shadow-lg hover:border-cyan-300 transition-all duration-200 hover:-translate-y-0.5"
                        >
                          <div className="flex h-20 sm:h-24 lg:h-32 items-center justify-center bg-gradient-to-br from-cyan-100 to-teal-50 relative">
                            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-cyan-500 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 lg:top-3 lg:left-3 rounded-full bg-cyan-600 px-1 sm:px-1.5 lg:px-2.5 py-0.5 text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-white">Book</span>
                          </div>
                          <div className="p-2 sm:p-3 lg:p-4">
                            <h4 className="text-xs sm:text-sm lg:text-base font-bold text-[#1f2937] group-hover:text-cyan-600 transition-colors line-clamp-1">{book.title}</h4>
                            {book.source && <p className="text-xs text-gray-400 mt-0.5">by {book.source}</p>}
                            <div className="flex items-center justify-between mt-1.5 sm:mt-2 lg:mt-3">
                              <p className="text-sm sm:text-base lg:text-lg font-bold text-emerald-700">{book.amount}</p>
                              <span className="text-xs text-cyan-500 font-semibold group-hover:underline">View Details →</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

           </article>

     
        </div>
      </div>
    </section>
  );
}
