"use client";
import Image from "next/image";
import React from "react";
import { BookOpen, CreditCard, Edit2, Star, Video } from "lucide-react";
import MiniCalendar from "@/components/professional/MiniCalendar";
import UpgradeProgressChart from "@/components/professional/UpgradeProgressChart";
import { overviewCards, type AddedBook, type AddedVideo, type DashboardSection, type FeaturedPage } from "@/components/professional/DashboardTypes";

type OverviewSectionProps = {
  avatarSrc: string;
  profileName: string;
  profileSpecialization: string;
  profileContactNumber: string;
  profileLocation: string;
  profileBoostedUntil: string | null;
  certificateList: string[];
  mapsHref: string;
  addedBooks: AddedBook[];
  addedVideos: AddedVideo[];
  featuredPage: FeaturedPage;
  setFeaturedPage: (page: FeaturedPage) => void;
  featuredContent: React.ReactNode;
  setActiveSection: (section: DashboardSection) => void;
};

export default function OverviewSection({
  avatarSrc,
  profileName,
  profileSpecialization,
  profileContactNumber,
  profileLocation,
  profileBoostedUntil,
  certificateList,
  mapsHref,
  addedBooks,
  addedVideos,
  featuredPage,
  setFeaturedPage,
  featuredContent,
  setActiveSection,
}: OverviewSectionProps) {
  return (
    <>
      {/* ── Overview: Profile + Stats row ── */}
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">

        {/* Profile Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Image
                src={avatarSrc}
                alt="Professional profile"
                width={88}
                height={88}
                className="h-22 w-22 rounded-full object-cover ring-4 ring-blue-50"
                style={{ width: 88, height: 88 }}
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">{profileName || "Professional User"}</h3>
            {profileSpecialization && (
              <p className="mt-0.5 text-sm text-slate-500">{profileSpecialization}</p>
            )}
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e]">Professional</span>
              {profileBoostedUntil && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Boosted</span>
              )}
            </div>
            {profileContactNumber && (
              <p className="mt-2 text-xs text-slate-400">{profileContactNumber}</p>
            )}
            {profileLocation && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="mt-1 text-xs text-[#1ec28e] hover:underline"
              >
                📍 {profileLocation}
              </a>
            )}
            <button
              type="button"
              onClick={() => setActiveSection("settings")}
              className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#17a87a]"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Profile
            </button>
          </div>

          {certificateList.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Certificates</p>
              <div className="flex flex-wrap gap-1.5">
                {certificateList.slice(0, 3).map((certificate) => (
                  <a
                    key={certificate}
                    href={certificate}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-[#effaf6] hover:text-[#1ec28e]"
                  >
                    {certificate.split("/").pop()}
                  </a>
                ))}
                {certificateList.length > 3 && (
                  <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                    +{certificateList.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats + Cards */}
        <div className="space-y-5">
          {/* Stat cards row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-emerald-600">Active</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{addedBooks.length}</p>
              <p className="mt-0.5 text-xs text-slate-500">Books Published</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-50 text-purple-600">
                  <Video className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-emerald-600">Active</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{addedVideos.length}</p>
              <p className="mt-0.5 text-xs text-slate-500">Videos Published</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-slate-400">Total</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{certificateList.length}</p>
              <p className="mt-0.5 text-xs text-slate-500">Certificates</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-slate-400">Status</span>
              </div>
              <p className="mt-3 text-sm font-bold text-slate-900">{profileBoostedUntil ? "Boosted" : "Standard"}</p>
              <p className="mt-0.5 text-xs text-slate-500">Profile Rank</p>
            </div>
          </div>

          {/* Overview category cards */}
          <div className="grid grid-cols-2 gap-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${card.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{card.title}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom: Featured Courses + Calendar + Upgrade Chart ── */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">

        {/* Left: Featured Courses list + Upgrade Chart */}
        <div className="space-y-5">

          {/* Featured Courses - List Style */}
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Featured Courses</h3>
              <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1 border border-slate-100">
                {[1, 2, 3].map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setFeaturedPage(pageNumber as FeaturedPage)}
                    className={`min-w-8 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      featuredPage === pageNumber ? "bg-[#1ec28e] text-white shadow-sm" : "text-slate-500 hover:bg-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </div>
            {featuredContent}
          </div>

          {/* Upgrade Progress Chart */}
          <UpgradeProgressChart profileBoostedUntil={profileBoostedUntil} onUpgrade={() => setActiveSection("upgrade")} />
        </div>

        {/* Right: Calendar */}
        <MiniCalendar />
      </div>
    </>
  );
}
