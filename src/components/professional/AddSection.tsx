"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Edit2, Eye, Heart, Play, Trash2, Calendar } from "lucide-react";
import type { AddContentTab, AddedBook, AddedVideo } from "@/components/professional/DashboardTypes";

type AddSectionProps = {
  addContentTab: AddContentTab;
  setAddContentTab: (tab: AddContentTab) => void;
  isBookFormOpen: boolean;
  setIsBookFormOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isVideoFormOpen: boolean;
  setIsVideoFormOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  addedBooks: AddedBook[];
  addedVideos: AddedVideo[];
  bookNameInput: string;
  setBookNameInput: (v: string) => void;
  bookMrpInput: string;
  setBookMrpInput: (v: string) => void;
  bookCategoryInput: string;
  setBookCategoryInput: (v: string) => void;
  bookImageFile: File | null;
  setBookImageFile: (f: File | null) => void;
  pendingBookFiles: File[];
  setPendingBookFiles: (files: File[]) => void;
  bookImageLinkInput: string;
  setBookImageLinkInput: (v: string) => void;
  bookLinkInput: string;
  setBookLinkInput: (v: string) => void;
  bookFormError: string;
  bookInstructorInput: string;
  setBookInstructorInput: (v: string) => void;
  bookModeInput: "online" | "offline";
  setBookModeInput: (v: "online" | "offline") => void;
  bookDescriptionInput: string;
  setBookDescriptionInput: (v: string) => void;
  bookTypeInput: "free" | "paid";
  setBookTypeInput: (v: "free" | "paid") => void;
  bookLevelInput: string;
  setBookLevelInput: (v: string) => void;
  bookCoursePackageInput: "30days" | "60days" | "6months" | "1year";
  setBookCoursePackageInput: (v: "30days" | "60days" | "6months" | "1year") => void;
  youtubeLinkInput: string;
  setYoutubeLinkInput: (v: string) => void;
  youtubeLinkError: string;
  videoMrpInput: string;
  setVideoMrpInput: (v: string) => void;
  pendingVideoFiles: File[];
  setPendingVideoFiles: (files: File[]) => void;
  videoInstructorInput: string;
  setVideoInstructorInput: (v: string) => void;
  videoModeInput: "online" | "offline";
  setVideoModeInput: (v: "online" | "offline") => void;
  videoDescriptionInput: string;
  setVideoDescriptionInput: (v: string) => void;
  videoTypeInput: "free" | "paid";
  setVideoTypeInput: (v: "free" | "paid") => void;
  videoLevelInput: string;
  setVideoLevelInput: (v: string) => void;
  videoCoursePackageInput: "30days" | "60days" | "6months" | "1year";
  setVideoCoursePackageInput: (v: "30days" | "60days" | "6months" | "1year") => void;
  likedBookIds: Set<string>;
  likedVideoIds: Set<string>;
  userName: string;
  editingBookId: string | null;
  editingVideoId: string | null;
  handleBookSave: () => void;
  handleVideoSave: () => void;
  handleEditBook: (book: AddedBook) => void;
  handleEditVideo: (video: AddedVideo) => void;
  handleDeleteBookWithConfirm: (id: string) => void;
  handleDeleteVideoWithConfirm: (id: string) => void;
  handleToggleLikeBook: (id: string) => void;
  handleToggleLikeVideo: (id: string) => void;
};

export default function AddSection({
  addContentTab, setAddContentTab,
  isBookFormOpen, setIsBookFormOpen,
  isVideoFormOpen, setIsVideoFormOpen,
  addedBooks, addedVideos,
  bookNameInput, setBookNameInput,
  bookMrpInput, setBookMrpInput,
  bookCategoryInput, setBookCategoryInput,
  bookImageFile, setBookImageFile,
  pendingBookFiles, setPendingBookFiles,
  bookImageLinkInput, setBookImageLinkInput,
  bookLinkInput, setBookLinkInput,
  bookFormError,
  bookInstructorInput, setBookInstructorInput,
  bookModeInput, setBookModeInput,
  bookDescriptionInput, setBookDescriptionInput,
  bookTypeInput, setBookTypeInput,
  bookLevelInput, setBookLevelInput,
  bookCoursePackageInput, setBookCoursePackageInput,
  youtubeLinkInput, setYoutubeLinkInput,
  youtubeLinkError,
  videoMrpInput, setVideoMrpInput,
  pendingVideoFiles, setPendingVideoFiles,
  videoInstructorInput, setVideoInstructorInput,
  videoModeInput, setVideoModeInput,
  videoDescriptionInput, setVideoDescriptionInput,
  videoTypeInput, setVideoTypeInput,
  videoLevelInput, setVideoLevelInput,
  videoCoursePackageInput, setVideoCoursePackageInput,
  likedBookIds, likedVideoIds,
  userName,
  editingBookId,
  editingVideoId,
  handleBookSave, handleVideoSave,
  handleEditBook, handleEditVideo,
  handleDeleteBookWithConfirm, handleDeleteVideoWithConfirm,
  handleToggleLikeBook, handleToggleLikeVideo,
}: AddSectionProps) {
  const user = { name: userName };

  // ── Upcoming Class state ──────────────────────────────────────────
  type UpcomingClass = {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    platform: string;
    link: string;
    description: string;
  };

  const [isClassFormOpen, setIsClassFormOpen] = useState(false);
  const [classes, setClasses] = useState<UpcomingClass[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [classTitle, setClassTitle] = useState("");
  const [classDate, setClassDate] = useState("");
  const [classTime, setClassTime] = useState("");
  const [classDuration, setClassDuration] = useState("");
  const [classPlatform, setClassPlatform] = useState("Zoom");
  const [classLink, setClassLink] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [classFormError, setClassFormError] = useState("");
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  // ── Banner form state ─────────────────────────────────────────────
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");

  // ── Extra video links state ────────────────────────────────────────
  const [extraVideoLinks, setExtraVideoLinks] = useState<string[]>([]);
  const [bannerLink, setBannerLink] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [bannerSuccess, setBannerSuccess] = useState("");
  const [bannerSubmitting, setBannerSubmitting] = useState(false);

  // Load classes from API on mount
  React.useEffect(() => {
    setClassesLoading(true);
    fetch("/api/upcoming-classes?mine=1")
      .then((r) => r.json())
      .then((data: { classes?: UpcomingClass[] }) => setClasses(data.classes ?? []))
      .catch(() => {})
      .finally(() => setClassesLoading(false));
  }, []);

  const resetClassForm = () => {
    setClassTitle(""); setClassDate(""); setClassTime("");
    setClassDuration(""); setClassPlatform("Zoom");
    setClassLink(""); setClassDescription("");
    setClassFormError(""); setEditingClassId(null);
  };

  const handleClassSave = async () => {
    if (!classTitle.trim() || !classDate || !classTime) {
      setClassFormError("Please fill in title, date and time.");
      return;
    }
    setClassFormError("");
    try {
      const payload = {
        id: editingClassId || undefined,
        title: classTitle, date: classDate, time: classTime,
        duration: classDuration, platform: classPlatform,
        link: classLink, description: classDescription,
      };
      const res = await fetch("/api/upcoming-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { class?: UpcomingClass };
      if (data.class) {
        setClasses((prev) =>
          editingClassId
            ? prev.map((c) => (c.id === editingClassId ? data.class! : c))
            : [data.class!, ...prev]
        );
      }
    } catch {
      setClassFormError("Failed to save. Please try again.");
      return;
    }
    resetClassForm();
    setIsClassFormOpen(false);
  };

  const handleEditClass = (cls: UpcomingClass) => {
    setClassTitle(cls.title); setClassDate(cls.date); setClassTime(cls.time);
    setClassDuration(cls.duration); setClassPlatform(cls.platform);
    setClassLink(cls.link); setClassDescription(cls.description);
    setEditingClassId(cls.id);
    setIsClassFormOpen(true);
  };

  const handleDeleteClass = async (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    await fetch("/api/upcoming-classes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const handleBannerSubmit = async () => {
    setBannerError("");
    setBannerSuccess("");
    if (!bannerLink.trim()) { setBannerError("Please enter a banner image URL."); return; }
    setBannerSubmitting(true);
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: bannerLink }),
      });
      if (res.status === 201) {
        setBannerSuccess("Banner submitted for review!");
        setBannerLink("");
      } else {
        const data = await res.json().catch(() => ({})) as { message?: string };
        setBannerError(data.message ?? "Submission failed. Please try again.");
      }
    } catch {
      setBannerError("Submission failed. Please try again.");
    } finally {
      setBannerSubmitting(false);
    }
  };

  return (
            <div className="mt-6 space-y-6">
              {/* Tab switcher */}
              <div className="rounded-[24px] bg-white p-3 shadow-sm">
                <div className="flex w-full max-w-lg items-center gap-2 rounded-2xl bg-[#f7faf8] p-1">
                  <button
                    type="button"
                    onClick={() => setAddContentTab("books")}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                      addContentTab === "books" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Books
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddContentTab("videos")}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                      addContentTab === "videos" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Videos
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddContentTab("classes")}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                      addContentTab === "classes" ? "bg-[#1ec28e] text-white" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Upcoming Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddContentTab("banner")}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                      addContentTab === "banner" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Add Banner
                  </button>
                </div>
              </div>

              {addContentTab === "books" && (
                <>
                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Add Books</h3>
                        <p className="text-sm text-slate-500">Click Add+ to open the book form.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsBookFormOpen((current) => !current)}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        {isBookFormOpen ? "Close" : "Add+"}
                      </button>
                    </div>
                  </div>

                  {isBookFormOpen ? (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
                      <div className="w-full max-w-xl rounded-[12px] bg-white shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                          <h3 className="text-base font-semibold text-slate-900">
                            {editingBookId ? "Edit Book" : "Add Book"}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsBookFormOpen(false)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            title="Close"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-6 space-y-5">
                          {/* Course Title */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-2">Course Title</label>
                            <input
                              type="text"
                              value={bookNameInput}
                              onChange={(event) => setBookNameInput(event.target.value)}
                              placeholder=""
                              className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            />
                          </div>

                          {/* Category and Instructor */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-slate-800 mb-2">Category</label>
                              <select
                                value={bookCategoryInput}
                                onChange={(event) => setBookCategoryInput(event.target.value)}
                                className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-600 outline-none transition focus:border-slate-400 appearance-none bg-white cursor-pointer"
                                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                              >
                                <option value="">Select</option>
                                <option value="Art & Design">Art &amp; Design</option>
                                <option value="Development">Development</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Personal Development">Personal Development</option>
                                <option value="Business">Business</option>
                                <option value="Finance">Finance</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Photography">Photography</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Health & Fitness">Health &amp; Fitness</option>
                                <option value="Music">Music</option>
                                <option value="Teaching & Academics">Teaching &amp; Academics</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-800 mb-2">Instructor</label>
                              <select
                                value={bookInstructorInput}
                                onChange={(event) => setBookInstructorInput(event.target.value)}
                                className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-600 outline-none transition focus:border-slate-400 appearance-none bg-white cursor-pointer"
                                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                              >
                                <option value="">Select</option>
                                <option value={user.name}>{user.name}</option>
                              </select>
                            </div>
                          </div>

                          {/* Type of mode */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-3">Type of mode</label>
                            <div className="flex gap-8">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bookMode"
                                  value="online"
                                  checked={bookModeInput === "online"}
                                  onChange={(event) => setBookModeInput(event.target.value as "online" | "offline")}
                                  className="w-5 h-5"
                                  style={{accentColor: '#5b61d9'}}
                                />
                                <span className="text-sm text-slate-700">Online</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bookMode"
                                  value="offline"
                                  checked={bookModeInput === "offline"}
                                  onChange={(event) => setBookModeInput(event.target.value as "online" | "offline")}
                                  className="w-5 h-5"
                                  style={{accentColor: '#5b61d9'}}
                                />
                                <span className="text-sm text-slate-700">Offline</span>
                              </label>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
                            <textarea
                              value={bookDescriptionInput}
                              onChange={(event) => setBookDescriptionInput(event.target.value)}
                              placeholder="Enter course description"
                              rows={3}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                            />
                          </div>

                          {/* Course Type */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-3">Course Type</label>
                            <div className="flex gap-8">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bookType"
                                  value="free"
                                  checked={bookTypeInput === "free"}
                                  onChange={(event) => setBookTypeInput(event.target.value as "free" | "paid")}
                                  className="w-5 h-5"
                                  style={{accentColor: '#5b61d9'}}
                                />
                                <span className="text-sm text-slate-700">Free</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bookType"
                                  value="paid"
                                  checked={bookTypeInput === "paid"}
                                  onChange={(event) => setBookTypeInput(event.target.value as "free" | "paid")}
                                  className="w-5 h-5"
                                  style={{accentColor: '#5b61d9'}}
                                />
                                <span className="text-sm text-slate-700">Paid</span>
                              </label>
                            </div>
                          </div>

                          {/* Book Image URL */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Book Image URL</label>
                            <input
                              type="url"
                              value={bookImageLinkInput}
                              onChange={(event) => setBookImageLinkInput(event.target.value)}
                              placeholder="https://example.com/book-cover.jpg"
                              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                            />
                            <p className="mt-1 text-xs text-slate-400">Paste a direct image URL for the book cover</p>
                          </div>

                          {/* Level and Price */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-slate-900 mb-2">Level</label>
                              <select
                                value={bookLevelInput}
                                onChange={(event) => setBookLevelInput(event.target.value)}
                                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                              >
                                <option value="">Select</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>
                            {bookTypeInput === "paid" && (
                            <div>
                              <label className="block text-sm font-medium text-slate-900 mb-2">Price</label>
                              <div className="relative h-10 rounded-lg border border-slate-200 focus-within:border-[#1ec28e]">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={bookMrpInput}
                                  onChange={(event) => setBookMrpInput(event.target.value)}
                                  placeholder="0.00"
                                  className="h-10 w-full rounded-lg border-0 bg-transparent pl-8 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400"
                                />
                              </div>
                            </div>
                            )}
                          </div>

                          {/* Course Post Package */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Course Post Package</label>
                            <div className="grid gap-3 md:grid-cols-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bookPackage"
                                  value="30days"
                                  checked={bookCoursePackageInput === "30days"}
                                  onChange={(event) => setBookCoursePackageInput(event.target.value as "30days" | "60days" | "6months" | "1year")}
                                  className="w-4 h-4 accent-[#1ec28e]"
                                />
                                <span className="text-sm text-slate-700">30 Days Free</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bookPackage"
                                  value="60days"
                                  checked={bookCoursePackageInput === "60days"}
                                  onChange={(event) => setBookCoursePackageInput(event.target.value as "30days" | "60days" | "6months" | "1year")}
                                  className="w-4 h-4 accent-[#1ec28e]"
                                />
                                <span className="text-sm text-slate-700">60 days / $20</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bookPackage"
                                  value="6months"
                                  checked={bookCoursePackageInput === "6months"}
                                  onChange={(event) => setBookCoursePackageInput(event.target.value as "30days" | "60days" | "6months" | "1year")}
                                  className="w-4 h-4 accent-[#1ec28e]"
                                />
                                <span className="text-sm text-slate-700">6 months / $50</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="bookPackage"
                                  value="1year"
                                  checked={bookCoursePackageInput === "1year"}
                                  onChange={(event) => setBookCoursePackageInput(event.target.value as "30days" | "60days" | "6months" | "1year")}
                                  className="w-4 h-4 accent-[#1ec28e]"
                                />
                                <span className="text-sm text-slate-700">1 year / $80</span>
                              </label>
                            </div>
                          </div>

                          {/* Course File URL */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Book/Course File URL</label>
                            <input
                              type="url"
                              value={bookLinkInput}
                              onChange={(event) => setBookLinkInput(event.target.value)}
                              placeholder="https://drive.google.com/... or Amazon link"
                              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                            />
                            <p className="mt-1 text-xs text-slate-400">Paste a Google Drive, Dropbox, or Amazon link to your book/course file</p>
                          </div>

                          {bookFormError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{bookFormError}</div>
                          )}
                        </div>
                        <div className="border-t border-slate-200 bg-white p-6 flex gap-3 justify-between">
                          <button
                            type="button"
                            onClick={handleBookSave}
                            className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white transition"
                            style={{backgroundColor: '#ef5350'}}
                          >
                            Save to Draft
                          </button>
                          <button
                            type="button"
                            onClick={handleBookSave}
                            className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white transition"
                            style={{backgroundColor: '#6366f1'}}
                          >
                            Publish Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-slate-900">Uploaded Books</h4>
                      <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">
                        {addedBooks.length}
                      </span>
                    </div>

                    {addedBooks.length === 0 ? (
                      <p className="rounded-2xl bg-[#f7faf8] px-4 py-3 text-sm text-slate-500">No books uploaded yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="px-4 py-3 font-semibold text-slate-900">COURSES</th>
                              <th className="px-4 py-3 font-semibold text-slate-900">CATEGORY</th>
                              <th className="px-4 py-3 font-semibold text-slate-900">FEES</th>
                              <th className="px-4 py-3 font-semibold text-slate-900">STATUS</th>
                              <th className="px-4 py-3 font-semibold text-slate-900">ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {addedBooks.map((book) => (
                              <tr key={book.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <img src={book.imageUrl} alt={book.name} className="h-12 w-12 rounded-lg object-cover" />
                                    <div className="min-w-0">
                                      <p className="truncate font-medium text-slate-900">{book.name}</p>
                                      <p className="text-xs text-slate-500">{book.sizeLabel}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-slate-600">{book.category}</td>
                                <td className="px-4 py-4 font-semibold text-slate-900">₹{book.mrp}</td>
                                <td className="px-4 py-4">
                                  <span className="inline-flex rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">
                                    Published
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      type="button"
                                      onClick={() => handleEditBook(book)}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                                      title="Edit book"
                                    >
                                      <Edit2 className="h-4 w-4 text-slate-600" />
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteBookWithConfirm(book.id)}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                                      title="Delete book"
                                    >
                                      <Trash2 className="h-4 w-4 text-slate-600" />
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleToggleLikeBook(book.id)}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                                      title={likedBookIds.has(book.id) ? "Unlike book" : "Like book"}
                                    >
                                      <Heart className={`h-4 w-4 ${likedBookIds.has(book.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                                    </button>
                                    <Link
                                      href={`/dashboard/teachers/books/${book.id}`}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                                      title="View book"
                                    >
                                      <Eye className="h-4 w-4 text-slate-600" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

              {addContentTab === "videos" && (
                <>
                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Add Videos</h3>
                        <p className="text-sm text-slate-500">Click Add+ to open the video form.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsVideoFormOpen((current) => !current)}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        {isVideoFormOpen ? "Close" : "Add+"}
                      </button>
                    </div>
                  </div>

                  {isVideoFormOpen ? (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
                      <div className="w-full max-w-xl rounded-[12px] bg-white shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                          <h3 className="text-base font-semibold text-slate-900">
                            {editingVideoId ? "Edit Video" : "Add Video"}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsVideoFormOpen(false)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            title="Close"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-6 space-y-5">
                          {/* Course Title */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-2">Course Title</label>
                            <input
                              type="text"
                              value={bookNameInput}
                              onChange={(event) => setBookNameInput(event.target.value)}
                              placeholder=""
                              className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            />
                          </div>

                          {/* Category and Instructor */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-slate-800 mb-2">Category</label>
                              <select
                                value={bookCategoryInput}
                                onChange={(event) => setBookCategoryInput(event.target.value)}
                                className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-600 outline-none transition focus:border-slate-400 appearance-none bg-white cursor-pointer"
                                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                              >
                                <option value="">Select</option>
                                <option value="Art & Design">Art &amp; Design</option>
                                <option value="Development">Development</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Personal Development">Personal Development</option>
                                <option value="Business">Business</option>
                                <option value="Finance">Finance</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Photography">Photography</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Health & Fitness">Health &amp; Fitness</option>
                                <option value="Music">Music</option>
                                <option value="Teaching & Academics">Teaching &amp; Academics</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-800 mb-2">Instructor</label>
                              <select
                                value={videoInstructorInput}
                                onChange={(event) => setVideoInstructorInput(event.target.value)}
                                className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-600 outline-none transition focus:border-slate-400 appearance-none bg-white cursor-pointer"
                                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                              >
                                <option value="">Select</option>
                                <option value={user.name}>{user.name}</option>
                              </select>
                            </div>
                          </div>

                          {/* Type of mode */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-3">Type of mode</label>
                            <div className="flex gap-8">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="videoMode"
                                  value="online"
                                  checked={videoModeInput === "online"}
                                  onChange={(event) => setVideoModeInput(event.target.value as "online" | "offline")}
                                  className="w-5 h-5"
                                  style={{accentColor: '#5b61d9'}}
                                />
                                <span className="text-sm text-slate-700">Online</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="videoMode"
                                  value="offline"
                                  checked={videoModeInput === "offline"}
                                  onChange={(event) => setVideoModeInput(event.target.value as "online" | "offline")}
                                  className="w-5 h-5"
                                  style={{accentColor: '#5b61d9'}}
                                />
                                <span className="text-sm text-slate-700">Offline</span>
                              </label>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
                            <textarea
                              value={videoDescriptionInput}
                              onChange={(event) => setVideoDescriptionInput(event.target.value)}
                              placeholder="Enter course description"
                              rows={3}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                            />
                          </div>

                          {/* Course Type */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-3">Course Type</label>
                            <div className="flex gap-8">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="videoType"
                                  value="free"
                                  checked={videoTypeInput === "free"}
                                  onChange={(event) => setVideoTypeInput(event.target.value as "free" | "paid")}
                                  className="w-5 h-5"
                                  style={{accentColor: '#5b61d9'}}
                                />
                                <span className="text-sm text-slate-700">Free</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="videoType"
                                  value="paid"
                                  checked={videoTypeInput === "paid"}
                                  onChange={(event) => setVideoTypeInput(event.target.value as "free" | "paid")}
                                  className="w-5 h-5"
                                  style={{accentColor: '#5b61d9'}}
                                />
                                <span className="text-sm text-slate-700">Paid</span>
                              </label>
                            </div>
                          </div>

                          {/* Video URL */}
                          {/* Level and Price */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-slate-900 mb-2">Level</label>
                              <select
                                value={videoLevelInput}
                                onChange={(event) => setVideoLevelInput(event.target.value)}
                                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                              >
                                <option value="">Select</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>
                            {videoTypeInput === "paid" && (
                            <div>
                              <label className="block text-sm font-medium text-slate-900 mb-2">Price</label>
                              <div className="relative h-10 rounded-lg border border-slate-200 focus-within:border-[#1ec28e]">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={videoMrpInput}
                                  onChange={(event) => setVideoMrpInput(event.target.value)}
                                  placeholder="0.00"
                                  className="h-10 w-full rounded-lg border-0 bg-transparent pl-8 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400"
                                />
                              </div>
                            </div>
                            )}
                          </div>

                          {/* Course Post Package */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Course Post Package</label>
                            <div className="grid gap-3 md:grid-cols-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="videoPackage"
                                  value="30days"
                                  checked={videoCoursePackageInput === "30days"}
                                  onChange={(event) => setVideoCoursePackageInput(event.target.value as "30days" | "60days" | "6months" | "1year")}
                                  className="w-4 h-4 accent-[#1ec28e]"
                                />
                                <span className="text-sm text-slate-700">30 Days Free</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="videoPackage"
                                  value="60days"
                                  checked={videoCoursePackageInput === "60days"}
                                  onChange={(event) => setVideoCoursePackageInput(event.target.value as "30days" | "60days" | "6months" | "1year")}
                                  className="w-4 h-4 accent-[#1ec28e]"
                                />
                                <span className="text-sm text-slate-700">60 days / $20</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="videoPackage"
                                  value="6months"
                                  checked={videoCoursePackageInput === "6months"}
                                  onChange={(event) => setVideoCoursePackageInput(event.target.value as "30days" | "60days" | "6months" | "1year")}
                                  className="w-4 h-4 accent-[#1ec28e]"
                                />
                                <span className="text-sm text-slate-700">6 months / $50</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="videoPackage"
                                  value="1year"
                                  checked={videoCoursePackageInput === "1year"}
                                  onChange={(event) => setVideoCoursePackageInput(event.target.value as "30days" | "60days" | "6months" | "1year")}
                                  className="w-4 h-4 accent-[#1ec28e]"
                                />
                                <span className="text-sm text-slate-700">1 year / $80</span>
                              </label>
                            </div>
                          </div>

                          {/* Add Video Links */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-slate-900">Add Video Links</label>
                              <button
                                type="button"
                                onClick={() => setExtraVideoLinks([...extraVideoLinks, ""])}
                                className="flex items-center gap-1 rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e] hover:bg-[#d6f5eb] transition"
                              >
                                <span className="text-base leading-none">+</span>
                                <span>Add Link</span>
                              </button>
                            </div>

                            {/* Main YouTube/video URL (existing field) */}
                            <input
                              type="url"
                              value={youtubeLinkInput}
                              onChange={(event) => setYoutubeLinkInput(event.target.value)}
                              placeholder="https://videos.com"
                              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                            />

                            {/* Extra links */}
                            {extraVideoLinks.map((link, idx) => (
                              <div key={idx} className="flex items-center gap-2 mt-2">
                                <input
                                  type="url"
                                  value={link}
                                  onChange={(e) => {
                                    const updated = [...extraVideoLinks];
                                    updated[idx] = e.target.value;
                                    setExtraVideoLinks(updated);
                                  }}
                                  placeholder={`https://videos.com/link-${idx + 2}`}
                                  className="flex-1 h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                                />
                                <button
                                  type="button"
                                  onClick={() => setExtraVideoLinks(extraVideoLinks.filter((_, i) => i !== idx))}
                                  className="text-red-400 hover:text-red-600 font-bold text-lg leading-none px-1"
                                  aria-label="Remove link"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>

                          {youtubeLinkError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{youtubeLinkError}</div>
                          )}
                        </div>
                        <div className="border-t border-slate-200 bg-white p-6 flex gap-3 justify-between">
                          <button
                            type="button"
                            onClick={handleVideoSave}
                            className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white transition"
                            style={{backgroundColor: '#ef5350'}}
                          >
                            Save to Draft
                          </button>
                          <button
                            type="button"
                            onClick={handleVideoSave}
                            className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white transition"
                            style={{backgroundColor: '#6366f1'}}
                          >
                            Publish Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-slate-900">Uploaded Videos</h4>
                      <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">
                        {addedVideos.length}
                      </span>
                    </div>

                    {addedVideos.length === 0 ? (
                      <p className="rounded-2xl bg-[#f7faf8] px-4 py-3 text-sm text-slate-500">No videos uploaded yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="px-4 py-3 font-semibold text-slate-900">COURSES</th>
                              <th className="px-4 py-3 font-semibold text-slate-900">CATEGORY</th>
                              <th className="px-4 py-3 font-semibold text-slate-900">FEES</th>
                              <th className="px-4 py-3 font-semibold text-slate-900">STATUS</th>
                              <th className="px-4 py-3 font-semibold text-slate-900">ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {addedVideos.map((video) => (
                              <tr key={video.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-black overflow-hidden flex-shrink-0">
                                      {video.source === "youtube" ? (
                                        <img src={`https://img.youtube.com/vi/${video.url.split('embed/')[1]?.split('"')[0] || 'dQw4w9WgXcQ'}/default.jpg`} alt={video.name} className="h-full w-full object-cover" />
                                      ) : (
                                        <div className="h-full w-full bg-slate-800 flex items-center justify-center">
                                          <Play className="h-6 w-6 text-white" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="truncate font-medium text-slate-900">{video.name}</p>
                                      <p className="text-xs text-slate-500">{video.sizeLabel}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-slate-600">{video.category || "Uncategorized"}</td>
                                <td className="px-4 py-4 font-semibold text-slate-900">₹{video.mrp || "0.00"}</td>
                                <td className="px-4 py-4">
                                  <span className="inline-flex rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">
                                    Published
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      type="button"
                                      onClick={() => handleEditVideo(video)}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                                      title="Edit video"
                                    >
                                      <Edit2 className="h-4 w-4 text-slate-600" />
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteVideoWithConfirm(video.id)}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                                      title="Delete video"
                                    >
                                      <Trash2 className="h-4 w-4 text-slate-600" />
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleToggleLikeVideo(video.id)}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                                      title={likedVideoIds.has(video.id) ? "Unlike video" : "Like video"}
                                    >
                                      <Heart className={`h-4 w-4 ${likedVideoIds.has(video.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                                    </button>
                                    <Link
                                      href={`/dashboard/teachers/videos/${video.id}`}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                                      title="View video"
                                    >
                                      <Eye className="h-4 w-4 text-slate-600" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── UPCOMING CLASS TAB ─────────────────────────────────── */}
              {addContentTab === "classes" && (
                <>
                  {/* Header + Add+ button */}
                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Upcoming Classes</h3>
                        <p className="text-sm text-slate-500">Click Add+ to schedule a new class.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { resetClassForm(); setIsClassFormOpen((p) => !p); }}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                      >
                        {isClassFormOpen ? "Close" : "Add+"}
                      </button>
                    </div>
                  </div>

                  {/* Class Form Modal */}
                  {isClassFormOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
                      <div className="w-full max-w-xl rounded-[12px] bg-white shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                          <h3 className="text-base font-semibold text-slate-900">
                            {editingClassId ? "Edit Class" : "Add Upcoming Class"}
                          </h3>
                          <button
                            type="button"
                            onClick={() => { setIsClassFormOpen(false); resetClassForm(); }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6 space-y-5">
                          {/* Class Title */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-2">Class Title</label>
                            <input
                              type="text"
                              value={classTitle}
                              onChange={(e) => setClassTitle(e.target.value)}
                              placeholder="e.g. React Basics Live Session"
                              className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e]"
                            />
                          </div>

                          {/* Date and Time */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-slate-800 mb-2">Date</label>
                              <input
                                type="date"
                                value={classDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setClassDate(e.target.value)}
                                className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-800 mb-2">Time</label>
                              <input
                                type="time"
                                value={classTime}
                                onChange={(e) => setClassTime(e.target.value)}
                                className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e]"
                              />
                            </div>
                          </div>

                          {/* Duration and Platform */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-slate-800 mb-2">Duration</label>
                              <input
                                type="text"
                                value={classDuration}
                                onChange={(e) => setClassDuration(e.target.value)}
                                placeholder="e.g. 1 hour"
                                className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-800 mb-2">Platform</label>
                              <select
                                value={classPlatform}
                                onChange={(e) => setClassPlatform(e.target.value)}
                                className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e]"
                              >
                                <option value="Zoom">Zoom</option>
                                <option value="Google Meet">Google Meet</option>
                                <option value="Microsoft Teams">Microsoft Teams</option>
                                <option value="YouTube Live">YouTube Live</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          {/* Meeting Link */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-2">Meeting Link</label>
                            <input
                              type="url"
                              value={classLink}
                              onChange={(e) => setClassLink(e.target.value)}
                              placeholder="https://zoom.us/j/..."
                              className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e]"
                            />
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-slate-800 mb-2">Description</label>
                            <textarea
                              value={classDescription}
                              onChange={(e) => setClassDescription(e.target.value)}
                              placeholder="What will be covered in this class?"
                              rows={3}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                            />
                          </div>

                          {classFormError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{classFormError}</div>
                          )}
                        </div>

                        <div className="border-t border-slate-200 bg-white p-6 flex gap-3 justify-between">
                          <button
                            type="button"
                            onClick={() => { setIsClassFormOpen(false); resetClassForm(); }}
                            className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-slate-600 border border-slate-300 transition hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleClassSave}
                            className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white transition"
                            style={{ backgroundColor: "#1ec28e" }}
                          >
                            {editingClassId ? "Update Class" : "Schedule Class"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Classes List */}
                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-slate-900">Scheduled Classes</h4>
                      <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">
                        {classes.length}
                      </span>
                    </div>

                    {classesLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <div className="w-8 h-8 border-4 border-[#1ec28e] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : classes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f7faf8] px-4 py-10 text-center">
                        <Calendar className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-sm text-slate-500">No classes scheduled yet.</p>
                        <p className="text-xs text-slate-400 mt-1">Click Add+ to schedule your first class.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {classes.map((cls) => (
                          <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-[#f7faf8] p-4 hover:shadow-sm transition">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#effaf6]">
                                <Calendar className="h-6 w-6 text-[#1ec28e]" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{cls.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  📅 {cls.date} &nbsp;⏰ {cls.time}
                                  {cls.duration && <> &nbsp;⏱ {cls.duration}</>}
                                  &nbsp;📡 {cls.platform}
                                </p>
                                {cls.description && (
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cls.description}</p>
                                )}
                                {cls.link && (
                                  <a href={cls.link} target="_blank" rel="noreferrer" className="text-xs text-[#1ec28e] hover:underline mt-0.5 inline-block">
                                    Join Link ↗
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleEditClass(cls)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-200 transition"
                                title="Edit class"
                              >
                                <Edit2 className="h-4 w-4 text-slate-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClass(cls.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-200 transition"
                                title="Delete class"
                              >
                                <Trash2 className="h-4 w-4 text-slate-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── BANNER TAB ─────────────────────────────────────────── */}
              {addContentTab === "banner" && (
                <div className="rounded-[24px] bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Add Banner</h3>
                  <p className="text-sm text-slate-500 mb-6">Banner image URL paste karo. Admin approve kare pachi slider ma show thase.</p>

                  <div className="space-y-5">
                    {/* Banner Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-2">Banner Image URL <span className="text-red-500">*</span></label>
                      <input
                        type="url"
                        value={bannerLink}
                        onChange={(e) => setBannerLink(e.target.value)}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                      />
                      {bannerLink && (
                        <img src={bannerLink} alt="Preview" className="mt-3 h-32 w-full rounded-lg object-cover border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                    </div>

                    {bannerError && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{bannerError}</div>
                    )}
                    {bannerSuccess && (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{bannerSuccess}</div>
                    )}

                    <button
                      type="button"
                      onClick={handleBannerSubmit}
                      disabled={bannerSubmitting}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      {bannerSubmitting ? "Submitting…" : "Buy Now"}
                    </button>
                  </div>
                </div>
              )}
            </div>
  );
}
