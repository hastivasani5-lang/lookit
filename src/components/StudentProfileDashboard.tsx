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

type DashboardTab = "profile" | "edit" | "courses" | "followers" | "reviews";

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
  { key: "buy-courses", label: "Buy Courses" },
  { key: "calendar", label: "Calendar" },
  { key: "wishlist", label: "Wishlist" },
  { key: "following", label: "Following" },
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
                <h3 className="text-xl font-bold mb-2 text-[#1f2937]">Following</h3>
                <div className="rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-4 w-full max-w-md">
                  <p className="text-[#4b5563]">You are not following anyone yet.</p>
                </div>
              </div>
            )}

            {activeTab === "calendar" && (
              <div className="my-6">
                <h3 className="text-xl font-bold mb-2 text-[#1f2937]">Today's Work Calendar</h3>
                <div className="rounded-xl border border-[#dbe8e4] bg-[#f8fbfa] p-4 w-full max-w-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-[#374151]">{new Date().toLocaleDateString()}</span>
                    <span className="text-sm text-[#1b8c65]">Work Hours</span>
                  </div>
                  {/* Example: 3 hours worked today, change value as needed */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-4 bg-[#eceff5] rounded-full overflow-hidden">
                      <div className="h-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full" style={{ width: `${(3/12)*100}%` }} />
                    </div>
                    <span className="font-semibold text-[#1b8c65]">3 / 12 hrs</span>
                  </div>
                  <p className="mt-2 text-xs text-[#6b7280]">You worked 3 hours today.</p>
                </div>
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

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#e5e7eb] pt-4">
              <button
                type="button"
                onClick={() => void handleShare()}
                className="inline-flex items-center gap-1 rounded-md bg-linear-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 text-xs font-semibold"
              >
                <Share2 className="h-3.5 w-3.5" /> Share Course
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center gap-1 rounded-md bg-linear-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 text-xs font-semibold"
              >
                <TriangleAlert className="h-3.5 w-3.5" /> Report Abuse
              </button>
              <button
                type="button"
                onClick={() => {
                  setLikes((current) => current + 1);
                  setActionMessage("Thanks for the like.");
                }}
                className="inline-flex items-center gap-1 rounded-md bg-linear-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 text-xs font-semibold"
              >
                <Heart className="h-3.5 w-3.5" /> {likes}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1 rounded-md bg-linear-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 text-xs font-semibold"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-[#ecf8f4] px-3 py-1.5 text-xs font-semibold text-[#1b8c65]">
                <Users className="h-3.5 w-3.5" /> {followersSeed.length} Followers
              </span>
            </div>

            {actionMessage ? <p className="mt-3 text-xs font-medium text-[#1b8c65]">{actionMessage}</p> : null}
          </article>

          <section>
            <h3 className="mb-4 text-3xl font-bold text-[#1f2937]">Courses By {editName}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {courseCards.slice(0, 2).map((course) => (
                <article key={`featured-${course.id}`} className="overflow-hidden rounded-2xl border border-[#dbe8e4] bg-white shadow-sm">
                  <div className={`flex h-34 items-center justify-center ${course.kind === "book" ? "bg-[#dff3fa]" : "bg-[#f1e9e0]"}`}>
                    {course.kind === "book" ? <BookOpen className="h-14 w-14 text-[#0891b2]" /> : <Video className="h-14 w-14 text-[#b45309]" />}
                  </div>
                  <div className="p-4">
                    <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">{course.badge}</span>
                    <h4 className="mt-3 text-3xl font-bold text-[#1f2937]">{course.title}</h4>
                    <p className="mt-1 text-sm text-[#6b7280]">Top-selling learning material for students.</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <p className="font-semibold text-[#374151]">{course.rating.toFixed(1)}</p>
                      <p className="text-[#9ca3af]">({course.enrollments.toLocaleString()})</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-[#2c5a48]">{course.amount}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
