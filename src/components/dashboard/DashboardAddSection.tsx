"use client";

import Link from "next/link";
import { Edit2, Eye, Heart, Play, Trash2 } from "lucide-react";
import { AddedBook, AddedVideo } from "./types";

type AddContentTab = "books" | "videos";

type Props = {
  userName: string;
  addContentTab: AddContentTab;
  setAddContentTab: (tab: AddContentTab) => void;
  isBookFormOpen: boolean;
  setIsBookFormOpen: (open: boolean) => void;
  isVideoFormOpen: boolean;
  setIsVideoFormOpen: (open: boolean) => void;
  // book form state
  bookNameInput: string; setBookNameInput: (v: string) => void;
  bookMrpInput: string; setBookMrpInput: (v: string) => void;
  bookCategoryInput: string; setBookCategoryInput: (v: string) => void;
  bookInstructorInput: string; setBookInstructorInput: (v: string) => void;
  bookModeInput: "online" | "offline"; setBookModeInput: (v: "online" | "offline") => void;
  bookDescriptionInput: string; setBookDescriptionInput: (v: string) => void;
  bookTypeInput: "free" | "paid"; setBookTypeInput: (v: "free" | "paid") => void;
  bookLevelInput: string; setBookLevelInput: (v: string) => void;
  bookCoursePackageInput: "30days" | "60days" | "6months" | "1year"; setBookCoursePackageInput: (v: "30days" | "60days" | "6months" | "1year") => void;
  bookImageFile: File | null; setBookImageFile: (f: File | null) => void;
  bookLinkInput: string; setBookLinkInput: (v: string) => void;
  pendingBookFiles: File[]; setPendingBookFiles: (f: File[]) => void;
  bookFormError: string;
  handleBookSave: () => void;
  // video form state
  youtubeLinkInput: string; setYoutubeLinkInput: (v: string) => void;
  videoMrpInput: string; setVideoMrpInput: (v: string) => void;
  videoInstructorInput: string; setVideoInstructorInput: (v: string) => void;
  videoModeInput: "online" | "offline"; setVideoModeInput: (v: "online" | "offline") => void;
  videoDescriptionInput: string; setVideoDescriptionInput: (v: string) => void;
  videoTypeInput: "free" | "paid"; setVideoTypeInput: (v: "free" | "paid") => void;
  videoLevelInput: string; setVideoLevelInput: (v: string) => void;
  videoCoursePackageInput: "30days" | "60days" | "6months" | "1year"; setVideoCoursePackageInput: (v: "30days" | "60days" | "6months" | "1year") => void;
  pendingVideoFiles: File[]; setPendingVideoFiles: (f: File[]) => void;
  youtubeLinkError: string;
  handleVideoSave: () => void;
  // lists
  addedBooks: AddedBook[];
  addedVideos: AddedVideo[];
  likedBookIds: Set<string>;
  likedVideoIds: Set<string>;
  handleToggleLikeBook: (id: string) => void;
  handleToggleLikeVideo: (id: string) => void;
  handleEditBook: (book: AddedBook) => void;
  handleEditVideo: (video: AddedVideo) => void;
  handleDeleteBookWithConfirm: (id: string) => void;
  handleDeleteVideoWithConfirm: (id: string) => void;
};

const selectStyle = { backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" };

function BookForm({ p }: { p: Props }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[12px] bg-white shadow-2xl flex flex-col max-h-[90vh]">
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Course Title</label>
            <input type="text" value={p.bookNameInput} onChange={(e) => p.setBookNameInput(e.target.value)} className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-slate-400" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Category</label>
              <select value={p.bookCategoryInput} onChange={(e) => p.setBookCategoryInput(e.target.value)} className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-600 outline-none appearance-none bg-white cursor-pointer" style={selectStyle}>
                <option value="">Select</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Instructor</label>
              <select value={p.bookInstructorInput} onChange={(e) => p.setBookInstructorInput(e.target.value)} className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-600 outline-none appearance-none bg-white cursor-pointer" style={selectStyle}>
                <option value="">Select</option>
                <option value={p.userName}>{p.userName}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-3">Type of mode</label>
            <div className="flex gap-8">
              {(["online", "offline"] as const).map((m) => (
                <label key={m} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="bookMode" value={m} checked={p.bookModeInput === m} onChange={(e) => p.setBookModeInput(e.target.value as "online" | "offline")} className="w-5 h-5" style={{ accentColor: "#5b61d9" }} />
                  <span className="text-sm text-slate-700 capitalize">{m}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
            <textarea value={p.bookDescriptionInput} onChange={(e) => p.setBookDescriptionInput(e.target.value)} placeholder="Enter course description" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-3">Course Type</label>
            <div className="flex gap-8">
              {(["free", "paid"] as const).map((t) => (
                <label key={t} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="bookType" value={t} checked={p.bookTypeInput === t} onChange={(e) => p.setBookTypeInput(e.target.value as "free" | "paid")} className="w-5 h-5" style={{ accentColor: "#5b61d9" }} />
                  <span className="text-sm text-slate-700 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Course Images</label>
            <label className="flex min-h-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-[#f7faf8] hover:border-[#1ec28e]">
              {p.bookImageFile ? (
                <img src={URL.createObjectURL(p.bookImageFile)} alt="preview" className="h-24 w-24 object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="text-sm text-slate-600">Drag or click to upload</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => p.setBookImageFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Video URL</label>
            <input type="url" value={p.bookLinkInput} onChange={(e) => p.setBookLinkInput(e.target.value)} placeholder="https://videos.com" className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Level</label>
              <select value={p.bookLevelInput} onChange={(e) => p.setBookLevelInput(e.target.value)} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-[#1ec28e]">
                <option value="">Select</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Price</label>
              <div className="relative h-10 rounded-lg border border-slate-200 focus-within:border-[#1ec28e]">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">$</span>
                <input type="number" min="0" step="0.01" value={p.bookMrpInput} onChange={(e) => p.setBookMrpInput(e.target.value)} placeholder="0.00" className="h-10 w-full rounded-lg border-0 bg-transparent pl-8 pr-3 text-sm text-slate-900 outline-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Course Post Package</label>
            <div className="grid gap-3 md:grid-cols-2">
              {([["30days", "30 Days Free"], ["60days", "60 days / $20"], ["6months", "6 months / $50"], ["1year", "1 year / $80"]] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="bookPackage" value={val} checked={p.bookCoursePackageInput === val} onChange={(e) => p.setBookCoursePackageInput(e.target.value as "30days" | "60days" | "6months" | "1year")} className="w-4 h-4 accent-[#1ec28e]" />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Course Files</label>
            <label className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 bg-[#f7faf8] px-4 text-sm text-slate-600 hover:border-[#1ec28e]">
              <span>{p.pendingBookFiles.length > 0 ? `${p.pendingBookFiles.length} file(s) selected` : "Choose course files to upload"}</span>
              <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e]">Browse</span>
              <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" className="hidden" onChange={(e) => p.setPendingBookFiles(Array.from(e.target.files ?? []))} />
            </label>
          </div>
          {p.bookFormError && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{p.bookFormError}</div>}
        </div>
        <div className="border-t border-slate-200 bg-white p-6 flex gap-3 justify-between">
          <button type="button" onClick={() => p.setIsBookFormOpen(false)} className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white" style={{ backgroundColor: "#ef5350" }}>Save to Draft</button>
          <button type="button" onClick={p.handleBookSave} className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white" style={{ backgroundColor: "#6366f1" }}>Publish Now</button>
        </div>
      </div>
    </div>
  );
}

function VideoForm({ p }: { p: Props }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[12px] bg-white shadow-2xl flex flex-col max-h-[90vh]">
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Course Title</label>
            <input type="text" value={p.bookNameInput} onChange={(e) => p.setBookNameInput(e.target.value)} className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-slate-400" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Category</label>
              <select value={p.bookCategoryInput} onChange={(e) => p.setBookCategoryInput(e.target.value)} className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-600 outline-none appearance-none bg-white cursor-pointer" style={selectStyle}>
                <option value="">Select</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Instructor</label>
              <select value={p.videoInstructorInput} onChange={(e) => p.setVideoInstructorInput(e.target.value)} className="w-full h-10 rounded border border-slate-300 px-3 text-sm text-slate-600 outline-none appearance-none bg-white cursor-pointer" style={selectStyle}>
                <option value="">Select</option>
                <option value={p.userName}>{p.userName}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-3">Type of mode</label>
            <div className="flex gap-8">
              {(["online", "offline"] as const).map((m) => (
                <label key={m} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="videoMode" value={m} checked={p.videoModeInput === m} onChange={(e) => p.setVideoModeInput(e.target.value as "online" | "offline")} className="w-5 h-5" style={{ accentColor: "#5b61d9" }} />
                  <span className="text-sm text-slate-700 capitalize">{m}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
            <textarea value={p.videoDescriptionInput} onChange={(e) => p.setVideoDescriptionInput(e.target.value)} placeholder="Enter course description" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-3">Course Type</label>
            <div className="flex gap-8">
              {(["free", "paid"] as const).map((t) => (
                <label key={t} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="videoType" value={t} checked={p.videoTypeInput === t} onChange={(e) => p.setVideoTypeInput(e.target.value as "free" | "paid")} className="w-5 h-5" style={{ accentColor: "#5b61d9" }} />
                  <span className="text-sm text-slate-700 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Video URL</label>
            <input type="url" value={p.youtubeLinkInput} onChange={(e) => p.setYoutubeLinkInput(e.target.value)} placeholder="https://videos.com" className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Level</label>
              <select value={p.videoLevelInput} onChange={(e) => p.setVideoLevelInput(e.target.value)} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-[#1ec28e]">
                <option value="">Select</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Price</label>
              <div className="relative h-10 rounded-lg border border-slate-200 focus-within:border-[#1ec28e]">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">$</span>
                <input type="number" min="0" step="0.01" value={p.videoMrpInput} onChange={(e) => p.setVideoMrpInput(e.target.value)} placeholder="0.00" className="h-10 w-full rounded-lg border-0 bg-transparent pl-8 pr-3 text-sm text-slate-900 outline-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Course Post Package</label>
            <div className="grid gap-3 md:grid-cols-2">
              {([["30days", "30 Days Free"], ["60days", "60 days / $20"], ["6months", "6 months / $50"], ["1year", "1 year / $80"]] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="videoPackage" value={val} checked={p.videoCoursePackageInput === val} onChange={(e) => p.setVideoCoursePackageInput(e.target.value as "30days" | "60days" | "6months" | "1year")} className="w-4 h-4 accent-[#1ec28e]" />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Video Files</label>
            <label className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 bg-[#f7faf8] px-4 text-sm text-slate-600 hover:border-[#1ec28e]">
              <span>{p.pendingVideoFiles.length > 0 ? `${p.pendingVideoFiles.length} file(s) selected` : "Choose video files to upload"}</span>
              <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e]">Browse</span>
              <input type="file" multiple accept="video/*" className="hidden" onChange={(e) => p.setPendingVideoFiles(Array.from(e.target.files ?? []))} />
            </label>
          </div>
          {p.youtubeLinkError && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{p.youtubeLinkError}</div>}
        </div>
        <div className="border-t border-slate-200 bg-white p-6 flex gap-3 justify-between">
          <button type="button" onClick={() => p.setIsVideoFormOpen(false)} className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white" style={{ backgroundColor: "#ef5350" }}>Save to Draft</button>
          <button type="button" onClick={p.handleVideoSave} className="inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-white" style={{ backgroundColor: "#6366f1" }}>Publish Now</button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardAddSection(p: Props) {
  return (
    <div className="mt-6 space-y-6">
      {/* Tab switcher */}
      <div className="rounded-[24px] bg-white p-3 shadow-sm">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-2xl bg-[#f7faf8] p-1">
          {(["books", "videos"] as AddContentTab[]).map((tab) => (
            <button key={tab} type="button" onClick={() => p.setAddContentTab(tab)} className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition capitalize ${p.addContentTab === tab ? "bg-[#1ec28e] text-white" : "text-slate-600 hover:bg-white"}`}>{tab}</button>
          ))}
        </div>
      </div>

      {p.addContentTab === "books" ? (
        <>
          <div className="rounded-[24px] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Add Books</h3>
                <p className="text-sm text-slate-500">Click Add+ to open the book form.</p>
              </div>
              <button type="button" onClick={() => p.setIsBookFormOpen(!p.isBookFormOpen)} className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]">
                {p.isBookFormOpen ? "Close" : "Add+"}
              </button>
            </div>
          </div>

          {p.isBookFormOpen && <BookForm p={p} />}

          <div className="rounded-[24px] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h4 className="text-base font-semibold text-slate-900">Uploaded Books</h4>
              <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">{p.addedBooks.length}</span>
            </div>
            {p.addedBooks.length === 0 ? (
              <p className="rounded-2xl bg-[#f7faf8] px-4 py-3 text-sm text-slate-500">No books uploaded yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {p.addedBooks.map((book) => (
                  <div key={book.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img src={book.imageUrl} alt={book.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                      <span className="absolute left-3 top-3 inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 shadow-sm">Published</span>
                      <button type="button" onClick={() => p.handleToggleLikeBook(book.id)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm transition hover:scale-110">
                        <Heart className={`h-4 w-4 ${p.likedBookIds.has(book.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="line-clamp-2 font-semibold leading-snug text-slate-900">{book.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-[#effaf6] px-2 py-0.5 font-medium text-[#1ec28e]">{book.category}</span>
                        <span>{book.sizeLabel}</span>
                      </div>
                      <p className="mt-auto pt-2 text-lg font-bold text-slate-900">₹{book.mrp}</p>
                    </div>
                    <div className="flex items-center justify-end gap-1 border-t border-slate-100 px-4 py-2">
                      <button type="button" onClick={() => p.handleEditBook(book)} className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100" title="Edit book"><Edit2 className="h-4 w-4 text-slate-500" /></button>
                      <button type="button" onClick={() => p.handleDeleteBookWithConfirm(book.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-red-50" title="Delete book"><Trash2 className="h-4 w-4 text-slate-500 hover:text-red-500" /></button>
                      <Link href={`/dashboard/teachers/books/${book.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100" title="View book"><Eye className="h-4 w-4 text-slate-500" /></Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="rounded-[24px] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Add Videos</h3>
                <p className="text-sm text-slate-500">Click Add+ to open the video form.</p>
              </div>
              <button type="button" onClick={() => p.setIsVideoFormOpen(!p.isVideoFormOpen)} className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]">
                {p.isVideoFormOpen ? "Close" : "Add+"}
              </button>
            </div>
          </div>

          {p.isVideoFormOpen && <VideoForm p={p} />}

          <div className="rounded-[24px] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h4 className="text-base font-semibold text-slate-900">Uploaded Videos</h4>
              <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">{p.addedVideos.length}</span>
            </div>
            {p.addedVideos.length === 0 ? (
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
                    {p.addedVideos.map((video) => (
                      <tr key={video.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-black overflow-hidden flex-shrink-0">
                              {video.source === "youtube" ? (
                                <img src={`https://img.youtube.com/vi/${video.url.split("embed/")[1]?.split('"')[0] || "dQw4w9WgXcQ"}/default.jpg`} alt={video.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-slate-800 flex items-center justify-center"><Play className="h-6 w-6 text-white" /></div>
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
                        <td className="px-4 py-4"><span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">Published</span></td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => p.handleEditVideo(video)} className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"><Edit2 className="h-4 w-4 text-slate-600" /></button>
                            <button type="button" onClick={() => p.handleDeleteVideoWithConfirm(video.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"><Trash2 className="h-4 w-4 text-slate-600" /></button>
                            <button type="button" onClick={() => p.handleToggleLikeVideo(video.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition">
                              <Heart className={`h-4 w-4 ${p.likedVideoIds.has(video.id) ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
                            </button>
                            <Link href={`/dashboard/teachers/videos/${video.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"><Eye className="h-4 w-4 text-slate-600" /></Link>
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
    </div>
  );
}
