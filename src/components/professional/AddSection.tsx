"use client";
import React from "react";
import Link from "next/link";
import { Edit2, Eye, Heart, Play, Trash2 } from "lucide-react";
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
  // user object needed for instructor select
  const user = { name: userName };
  return (
            <div className="mt-6 space-y-6">
              <div className="rounded-[24px] bg-white p-3 shadow-sm">
                <div className="flex w-full max-w-sm items-center gap-2 rounded-2xl bg-[#f7faf8] p-1">
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
                </div>
              </div>

              {addContentTab === "books" ? (
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

                          {/* Upload Course Images */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Course Images</label>
                            <label className="flex min-h-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-[#f7faf8] transition hover:border-[#1ec28e]">
                              {bookImageFile ? (
                                <img src={URL.createObjectURL(bookImageFile)} alt="preview" className="h-24 w-24 object-cover rounded" />
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <span className="text-sm text-slate-600">Drag or click to upload</span>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => setBookImageFile(event.target.files?.[0] ?? null)}
                              />
                            </label>
                          </div>

                          {/* Upload Video URL */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Video URL</label>
                            <input
                              type="url"
                              value={bookLinkInput}
                              onChange={(event) => setBookLinkInput(event.target.value)}
                              placeholder="https://videos.com"
                              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                            />
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

                          {/* Course Files Upload */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Course Files</label>
                            <label className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 bg-[#f7faf8] px-4 text-sm text-slate-600 transition hover:border-[#1ec28e] hover:bg-[#f0f7f5]">
                              <span>{pendingBookFiles.length > 0 ? `${pendingBookFiles.length} file(s) selected` : "Choose course files to upload"}</span>
                              <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e]">Browse</span>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                className="hidden"
                                onChange={(event) => setPendingBookFiles(Array.from(event.target.files ?? []))}
                              />
                            </label>
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
              ) : (
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
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Video URL</label>
                            <input
                              type="url"
                              value={youtubeLinkInput}
                              onChange={(event) => setYoutubeLinkInput(event.target.value)}
                              placeholder="https://videos.com"
                              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                            />
                          </div>

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

                          {/* Upload Video Files */}
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Upload Video Files</label>
                            <label className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 bg-[#f7faf8] px-4 text-sm text-slate-600 transition hover:border-[#1ec28e] hover:bg-[#f0f7f5]">
                              <span>{pendingVideoFiles.length > 0 ? `${pendingVideoFiles.length} file(s) selected` : "Choose video files to upload"}</span>
                              <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e]">Browse</span>
                              <input
                                type="file"
                                multiple
                                accept="video/*"
                                className="hidden"
                                onChange={(event) => setPendingVideoFiles(Array.from(event.target.files ?? []))}
                              />
                            </label>
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
            </div>
  );
}
