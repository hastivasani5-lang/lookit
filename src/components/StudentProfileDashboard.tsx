
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
    purchasedBooks: Array<{ id: string; title: string; amount: string }>;
    watchedVideos: Array<{ id: string; title: string; amount: string }>;
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


function CalendarWidget() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [workedHours, setWorkedHours] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeline, setTimeline] = useState<Array<{ start: string; end: string; hours: number }>>([]);
  const intervalRef = useState<ReturnType<typeof setInterval> | null>(null);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

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
      setStartTime(new Date());
      setIsTracking(true);
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
      setIsTracking(false);
    }
  };

  const maxHours = 12;
  const progressPct = Math.min((workedHours / maxHours) * 100, 100);

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Calendar */}
      <div className="rounded-2xl border border-[#dbe8e4] bg-white p-5 shadow-sm w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-[#f0faf7] hover:bg-[#1ec28e] hover:text-white text-[#1ec28e] font-bold transition flex items-center justify-center">‹</button>
          <span className="font-bold text-[#1f2937]">{monthNames[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-[#f0faf7] hover:bg-[#1ec28e] hover:text-white text-[#1ec28e] font-bold transition flex items-center justify-center">›</button>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-[#9ca3af] py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const dateStr = `${viewYear}-${viewMonth}-${day}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`mx-auto w-8 h-8 rounded-full text-sm font-medium transition flex items-center justify-center
                  ${isSelected ? "bg-[#1ec28e] text-white" :
                    isToday ? "bg-[#e8f7f1] text-[#1ec28e] font-bold ring-2 ring-[#1ec28e]" :
                    "hover:bg-[#f0faf7] text-[#374151]"}`}
              >
                {day}
              </button>
            );
          })}
        </div>
        {selectedDate && (
          <div className="mt-4 rounded-xl bg-[#f0faf7] px-4 py-3 text-sm text-[#1b8c65] font-medium">
            Selected: {monthNames[viewMonth]} {selectedDate.split("-")[2]}, {viewYear}
          </div>
        )}
        <div className="mt-3 text-xs text-center text-[#9ca3af]">
          Today: {monthNames[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
        </div>
      </div>

      {/* Work Timeline */}
      <div className="rounded-2xl border border-[#dbe8e4] bg-white p-5 shadow-sm flex-1">
        <h4 className="font-bold text-[#1f2937] mb-1">Today's Work Hours</h4>
        <p className="text-xs text-[#9ca3af] mb-4">{today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>

        {/* Progress bar */}
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-[#1b8c65]">{workedHours} hrs worked</span>
          <span className="text-[#9ca3af]">Goal: {maxHours} hrs</span>
        </div>
        <div className="h-3 w-full rounded-full bg-[#eceff5] overflow-hidden mb-4">
          <div
            className="h-3 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Start/Stop button */}
        <button
          onClick={handleStartStop}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition mb-5 ${
            isTracking
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90"
          }`}
        >
          {isTracking ? `⏹ Stop (started ${startTime?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})` : "▶ Start Work Session"}
        </button>

        {/* Timeline entries */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {timeline.length === 0 ? (
            <p className="text-xs text-[#9ca3af] text-center py-4">No sessions logged yet. Press Start to begin.</p>
          ) : (
            [...timeline].reverse().map((entry, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-[#f8fbfa] border border-[#dbe8e4] px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-[#1ec28e] shrink-0" />
                <div className="flex-1 text-xs text-[#374151]">
                  <span className="font-semibold">{entry.start}</span> → <span className="font-semibold">{entry.end}</span>
                </div>
                <span className="text-xs font-bold text-[#1ec28e]">{entry.hours}h</span>
              </div>
            ))
          )}
        </div>

        {timeline.length > 0 && (
          <button
            onClick={() => { setTimeline([]); setWorkedHours(0); }}
            className="mt-3 text-xs text-red-400 hover:text-red-600 transition"
          >
            Reset today's log
          </button>
        )}
      </div>
    </div>
  );
}

export default function StudentProfileDashboard({ user, library }: StudentProfileDashboardProps) {
  const profileStorageKey = `student-profile-preview-${user.id}`;
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [likes, setLikes] = useState(678);
  const [actionMessage, setActionMessage] = useState("");
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.contactNumber ?? "+125 254 3562");
  const [editLocation, setEditLocation] = useState(user.location ?? "USA");
  const [editWebsite, setEditWebsite] = useState(getWebsiteFromEmail(user.email));
  const [profileAnswers, setProfileAnswers] = useState<any>(null);
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
    
      const userId = typeof window !== "undefined" ? window.localStorage.getItem("current_student_id") || "guest" : "guest";
      const answersRaw = window.localStorage.getItem(`student_profile_answers_${userId}`);
      if (answersRaw) {
        setProfileAnswers(JSON.parse(answersRaw));
      }
    } catch {
      // Ignore invalid saved data.
    }
  }, [profileStorageKey]);

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
    <section className="h-full w-full p-3 md:p-4">
      <div className="grid h-full gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-[#dbe8e4] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#e8eeec] px-6 py-6 text-center">
            <div className="mx-auto mb-4 grid h-26 w-26 place-items-center overflow-hidden rounded-full border-4 border-[#e9f8f2] bg-[#eef6f3] text-3xl font-bold text-[#2c5a48]">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="Student avatar" className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-2xl font-bold text-[#1f2937]">{user.name}</h2>
            <p className="mt-1 text-sm text-[#6b7280]">UI/UX Student</p>
            <div className="mt-3 flex items-center justify-center gap-1 text-[#f59e0b]">
              <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-[#d1d5db]">★</span>
              <span className="ml-2 text-xs font-semibold text-[#6b7280]">4.0</span>
            </div>
          </div>

          <div className="space-y-3 px-5 py-5 text-sm text-[#4b5563]">
            <h3 className="text-base font-semibold text-[#1f2937]">Contact Info</h3>
            {profileAnswers ? (
              <>
                {profileAnswers.country && (
                  <p className="flex items-center gap-2"><span className="font-semibold">Country:</span> {profileAnswers.country}</p>
                )}
                {profileAnswers.language && (
                  <p className="flex items-center gap-2"><span className="font-semibold">Preferred Language:</span> {profileAnswers.language}</p>
                )}
                {profileAnswers.profession && (
                  <p className="flex items-center gap-2"><span className="font-semibold">Profession:</span> {profileAnswers.profession}</p>
                )}
                {profileAnswers.source && (
                  <p className="flex items-center gap-2"><span className="font-semibold">Heard About Us:</span> {profileAnswers.source}</p>
                )}
              </>
            ) : (
              <p className="text-gray-400">No details provided yet.</p>
            )}
          </div>

          <div className="px-5 pb-5">
            <button
              type="button"
              onClick={async () => {
                await signOut({ callbackUrl: "/" });
              }}
              className="w-full rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 text-white px-3 py-2.5 text-xs font-semibold"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="h-full overflow-y-auto space-y-6 pr-1">
          <article className="rounded-2xl border border-[#dbe8e4] bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)] md:p-6">
            {/* Minimal tab system for Profile and Calendar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`rounded-md px-3.5 py-2 text-sm font-medium ${activeTab === "profile" ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("calendar")}
                className={`rounded-md px-3.5 py-2 text-sm font-medium ${activeTab === "calendar" ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Calendar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("wishlist")}
                className={`rounded-md px-3.5 py-2 text-sm font-medium ${activeTab === "wishlist" ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Wishlist
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("following")}
                className={`rounded-md px-3.5 py-2 text-sm font-medium ${activeTab === "following" ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Following
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("buy-courses")}
                className={`rounded-md px-3.5 py-2 text-sm font-medium ${activeTab === "buy-courses" ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white" : "bg-[#eceff5] text-[#374151]"}`}
              >
                Buy Karelu
              </button>
            </div>
            {activeTab === "wishlist" && (
              <div className="my-6">
                <h3 className="text-xl font-bold mb-2 text-[#1f2937]">Wishlist</h3>
                <div className="rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-4 w-full max-w-md">
                  <p className="text-[#4b5563]">Your wishlist is empty.</p>
                </div>
              </div>
            )}

            {activeTab === "following" && (
              <div className="my-6">
                <h3 className="text-xl font-bold mb-4 text-[#1f2937]">Following</h3>
                {followingLoading ? (
                  <p className="text-sm text-gray-400">Loading...</p>
                ) : followingList.length === 0 ? (
                  <div className="rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-4">
                    <p className="text-[#4b5563]">You are not following anyone yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {followingList.map((item) => (
                      <Link
                        key={item.professionalId}
                        href={`/professionals/${item.professionalId}`}
                        className="flex items-center gap-3 rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] px-4 py-3 hover:border-[#1ec28e] hover:bg-[#effaf6] transition-all"
                      >
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-[#e8f7f1] flex items-center justify-center text-sm font-bold text-[#1b8c65] shrink-0">
                          {item.professionalImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.professionalImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            (item.professionalName ?? "P").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1f2937] truncate">{item.professionalName ?? "Professional"}</p>
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
              <div className="my-6">
                <h3 className="text-xl font-bold mb-4 text-[#1f2937]">Calendar</h3>
                <CalendarWidget />
              </div>
            )}

            {activeTab === "profile" ? (
              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="text-2xl font-bold text-[#1f2937]">Personal Details</h3>
                  <div className="mt-3 grid gap-2 text-sm text-[#4b5563] md:grid-cols-2">
                    <p><span className="font-semibold text-[#111827]">Full Name :</span> {editName}</p>
                    <p><span className="font-semibold text-[#111827]">Location :</span> {editLocation}</p>
                    <p><span className="font-semibold text-[#111827]">Languages :</span> English, German</p>
                    <p><span className="font-semibold text-[#111827]">Website :</span> {editWebsite.replace("https://", "")}</p>
                    <p><span className="font-semibold text-[#111827]">Email :</span> {editEmail}</p>
                    <p><span className="font-semibold text-[#111827]">Phone :</span> {editPhone}</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-[#1f2937]">My Skills</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {skillRows.map((skill) => (
                      <div key={skill.label}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <p className="text-[#4b5563]">{skill.label}</p>
                          <p className="font-semibold text-[#374151]">{skill.value}%</p>
                        </div>
                        <div className="h-2 rounded-full bg-[#eceff5]">
                          <div className="h-2 rounded-full bg-[linear-gradient(90deg,#1ec28e_0%,#18ab7d_100%)]" style={{ width: `${skill.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-[#1f2937]">Biography</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                    At Lookit, I focus on practical learning and real project outcomes. My dashboard keeps track of purchased courses,
                    profile progress, and useful actions in one place so learning stays consistent and simple.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                    Joined on {formatDate(user.createdAt)}. I can quickly switch between profile details, purchased courses,
                    followers, and reviews without leaving this page.
                  </p>
                </section>
              </div>
            ) : null}

            {activeTab === "edit" ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-[#374151]">
                  Full Name
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#dbe8e4] px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="text-sm font-medium text-[#374151]">
                  Email
                  <input
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#dbe8e4] px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="text-sm font-medium text-[#374151]">
                  Phone
                  <input
                    value={editPhone}
                    onChange={(event) => setEditPhone(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#dbe8e4] px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="text-sm font-medium text-[#374151]">
                  Location
                  <input
                    value={editLocation}
                    onChange={(event) => setEditLocation(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#dbe8e4] px-3 outline-none focus:border-primary"
                  />
                </label>
                <label className="text-sm font-medium text-[#374151] md:col-span-2">
                  Website
                  <input
                    value={editWebsite}
                    onChange={(event) => setEditWebsite(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#dbe8e4] px-3 outline-none focus:border-primary"
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleEditSave}
                    className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 text-sm font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut({ callbackUrl: "/" });
                    }}
                    className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 text-sm font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : null}

            {activeTab === "courses" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {courseCards.slice(0, 4).map((course) => (
                  <article key={course.id} className="overflow-hidden rounded-2xl border border-[#dbe8e4] bg-white shadow-sm">
                    <div className={`flex h-34 items-center justify-center ${course.kind === "book" ? "bg-[#dff3fa]" : "bg-[#f1e9e0]"}`}>
                      {course.kind === "book" ? <BookOpen className="h-12 w-12 text-[#0891b2]" /> : <Video className="h-12 w-12 text-[#b45309]" />}
                    </div>
                    <div className="p-4">
                      <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">{course.badge}</span>
                      <h4 className="mt-3 text-xl font-bold text-[#1f2937]">{course.title}</h4>
                      <p className="mt-1 text-sm text-[#6b7280]">Structured student content with practical lessons.</p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <p className="font-semibold text-[#374151]">{course.rating.toFixed(1)}</p>
                        <p className="text-[#9ca3af]">({course.enrollments.toLocaleString()})</p>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-[#2c5a48]">{course.amount}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === "followers" ? (
              <div className="mt-6 space-y-3">
                {followersSeed.map((follower) => (
                  <div key={follower.id} className="flex items-center justify-between rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e8f7f1] text-sm font-bold text-[#1b8c65]">
                        {follower.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-semibold text-[#1f2937]">{follower.name}</p>
                        <p className="text-xs text-[#6b7280]">{follower.role}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${follower.status === "Active" ? "bg-[#e8f7f1] text-[#1b8c65]" : "bg-[#fff7ed] text-[#c2410c]"}`}>
                      {follower.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {activeTab === "reviews" ? (
              <div className="mt-6 rounded-2xl border border-[#dbe8e4] bg-[#f8fbfa] p-5">
                <h4 className="text-xl font-bold text-[#1f2937]">Student Reviews Center</h4>
                <p className="mt-2 text-sm text-[#4b5563]">Write and manage reviews for professionals directly from your student dashboard.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/dashboard/students/reviews" className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 text-sm font-semibold">
                    Open Reviews Page
                  </Link>
                  <Link href="/dashboard/students/library" className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 text-sm font-semibold">
                    Open Library
                  </Link>
                </div>
              </div>
            ) : null}

            {activeTab === "buy-courses" && (
              <div className="mt-6 space-y-8">
                {/* Purchased Videos */}
                <section>
                  <h3 className="text-xl font-bold text-[#1f2937] mb-4 flex items-center gap-2">
                    <Video className="h-5 w-5 text-[#b45309]" /> Purchased Videos
                  </h3>
                  {library.watchedVideos.length === 0 ? (
                    <div className="rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-4">
                      <p className="text-[#4b5563] text-sm">No purchased videos yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {library.watchedVideos.map((video) => (
                        <div key={video.id} className="overflow-hidden rounded-2xl border border-[#dbe8e4] bg-white shadow-sm">
                          <div className="flex h-28 items-center justify-center bg-[#f1e9e0]">
                            <Video className="h-10 w-10 text-[#b45309]" />
                          </div>
                          <div className="p-4">
                            <span className="rounded bg-[#b45309] px-2 py-0.5 text-[11px] font-semibold text-white">Video</span>
                            <h4 className="mt-2 text-base font-bold text-[#1f2937]">{video.title}</h4>
                            <p className="mt-2 text-lg font-bold text-[#2c5a48]">{video.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Purchased Books */}
                <section>
                  <h3 className="text-xl font-bold text-[#1f2937] mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#0891b2]" /> Purchased Books
                  </h3>
                  {library.purchasedBooks.length === 0 ? (
                    <div className="rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-4">
                      <p className="text-[#4b5563] text-sm">No purchased books yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {library.purchasedBooks.map((book) => (
                        <div key={book.id} className="overflow-hidden rounded-2xl border border-[#dbe8e4] bg-white shadow-sm">
                          <div className="flex h-28 items-center justify-center bg-[#dff3fa]">
                            <BookOpen className="h-10 w-10 text-[#0891b2]" />
                          </div>
                          <div className="p-4">
                            <span className="rounded bg-[#0891b2] px-2 py-0.5 text-[11px] font-semibold text-white">Book</span>
                            <h4 className="mt-2 text-base font-bold text-[#1f2937]">{book.title}</h4>
                            <p className="mt-2 text-lg font-bold text-[#2c5a48]">{book.amount}</p>
                          </div>
                        </div>
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
