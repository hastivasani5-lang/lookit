"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, CreditCard, Heart, LayoutGrid, Settings, Star, Users, Video } from "lucide-react";
import { DashboardSection, AddedBook, AddedVideo } from "./types";

type FeaturedPage = 1 | 2 | 3;

const overviewCards = [
  { title: "Business Analytics", description: "Invest in your future with our business analysis course", icon: LayoutGrid, iconBg: "bg-[#eef5ff] text-[#5067d9]" },
  { title: "Design", description: "Invest in your future with our design strategy course", icon: BookOpen, iconBg: "bg-[#effaf6] text-[#1ec28e]" },
  { title: "Currency", description: "Invest in your future with our finance and currency course", icon: CreditCard, iconBg: "bg-[#f0f7ff] text-[#5067d9]" },
  { title: "Sale Marketing", description: "Invest in your future with our marketing course", icon: Users, iconBg: "bg-[#fff4e8] text-[#f59e0b]" },
];

const coursePageOne = [
  { title: "The Complete HTML & CSS Bootcamp 2023 Edition", image: "/img1.png", tag: "Graphic Design", academy: "JDG Academy", lessons: "32 Lessons" },
  { title: "The Complete HTML & CSS Bootcamp 2023 Edition", image: "/person.png", tag: "Graphic Design", academy: "STK Academy", lessons: "28 Lessons" },
  { title: "The Complete HTML & CSS Bootcamp 2023 Edition", image: "/books.png", tag: "Graphic Design", academy: "LOA Academy", lessons: "32 Lessons" },
  { title: "The Complete HTML & CSS Bootcamp 2023 Edition", image: "/girls.png", tag: "Graphic Design", academy: "JDG Academy", lessons: "30 Lessons" },
  { title: "The Complete HTML & CSS Bootcamp 2023 Edition", image: "/offer-video.png", tag: "Graphic Design", academy: "JDG Academy", lessons: "34 Lessons" },
  { title: "The Complete HTML & CSS Bootcamp 2023 Edition", image: "/hero.png", tag: "Graphic Design", academy: "JDG Academy", lessons: "35 Lessons" },
];

const coursePageTwo = [
  { title: "CSS Grid in Depth", youtubeId: "UB1O30fR-EE", tag: "Video Course", academy: "EducateX Academy" },
  { title: "Flexbox Masterclass", youtubeId: "yfoY53QXEnI", tag: "Video Course", academy: "EducateX Academy" },
  { title: "HTML Layout Workshop", youtubeId: "1Rs2ND1ryYc", tag: "Video Course", academy: "EducateX Academy" },
];

const coursePageThree = [
  { title: "UI Design System Workshop", image: "/person.png", tag: "Workshop", academy: "EducateX Lab", lessons: "18 Lessons" },
  { title: "Responsive Landing Page Build", image: "/books.png", tag: "Workshop", academy: "EducateX Lab", lessons: "20 Lessons" },
  { title: "Professional Portfolio Sprint", image: "/girls.png", tag: "Workshop", academy: "EducateX Lab", lessons: "16 Lessons" },
  { title: "Component Styling Deep Dive", image: "/img1.png", tag: "Workshop", academy: "EducateX Lab", lessons: "24 Lessons" },
  { title: "Dashboard UI Patterns", image: "/hero.png", tag: "Workshop", academy: "EducateX Lab", lessons: "19 Lessons" },
  { title: "Modern Page Layouts", image: "/offer-video.png", tag: "Workshop", academy: "EducateX Lab", lessons: "22 Lessons" },
];

const detailVideos = [
  { title: "Grid Layout Tutorial", youtubeId: "UB1O30fR-EE" },
  { title: "Flexbox Tutorial", youtubeId: "yfoY53QXEnI" },
];

type Props = {
  avatarSrc: string;
  profileName: string;
  profileSpecialization: string;
  profileContactNumber: string;
  profileLocation: string;
  profileBoostedUntil: string | null;
  certificateList: string[];
  mapsHref: string;
  featuredPage: FeaturedPage;
  setFeaturedPage: (page: FeaturedPage) => void;
  setActiveSection: (section: DashboardSection) => void;
};

export default function DashboardOverviewSection({
  avatarSrc,
  profileName,
  profileSpecialization,
  profileContactNumber,
  profileLocation,
  profileBoostedUntil,
  certificateList,
  mapsHref,
  featuredPage,
  setFeaturedPage,
  setActiveSection,
}: Props) {
  const featuredContent = (() => {
    if (featuredPage === 2) {
      return (
        <div className="grid gap-4 lg:grid-cols-3">
          {coursePageTwo.map((video, index) => (
            <article key={`${video.title}-${index}`} className="overflow-hidden rounded-[22px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="relative aspect-video bg-slate-950">
                <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${video.youtubeId}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="space-y-3 p-4">
                <span className="inline-flex rounded-full bg-[#1ec28e]/10 px-3 py-1 text-xs font-medium text-[#1ec28e]">{video.tag}</span>
                <h4 className="text-sm font-semibold leading-5 text-slate-900">{video.title}</h4>
                <p className="text-xs text-slate-500">{video.academy}</p>
              </div>
            </article>
          ))}
        </div>
      );
    }
    if (featuredPage === 3) {
      return (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {coursePageThree.map((course, index) => (
            <article key={`${course.title}-${index}`} className="overflow-hidden rounded-[22px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="relative h-44 overflow-hidden">
                <Image src={course.image} alt={course.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-[#1ec28e] px-3 py-1 text-xs font-medium text-white">{course.tag}</div>
                <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#1ec28e] shadow-sm"><Heart className="h-4 w-4" /></button>
              </div>
              <div className="space-y-4 p-4">
                <h4 className="text-sm font-semibold leading-5 text-slate-900">{course.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{course.academy}</span>
                  <span className="flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />4.8</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>{course.lessons}</span>
                  <span className="text-sm font-semibold text-[#1ec28e]">$59.00</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      );
    }
    return (
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {coursePageOne.map((course, index) => (
          <article key={`${course.title}-${index}`} className="overflow-hidden rounded-[22px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="relative h-44 overflow-hidden">
              <Image src={course.image} alt={course.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-[#1ec28e] px-3 py-1 text-xs font-medium text-white">{course.tag}</div>
              <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#1ec28e] shadow-sm"><Heart className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4 p-4">
              <h4 className="text-sm font-semibold leading-5 text-slate-900">{course.title}</h4>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{course.academy}</span>
                <span className="flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />4.5</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>{course.lessons}</span>
                <span className="text-sm font-semibold text-[#1ec28e]">$49.00</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  })();

  return (
    <>
      {/* Profile card */}
      <div className="mt-6 rounded-[24px] bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
          <div className="flex justify-center lg:justify-start">
            <Image src={avatarSrc} alt="Professional profile" width={92} height={92} className="h-20 w-20 rounded-3xl border border-slate-100 object-cover" />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-sm font-medium text-[#1ec28e]">Professional Profile</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">{profileName || "Professional User"}</h3>
            {(profileSpecialization || profileContactNumber) && (
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs lg:justify-start">
                {profileSpecialization && <span className="rounded-full bg-[#f7faf8] px-3 py-1 text-slate-600">{profileSpecialization}</span>}
                {profileContactNumber && <span className="rounded-full bg-[#f7faf8] px-3 py-1 text-slate-600">{profileContactNumber}</span>}
              </div>
            )}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 lg:justify-start">
              <span className="rounded-full bg-[#effaf6] px-3 py-1 text-[#1ec28e]">Professional</span>
              {certificateList.length > 0 && <span className="rounded-full bg-slate-100 px-3 py-1">{certificateList.length} Certificates</span>}
              {profileBoostedUntil && <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Boost active</span>}
            </div>
            {profileLocation && (
              <a href={mapsHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#1ec28e] transition hover:text-[#18ab7d]">
                {profileLocation}
              </a>
            )}
          </div>
          <div className="flex items-start justify-center lg:justify-end">
            <button type="button" onClick={() => setActiveSection("settings")} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1ec28e] px-5 text-sm font-medium text-white transition hover:bg-[#18ab7d]">
              <Settings className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
        {certificateList.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {certificateList.slice(0, 4).map((cert) => (
              <a key={cert} href={cert} target="_blank" rel="noreferrer" className="rounded-full bg-[#f7faf8] px-3 py-1 text-xs text-slate-600 transition hover:bg-[#eaf7f1] hover:text-[#1ec28e]">
                {cert.split("/").pop()}
              </a>
            ))}
            {certificateList.length > 4 && <span className="rounded-full bg-[#f7faf8] px-3 py-1 text-xs text-slate-600">+{certificateList.length - 4} more</span>}
          </div>
        )}
      </div>

      {/* Overview cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-[24px] bg-white p-5 shadow-sm">
              <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${card.iconBg}`}><Icon className="h-7 w-7" /></div>
              <h3 className="mt-4 text-center text-base font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-center text-sm text-slate-500">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Featured courses */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Featured Course</h3>
            <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm">
              {([1, 2, 3] as FeaturedPage[]).map((p) => (
                <button key={p} onClick={() => setFeaturedPage(p)} className={`min-w-10 rounded-full px-3 py-2 text-sm font-medium transition ${featuredPage === p ? "bg-[#1ec28e] text-white" : "text-slate-500 hover:bg-slate-100"}`}>{p}</button>
              ))}
            </div>
          </div>
          {featuredContent}
        </div>

        <aside className="rounded-[24px] bg-white p-4 shadow-sm">
          {featuredPage === 2 ? (
            <>
              <div className="space-y-3">
                {detailVideos.map((v) => (
                  <div key={v.youtubeId} className="relative overflow-hidden rounded-[18px] bg-slate-950">
                    <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${v.youtubeId}`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">YouTube Learning Playlist</h4>
                  <span className="text-sm font-semibold text-[#1ec28e]">Live</span>
                </div>
                <div className="mt-4 rounded-2xl bg-[#f7faf8] p-4">
                  <p className="text-sm font-semibold text-slate-900">Courses included</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-500">
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />CSS Grid and Flexbox</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Responsive layout practice</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Portfolio project walkthroughs</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-[18px]">
                <Image src="/offer-video.png" alt="Detail course" width={600} height={360} className="h-52 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                <button className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-white/95 text-[#1ec28e] shadow-lg">
                  <Video className="h-6 w-6 fill-current" />
                </button>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-base font-semibold text-slate-900">The Complete HTML & CSS Bootcamp 2023 Edition</h4>
                  <span className="text-lg font-semibold text-[#1ec28e]">$49.00</span>
                </div>
                <div className="mt-4 rounded-2xl bg-[#f7faf8] p-4">
                  <p className="text-sm font-semibold text-slate-900">Course included</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-500">
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />24 videos by this course</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Access on mobile devices</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Access at any time</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Certificate of completion</li>
                  </ul>
                </div>
                <div className="mt-4 rounded-2xl border border-[#e7f2ee] bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">What you will learn?</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-500">
                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#1ec28e]" />Improve UI fundamentals</li>
                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#1ec28e]" />Create responsive layouts</li>
                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#1ec28e]" />Build professional projects</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
