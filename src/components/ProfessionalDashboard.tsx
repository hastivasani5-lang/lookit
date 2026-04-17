"use client";
import React from "react";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Calendar as CalendarIcon,
  BookOpen,
  ChevronRight,
  CreditCard,
  Edit2,
  Eye,
  Heart,
  LayoutGrid,
  LogOut,
  Play,
  Save,
  Search,
  Settings,
  Star,
  Trash2,
  Upload,
  Users,
  Video,
} from "lucide-react";
import UpgradeTimeline from "@/components/UpgradeTimeline";
import NotificationModal from "./NotificationModal";

type ProfessionalUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
  specialization?: string | null;
  contactNumber?: string | null;
  location?: string | null;
  certificates?: string[];
  reviews?: string[];
  profileBoostedUntil?: string | null;
};

type ProfessionalDashboardProps = {
  user: ProfessionalUser;
};

type DashboardSection = "overview" | "add" | "upgrade" | "settings";
type AddContentTab = "books" | "videos";

type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  section: DashboardSection;
  addTab?: AddContentTab;
  featuredTargetPage?: FeaturedPage;
  openUrl?: string;
};

type AddedBook = {
  id: string;
  name: string;
  mrp: string;
  category: string;
  fileName: string;
  sizeLabel: string;
  url: string;
  imageUrl: string;
  source: "file" | "amazon";
};

type AddedVideo = {
  id: string;
  name: string;
  mrp: string;
  sizeLabel: string;
  url: string;
  level?: string;
  category?: string;
  source: "file" | "youtube";
  isPopular: boolean;
};

type FeaturedPage = 1 | 2 | 3;

type UpgradePlanKey = "starter" | "pro" | "premium" | "elite";

const upgradePlans: Array<{
  key: UpgradePlanKey;
  name: string;
  price: string;
  duration: string;
}> = [
  { key: "starter", name: "Starter", price: "$9", duration: "1 week boost" },
  { key: "pro", name: "Pro", price: "$19", duration: "1 month boost" },
  { key: "premium", name: "Premium", price: "$39", duration: "2 months boost" },
  { key: "elite", name: "Elite", price: "$59", duration: "3 months boost" },
];

const RAZORPAY_PAYMENT_LINK = "https://razorpay.me/@jenildineshbhaigadhiya";

const sidebarItems: Array<{ label: string; icon: typeof LayoutGrid; section?: DashboardSection; href?: string }> = [
  { label: "Overview", icon: LayoutGrid, section: "overview" },
  { label: "Add", icon: Upload, section: "add" },
  { label: "Upgrade Profile", icon: CreditCard, section: "upgrade" },
  { label: "Purchases", icon: Users, href: "/dashboard/teachers/purchases" },
  { label: "Reviews", icon: Star, href: "/dashboard/teachers/reviews" },
  { label: "Follow", icon: Users, href: "/dashboard/professional/follow" },
  { label: "Settings", icon: Settings, section: "settings" },
];

const overviewCards = [
  {
    title: "Total User",
    description: "Invest in your future with our business analysis course",
    icon: LayoutGrid,
    iconBg: "bg-[#eef5ff] text-[#5067d9]",
  },
  {
    title: "Total Book",
    description: "Invest in your future with our design strategy course",
    icon: BookOpen,
    iconBg: "bg-[#effaf6] text-[#1ec28e]",
  },
  {
    title: "Total Video",
    description: "Invest in your future with our finance and currency course",
    icon: CreditCard,
    iconBg: "bg-[#f0f7ff] text-[#5067d9]",
  },
  {
    title: "Running Plan",
    description: "Invest in your future with our marketing course",
    icon: Users,
    iconBg: "bg-[#fff4e8] text-[#f59e0b]",
  },
];

const coursePageOne = [
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/img1.png",
    tag: "Graphic Design",
    academy: "JDG Academy",
    lessons: "32 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/person.png",
    tag: "Graphic Design",
    academy: "STK Academy",
    lessons: "28 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/books.png",
    tag: "Graphic Design",
    academy: "LOA Academy",
    lessons: "32 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/girls.png",
    tag: "Graphic Design",
    academy: "JDG Academy",
    lessons: "30 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/offer-video.png",
    tag: "Graphic Design",
    academy: "JDG Academy",
    lessons: "34 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/hero.png",
    tag: "Graphic Design",
    academy: "JDG Academy",
    lessons: "35 Lessons",
  },
];

const coursePageTwo = [
  {
    title: "CSS Grid in Depth",
    youtubeId: "UB1O30fR-EE",
    tag: "Video Course",
    academy: "EducateX Academy",
  },
  {
    title: "Flexbox Masterclass",
    youtubeId: "yfoY53QXEnI",
    tag: "Video Course",
    academy: "EducateX Academy",
  },
  {
    title: "HTML Layout Workshop",
    youtubeId: "1Rs2ND1ryYc",
    tag: "Video Course",
    academy: "EducateX Academy",
  },
];

const coursePageThree = [
  {
    title: "UI Design System Workshop",
    image: "/person.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "18 Lessons",
  },
  {
    title: "Responsive Landing Page Build",
    image: "/books.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "20 Lessons",
  },
  {
    title: "Professional Portfolio Sprint",
    image: "/girls.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "16 Lessons",
  },
  {
    title: "Component Styling Deep Dive",
    image: "/img1.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "24 Lessons",
  },
  {
    title: "Dashboard UI Patterns",
    image: "/hero.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "19 Lessons",
  },
  {
    title: "Modern Page Layouts",
    image: "/offer-video.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "22 Lessons",
  },
];

const detailVideos = [
  {
    title: "Grid Layout Tutorial",
    youtubeId: "UB1O30fR-EE",
  },
  {
    title: "Flexbox Tutorial",
    youtubeId: "yfoY53QXEnI",
  },
  {
    title: "HTML/CSS Course",
    youtubeId: "1Rs2ND1ryYc",
  },
];

export default function ProfessionalDashboard({ user }: ProfessionalDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [addContentTab, setAddContentTab] = useState<AddContentTab>("books");
  const [featuredPage, setFeaturedPage] = useState<FeaturedPage>(1);
  const [profileName, setProfileName] = useState(user.name);
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileSpecialization, setProfileSpecialization] = useState(user.specialization ?? "");
  const [profileContactNumber, setProfileContactNumber] = useState(user.contactNumber ?? "");
  const [profileLocation, setProfileLocation] = useState(user.location ?? "");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [profilePostalCode, setProfilePostalCode] = useState("");
  const [profileCountry, setProfileCountry] = useState("");
  const [profileFacebook, setProfileFacebook] = useState("");
  const [profileGoogle, setProfileGoogle] = useState("");
  const [profileTwitter, setProfileTwitter] = useState("");
  const [profilePinterest, setProfilePinterest] = useState("");
  const [profileAboutMe, setProfileAboutMe] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [certificateUploads, setCertificateUploads] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState(user.image || "/person.png");
  const [certificateList, setCertificateList] = useState<string[]>(user.certificates ?? []);
  const [profileBoostedUntil, setProfileBoostedUntil] = useState<string | null>(user.profileBoostedUntil ?? null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [upgradePlan, setUpgradePlan] = useState<UpgradePlanKey>("pro");
  const [profileReviewsText, setProfileReviewsText] = useState((user.reviews ?? []).join("\n"));
  const [addedBooks, setAddedBooks] = useState<AddedBook[]>([]);
  const [addedVideos, setAddedVideos] = useState<AddedVideo[]>([]);
  const [bookNameInput, setBookNameInput] = useState("");
  const [bookMrpInput, setBookMrpInput] = useState("");
  const [bookCategoryInput, setBookCategoryInput] = useState("");
  const [bookImageFile, setBookImageFile] = useState<File | null>(null);
  const [pendingBookFiles, setPendingBookFiles] = useState<File[]>([]);
  const [bookImageLinkInput, setBookImageLinkInput] = useState("");
  const [bookLinkInput, setBookLinkInput] = useState("");
  const [bookFormError, setBookFormError] = useState("");
  const [bookInstructorInput, setBookInstructorInput] = useState("");
  const [bookModeInput, setBookModeInput] = useState<"online" | "offline">("online");
  const [bookDescriptionInput, setBookDescriptionInput] = useState("");
  const [bookTypeInput, setBookTypeInput] = useState<"free" | "paid">("free");
  const [bookLevelInput, setBookLevelInput] = useState("");
  const [bookCoursePackageInput, setBookCoursePackageInput] = useState<"30days" | "60days" | "6months" | "1year">("30days");
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
  const [youtubeLinkInput, setYoutubeLinkInput] = useState("");
  const [youtubeLinkError, setYoutubeLinkError] = useState("");
  const [videoMrpInput, setVideoMrpInput] = useState("");
  const [pendingVideoFiles, setPendingVideoFiles] = useState<File[]>([]);
  const [videoInstructorInput, setVideoInstructorInput] = useState("");
  const [videoModeInput, setVideoModeInput] = useState<"online" | "offline">("online");
  const [videoDescriptionInput, setVideoDescriptionInput] = useState("");
  const [videoTypeInput, setVideoTypeInput] = useState<"free" | "paid">("free");
  const [videoLevelInput, setVideoLevelInput] = useState("");
  const [videoCoursePackageInput, setVideoCoursePackageInput] = useState<"30days" | "60days" | "6months" | "1year">("30days");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Notification data states
  const [notificationFollowers, setNotificationFollowers] = useState<any[]>([]);
  const [notificationBooksVideos, setNotificationBooksVideos] = useState<any[]>([]);
  const [notificationPurchases, setNotificationPurchases] = useState<any[]>([]);

  // Fetch notification data when notification sidebar opens
  useEffect(() => {
    if (!isNotificationOpen) return;
    async function fetchNotifications() {
      // Followers (not implemented in follows.json, so leave empty or mock)
      setNotificationFollowers([]);

      // Books and videos added by professional
      try {
        const res = await fetch('/data/content-library.json');
        const data = await res.json();
        const prof = data.professionals?.[user.id];
        const books = prof?.books?.map((b: any) => ({ id: b.id, message: `Book added: ${b.name}` })) || [];
        const videos = prof?.videos?.map((v: any) => ({ id: v.id, message: `Video added: ${v.name}` })) || [];
        setNotificationBooksVideos([...books, ...videos]);
      } catch {
        setNotificationBooksVideos([]);
      }

      // Purchases by students
      try {
        const res = await fetch('/data/payments.json');
        const data = await res.json();
        const purchases = (data.payments || [])
          .filter((p: any) => p.professionalId === user.id)
          .flatMap((p: any) => (p.items || []).map((item: any) => ({
            id: `${p.id}-${item.contentId}`,
            message: `${p.studentName} bought ${item.title} (${item.contentType})`
          })));
        setNotificationPurchases(purchases);
      } catch {
        setNotificationPurchases([]);
      }
    }
    fetchNotifications();
  }, [isNotificationOpen, user.id]);
  const [hasOpenedRazorpay, setHasOpenedRazorpay] = useState(false);
  const [likedBookIds, setLikedBookIds] = useState<Set<string>>(new Set());
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set());
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section === "add" || section === "upgrade" || section === "settings" || section === "overview") {
      setActiveSection(section);
      return;
    }
    setActiveSection("overview");
  }, [searchParams]);

  useEffect(() => {
    setProfileName(user.name);
    setProfileEmail(user.email);
    setProfileSpecialization(user.specialization ?? "");
    setProfileContactNumber(user.contactNumber ?? "");
    setProfileLocation(user.location ?? "");
    setPhotoPreview(user.image || "/person.png");
    setCertificateList(user.certificates ?? []);
    setProfileReviewsText((user.reviews ?? []).join("\n"));
    setProfileBoostedUntil(user.profileBoostedUntil ?? null);
  }, [
    user.certificates,
    user.contactNumber,
    user.email,
    user.image,
    user.location,
    user.name,
    user.profileBoostedUntil,
    user.reviews,
    user.specialization,
  ]);

  useEffect(() => {
    if (!photoFile) {
      return;
    }

    const previewUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [photoFile]);

  // Load persisted professional profile data from localStorage
  useEffect(() => {
    if (!user.id) return;

    const STORAGE_KEY = `professional-profile-${user.id}`;
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as Record<string, string>;
        setProfileFirstName(parsed.firstName || "");
        setProfileLastName(parsed.lastName || "");
        setProfileAddress(parsed.address || "");
        setProfileCity(parsed.city || "");
        setProfilePostalCode(parsed.postalCode || "");
        setProfileCountry(parsed.country || "");
        setProfileFacebook(parsed.facebook || "");
        setProfileGoogle(parsed.google || "");
        setProfileTwitter(parsed.twitter || "");
        setProfilePinterest(parsed.pinterest || "");
        setProfileAboutMe(parsed.aboutMe || "");
      }
    } catch {
      // Silently fail if localStorage read fails
    }
  }, [user.id]);

  const featuredContent = useMemo(() => {
    // Helper to check if a date is within the last 24 hours
    const isToday = (createdAt: string) => {
      if (!createdAt) return false;
      const now = new Date();
      const created = new Date(createdAt);
      return now.getTime() - created.getTime() < 24 * 60 * 60 * 1000 && now.getDate() === created.getDate() && now.getMonth() === created.getMonth() && now.getFullYear() === created.getFullYear();
    };

    // Filter books/videos to only those added today
    const todaysBooks = addedBooks.filter((b) => isToday((b as any).createdAt));
    const todaysVideos = addedVideos.filter((v) => isToday((v as any).createdAt));

    const getListItem = (
      item: any,
      index: number,
      isVideo: boolean = false
    ) => {
      // Fallbacks for image src and alt
      const imageSrc = item.image || item.imageUrl || "/books.png";
      const imageAlt = item.title || item.name || "Book or Video";
      // Determine open URL for book or video
      let openUrl = "";
      if (isVideo) {
        // For YouTube or file videos
        openUrl = item.url || (item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : "");
      } else {
        // For books: prefer file URL if present, else Amazon/external
        if (item.source === "file" && item.fileName && item.url && item.url.startsWith("blob:")) {
          // Local file upload (blob URL)
          openUrl = item.url;
        } else if (item.source === "file" && item.url && (item.url.endsWith(".pdf") || item.url.startsWith("/uploads/"))) {
          // Uploaded PDF or server file
          openUrl = item.url;
        } else if (item.source === "amazon" && item.url) {
          // Amazon/external link
          openUrl = item.url;
        } else if (item.url) {
          openUrl = item.url;
        } else if (item.imageUrl && (item.imageUrl.endsWith(".pdf") || item.imageUrl.startsWith("/uploads/"))) {
          openUrl = item.imageUrl;
        } else {
          openUrl = "";
        }
      }
      const handleClick = (e: React.MouseEvent) => {
        if (openUrl) {
          window.open(openUrl, "_blank", "noopener,noreferrer");
        }
      };
      return (
        <li
          key={`${item.title || item.name}-${index}`}
          className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-slate-50 transition"
          onClick={handleClick}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(e as any); }}
          role="button"
          aria-label={`Open ${isVideo ? 'video' : 'book'}: ${item.title || item.name}`}
        >
          <div className={`relative ${isVideo ? "h-14 w-24" : "h-14 w-20"} flex-shrink-0 overflow-hidden rounded-xl bg-slate-100`}>
            {isVideo ? (
              <iframe
                className="h-full w-full rounded-xl"
                src={`https://www.youtube.com/embed/${item.youtubeId}`}
                title={item.title || item.name || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Image src={imageSrc} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw" className="object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#1ec28e]/10 px-2 py-0.5 text-xs font-medium text-[#1ec28e]">{item.tag || ""}</span>
              <span className="text-xs text-slate-500">{item.academy || ""}</span>
            </div>
            <h4 className="mt-1 text-sm font-semibold leading-5 text-slate-900 truncate">{item.title || item.name}</h4>
            {isVideo ? null : (
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span>{item.lessons}</span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  4.5
                </span>
                <span className="text-sm font-semibold text-[#1ec28e]">$49.00</span>
              </div>
            )}
          </div>
        </li>
      );
    };

    // Show only today's books/videos in the featured list
    return (
      <ul className="divide-y divide-slate-100 bg-white rounded-[22px] shadow-sm">
        {todaysVideos.map((video, index) => getListItem(video, index, true))}
        {todaysBooks.map((book, index) => getListItem(book, index, false))}
        {todaysVideos.length === 0 && todaysBooks.length === 0 && (
          <li className="px-4 py-6 text-center text-slate-500">No featured content added today.</li>
        )}
      </ul>
    );
  }, [featuredPage]);

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");
    setProfileError("");

    try {
      // Save to localStorage first (client-side persistence)
      if (user.id) {
        const STORAGE_KEY = `professional-profile-${user.id}`;
        const dataToSave = {
          firstName: profileFirstName,
          lastName: profileLastName,
          address: profileAddress,
          city: profileCity,
          postalCode: profilePostalCode,
          country: profileCountry,
          facebook: profileFacebook,
          google: profileGoogle,
          twitter: profileTwitter,
          pinterest: profilePinterest,
          aboutMe: profileAboutMe,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      }

      const formData = new FormData();
      formData.append("name", profileName);
      formData.append("email", profileEmail);
      formData.append("specialization", profileSpecialization);
      formData.append("contactNumber", profileContactNumber);
      formData.append("location", profileLocation);
      formData.append("reviews", profileReviewsText);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      certificateUploads.forEach((file) => {
        formData.append("certificates", file);
      });

      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        message?: string;
        user?: {
          name?: string;
          email?: string;
          specialization?: string;
          contactNumber?: string;
          location?: string;
          image?: string | null;
          certificates?: string[];
          reviews?: string[];
        };
      };

      if (!response.ok) {
        setProfileError(result.message || "Unable to update profile.");
        return;
      }

      if (result.user?.name) {
        setProfileName(result.user.name);
      }

      if (result.user?.email) {
        setProfileEmail(result.user.email);
      }

      if (typeof result.user?.specialization === "string") {
        setProfileSpecialization(result.user.specialization);
      }

      if (typeof result.user?.contactNumber === "string") {
        setProfileContactNumber(result.user.contactNumber);
      }

      if (typeof result.user?.location === "string") {
        setProfileLocation(result.user.location);
      }

      if (result.user?.image) {
        setPhotoPreview(result.user.image);
      }

      if (result.user?.certificates) {
        setCertificateList(result.user.certificates);
      }

      if (result.user?.reviews) {
        setProfileReviewsText(result.user.reviews.join("\n"));
      }

      setPhotoFile(null);
      setCertificateUploads([]);
      setProfileMessage(result.message || "Profile updated successfully.");
      router.refresh();
    } catch {
      setProfileError("Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpgradeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessingUpgrade(true);
    setProfileError("");
    setProfileMessage("");

    if (!hasOpenedRazorpay) {
      setProfileError("Please complete payment from the Razorpay link first, then click Confirm Payment.");
      setProcessingUpgrade(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("plan", upgradePlan);

      const response = await fetch("/api/profile/upgrade", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { message?: string; user?: { profileBoostedUntil?: string | null } };

      if (!response.ok) {
        setProfileError(result.message || "Unable to process payment.");
        setProcessingUpgrade(false);
        return;
      }

      setProfileBoostedUntil(result.user?.profileBoostedUntil ?? null);
      setProfileMessage("Successful");
      setHasOpenedRazorpay(false);
      setProcessingUpgrade(false);
      router.refresh();
    } catch {
      setProfileError("Unable to process payment.");
      setProcessingUpgrade(false);
    }
  };

  const handleOpenRazorpay = () => {
    window.open(RAZORPAY_PAYMENT_LINK, "_blank", "noopener,noreferrer");
    setHasOpenedRazorpay(true);
    setProfileError("");
    setProfileMessage("");
  };

  const avatarSrc = photoPreview || "/person.png";
  const mapsHref = profileLocation
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profileLocation)}`
    : "https://www.google.com/maps";

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const parseHttpUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  };

  const isAmazonLink = (value: string) => {
    const parsed = parseHttpUrl(value);
    if (!parsed) {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    return host.includes("amazon.") || host.includes("amzn.to");
  };

  useEffect(() => {
    if (!isMounted || user.role !== "professional") {
      return;
    }

    const loadLibrary = async () => {
      try {
        const response = await fetch("/api/profile/library", { cache: "no-store" });
        if (!response.ok) {
          setAddedBooks([]);
          setAddedVideos([]);
          return;
        }

        const payload = (await response.json().catch(() => ({}))) as {
          books?: AddedBook[];
          videos?: AddedVideo[];
        };

        const nextBooks = Array.isArray(payload.books) ? payload.books : [];
        const nextVideos = Array.isArray(payload.videos) ? payload.videos : [];

        setAddedBooks(nextBooks);
        setAddedVideos(nextVideos);
      } catch {
        setAddedBooks([]);
        setAddedVideos([]);
      }
    };

    void loadLibrary();
  }, [isMounted, user.role]);

  useEffect(() => {
    if (!isMounted || user.role !== "professional") {
      return;
    }

    const touchSession = () => {
      void fetch("/api/professionals/session", {
        method: "POST",
        cache: "no-store",
      }).catch(() => undefined);
    };

    touchSession();
    const timer = window.setInterval(touchSession, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isMounted, user.role]);

  const handleBookSave = async () => {
    const files = pendingBookFiles;
    if (files.length === 0) {
      if (bookLinkInput.trim()) {
        await handleAmazonBookAdd();
      } else {
        setBookFormError("Please select book files or provide an Amazon link before saving.");
      }
      return;
    }

    const trimmedBookName = bookNameInput.trim();
    const trimmedBookMrp = bookMrpInput.trim();
    const trimmedBookCategory = bookCategoryInput.trim();
    const parsedMrp = Number(trimmedBookMrp);

    if (!trimmedBookName || !trimmedBookMrp || !trimmedBookCategory) {
      setBookFormError("Please enter book name, MRP, and category/type before uploading.");
      return;
    }

    const trimmedBookImageLink = bookImageLinkInput.trim();
    let resolvedBookImageUrl = "";

    if (bookImageFile) {
      resolvedBookImageUrl = URL.createObjectURL(bookImageFile);
    } else if (trimmedBookImageLink) {
      if (!parseHttpUrl(trimmedBookImageLink)) {
        setBookFormError("Please provide a valid image link.");
        return;
      }
      resolvedBookImageUrl = trimmedBookImageLink;
    } else {
      setBookFormError("Please upload a book image file or provide an image link.");
      return;
    }

    if (!Number.isFinite(parsedMrp) || parsedMrp <= 0) {
      setBookFormError("Please enter a valid MRP amount.");
      return;
    }

    setBookFormError("");

    const localBooks = files.map((file, index) => ({
      id: `book-${Date.now()}-${index}`,
      name: trimmedBookName,
      mrp: parsedMrp.toFixed(2),
      category: trimmedBookCategory,
      fileName: file.name,
      sizeLabel: formatFileSize(file.size),
      url: URL.createObjectURL(file),
      imageUrl: resolvedBookImageUrl,
      source: "file" as const,
    }));

    setAddedBooks((prev) => [...localBooks, ...prev]);

    try {
      const persisted = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("kind", "book");
          formData.append("name", trimmedBookName);
          formData.append("category", trimmedBookCategory);
          formData.append("mrp", parsedMrp.toFixed(2));
          formData.append("url", "");
          formData.append("source", "file");
          formData.append("fileName", file.name);
          formData.append("sizeLabel", formatFileSize(file.size));
          formData.append("imageLink", trimmedBookImageLink);

          if (bookImageFile) {
            formData.append("imageFile", bookImageFile);
          }

          const response = await fetch("/api/profile/library", {
            method: "POST",
            body: formData,
          });

          const payload = (await response.json().catch(() => ({}))) as { book?: AddedBook };
          return payload.book;
        }),
      );

      const validPersisted = persisted.filter((book): book is AddedBook => Boolean(book));
      if (validPersisted.length > 0) {
        setAddedBooks((current) => {
          const withoutTemp = current.filter((book) => !localBooks.some((tempBook) => tempBook.id === book.id));
          return [...validPersisted, ...withoutTemp];
        });
      }
    } catch {
      // keep local preview entries even if persistence fails
    }

    setBookNameInput("");
    setBookMrpInput("");
    setBookCategoryInput("");
    setBookImageFile(null);
    setPendingBookFiles([]);
    setBookImageLinkInput("");
    setBookLinkInput("");
    setEditingBookId(null);
    setIsBookFormOpen(false);
  };

  const handleAmazonBookAdd = async () => {
    const trimmedBookName = bookNameInput.trim();
    const trimmedBookMrp = bookMrpInput.trim();
    const trimmedBookCategory = bookCategoryInput.trim();
    const trimmedBookImageLink = bookImageLinkInput.trim();
    const trimmedBookLink = bookLinkInput.trim();
    const parsedMrp = Number(trimmedBookMrp);

    if (!trimmedBookName || !trimmedBookMrp || !trimmedBookCategory || !trimmedBookLink) {
      setBookFormError("Please enter book name, MRP, category/type, and Amazon link.");
      return;
    }

    if (!Number.isFinite(parsedMrp) || parsedMrp <= 0) {
      setBookFormError("Please enter a valid MRP amount.");
      return;
    }

    if (!isAmazonLink(trimmedBookLink)) {
      setBookFormError("Please provide a valid Amazon book link.");
      return;
    }

    if (trimmedBookImageLink && !parseHttpUrl(trimmedBookImageLink)) {
      setBookFormError("Please provide a valid image link.");
      return;
    }

    setBookFormError("");

    try {
      const response = await fetch("/api/profile/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "book",
          name: trimmedBookName,
          category: trimmedBookCategory,
          mrp: parsedMrp.toFixed(2),
          imageUrl: trimmedBookImageLink || "/books.png",
          url: trimmedBookLink,
          source: "amazon",
          fileName: "Amazon Link",
          sizeLabel: "External",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { book?: AddedBook; message?: string };

      if (!response.ok || !payload.book) {
        setBookFormError(payload.message || "Unable to add Amazon book.");
        return;
      }

      setAddedBooks((prev) => [payload.book as AddedBook, ...prev]);
    } catch {
      setBookFormError("Unable to add Amazon book.");
      return;
    }

    setBookNameInput("");
    setBookMrpInput("");
    setBookCategoryInput("");
    setBookImageFile(null);
    setPendingBookFiles([]);
    setBookImageLinkInput("");
    setBookLinkInput("");
    setIsBookFormOpen(false);
  };

  const getYouTubeEmbedUrl = (link: string) => {
    try {
      const parsed = new URL(link);
      if (parsed.hostname.includes("youtu.be")) {
        const id = parsed.pathname.replace("/", "").trim();
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (parsed.hostname.includes("youtube.com")) {
        const id = parsed.searchParams.get("v") || "";
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      return null;
    } catch {
      return null;
    }
  };

  const handleVideoSave = async () => {
    const files = pendingVideoFiles;
    if (files.length === 0 && !youtubeLinkInput.trim()) {
      setYoutubeLinkError("Please select video files or provide a YouTube link before saving.");
      return;
    }

    if (files.length === 0 && youtubeLinkInput.trim()) {
      await handleYouTubeAdd();
      return;
    }

    if (files.length === 0) {
      return;
    }

    const trimmedVideoMrp = videoMrpInput.trim();
    if (!trimmedVideoMrp) {
      setYoutubeLinkError("Please enter a video MRP.");
      return;
    }

    const localVideos = files.map((file, index) => ({
      id: `video-${Date.now()}-${index}`,
      name: file.name,
      mrp: trimmedVideoMrp,
      sizeLabel: formatFileSize(file.size),
      url: URL.createObjectURL(file),
      level: videoLevelInput.trim(),
      source: "file" as const,
      isPopular: false,
    }));

    setAddedVideos((prev) => [...localVideos, ...prev]);

    try {
      const persisted = await Promise.all(
        files.map(async (file) => {
          const response = await fetch("/api/profile/library", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "video",
              name: file.name,
              mrp: trimmedVideoMrp,
              url: "",
              source: "file",
              sizeLabel: formatFileSize(file.size),
              level: videoLevelInput.trim(),
            }),
          });

          const payload = (await response.json().catch(() => ({}))) as { video?: AddedVideo };
          return payload.video;
        }),
      );

      const validPersisted = persisted.filter((video): video is AddedVideo => Boolean(video));
      if (validPersisted.length > 0) {
        setAddedVideos((current) => {
          const withoutTemp = current.filter((video) => !localVideos.some((tempVideo) => tempVideo.id === video.id));
          return [...validPersisted, ...withoutTemp];
        });
      }
    } catch {
      // keep local preview entries even if persistence fails
    }

    setPendingVideoFiles([]);
    setVideoMrpInput("");
    setIsVideoFormOpen(false);
  };

  const handleYouTubeAdd = async () => {
    const trimmedLink = youtubeLinkInput.trim();
    const trimmedMrp = videoMrpInput.trim();
    if (!trimmedLink) {
      setYoutubeLinkError("Please enter a YouTube link.");
      return;
    }

    if (!trimmedMrp) {
      setYoutubeLinkError("Please enter a video MRP.");
      return;
    }

    const embedUrl = getYouTubeEmbedUrl(trimmedLink);
    if (!embedUrl) {
      setYoutubeLinkError("Please enter a valid YouTube URL.");
      return;
    }

    try {
      const response = await fetch("/api/profile/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "video",
          name: "YouTube Video",
          mrp: trimmedMrp,
          sizeLabel: "YouTube Link",
          url: embedUrl,
          source: "youtube",
          level: videoLevelInput.trim(),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { video?: AddedVideo; message?: string };

      if (!response.ok || !payload.video) {
        setYoutubeLinkError(payload.message || "Unable to add YouTube video.");
        return;
      }

      setYoutubeLinkError("");
      setAddedVideos((prev) => [payload.video as AddedVideo, ...prev]);
      setYoutubeLinkInput("");
      setVideoMrpInput("");
      setPendingVideoFiles([]);
      setEditingVideoId(null);
      setIsVideoFormOpen(false);
    } catch {
      setYoutubeLinkError("Unable to add YouTube video.");
    }
  };

  const handleDeleteBook = async (_bookId: string) => {
    setBookFormError("Books are permanently saved and cannot be deleted.");
  };

  const handleDeleteVideo = async (videoId: string) => {
    setAddedVideos((currentVideos) => {
      const videoToRemove = currentVideos.find((video) => video.id === videoId);
      if (videoToRemove?.source === "file" && videoToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(videoToRemove.url);
      }

      return currentVideos.filter((video) => video.id !== videoId);
    });

    await fetch("/api/profile/library", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "video", id: videoId }),
    }).catch(() => undefined);
  };

  const handleToggleLikeBook = (bookId: string) => {
    setLikedBookIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleToggleLikeVideo = (videoId: string) => {
    setLikedVideoIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleEditBook = (book: AddedBook) => {
    setBookNameInput(book.name);
    setBookMrpInput(book.mrp);
    setBookCategoryInput(book.category);
    setBookLinkInput(book.url);
    setEditingBookId(book.id);
    setIsBookFormOpen(true);
  };

  const handleEditVideo = (video: AddedVideo) => {
    setBookNameInput(video.name);
    setVideoMrpInput(video.mrp);
    setYoutubeLinkInput(video.url);
    setEditingVideoId(video.id);
    setIsVideoFormOpen(true);
  };

  const handleDeleteBookWithConfirm = async (bookId: string) => {
    if (confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      setAddedBooks((prev) => prev.filter((book) => book.id !== bookId));
      await fetch("/api/profile/library", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "book", id: bookId }),
      }).catch(() => undefined);
    }
  };

  const handleDeleteVideoWithConfirm = async (videoId: string) => {
    if (confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      await handleDeleteVideo(videoId);
    }
  };

  const searchableItems = useMemo<SearchResultItem[]>(() => {
    const profileReviews = profileReviewsText
      .split("\n")
      .map((review) => review.trim())
      .filter(Boolean)
      .join(" • ");

    return [
      ...overviewCards.map((card) => ({
        id: `overview-${card.title}`,
        title: card.title,
        description: card.description,
        section: "overview" as const,
      })),
      ...coursePageOne.map((course, index) => ({
        id: `course-1-${index}`,
        title: course.title,
        description: `${course.tag} • ${course.academy} • ${course.lessons}`,
        section: "overview" as const,
        featuredTargetPage: 1 as const,
      })),
      ...coursePageTwo.map((course, index) => ({
        id: `course-2-${index}`,
        title: course.title,
        description: `${course.tag} • ${course.academy}`,
        section: "overview" as const,
        featuredTargetPage: 2 as const,
        openUrl: `https://www.youtube.com/watch?v=${course.youtubeId}`,
      })),
      ...coursePageThree.map((course, index) => ({
        id: `course-3-${index}`,
        title: course.title,
        description: `${course.tag} • ${course.academy} • ${course.lessons}`,
        section: "overview" as const,
        featuredTargetPage: 3 as const,
      })),
      ...addedBooks.map((book) => ({
        id: book.id,
        title: book.name,
        description: `${book.category} • MRP ₹${book.mrp} • ${book.source === "amazon" ? "Amazon link" : book.fileName}`,
        section: "add" as const,
        addTab: "books" as const,
        openUrl: book.url,
      })),
      ...addedVideos.map((video) => ({
        id: video.id,
        title: video.name,
        description: `${video.source === "youtube" ? "YouTube" : "Video File"} • ${video.sizeLabel}`,
        section: "add" as const,
        addTab: "videos" as const,
        openUrl: video.url,
      })),
      {
        id: "profile-overview",
        title: profileName || "Professional Profile",
        description: `${profileEmail} • ${profileSpecialization || "No specialization"} • ${profileContactNumber || "No contact"}`,
        section: "settings" as const,
      },
      {
        id: "profile-location",
        title: "Location",
        description: profileLocation || "No location set",
        section: "settings" as const,
      },
      {
        id: "profile-reviews",
        title: "Reviews",
        description: profileReviews || "No reviews added",
        section: "settings" as const,
      },
      {
        id: "upgrade-profile",
        title: "Upgrade Profile",
        description: "Pay to rank higher than other professionals.",
        section: "upgrade" as const,
      },
    ];
  }, [
    addedBooks,
    addedVideos,
    profileContactNumber,
    profileEmail,
    profileLocation,
    profileName,
    profileReviewsText,
    profileSpecialization,
  ]);

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return searchableItems.filter((item) => {
      const searchableText = `${item.title} ${item.description}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [searchQuery, searchableItems]);

  const handleSearchResultClick = (result: SearchResultItem) => {
    if (result.openUrl) {
      window.open(result.openUrl, "_blank", "noopener,noreferrer");
    }

    setActiveSection(result.section);

    if (result.section === "add" && result.addTab) {
      setAddContentTab(result.addTab);
    }

    if (result.section === "overview" && result.featuredTargetPage) {
      setFeaturedPage(result.featuredTargetPage);
    }

    setSearchQuery("");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-[#eef5f3]">
      <div className="grid h-full w-full grid-cols-1 overflow-hidden bg-[#eef5f3] shadow-[20px_20px_40px_#d0dbd6,-20px_-20px_40px_#ffffff] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="flex flex-col border-b border-slate-200/70 bg-[#eef5f3] px-5 py-6 lg:sticky lg:top-0 lg:h-full lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 px-2 pb-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1ec28e]/10 text-[#1ec28e]">
              <div className="h-5 w-5 rounded-full border-4 border-current border-r-transparent" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">LearnFlow</h1>
              <p className="text-xs text-slate-500">Professional dashboard</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#eef5f3] p-4 shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]">
            <div className="flex items-center gap-3">
              <Image src={avatarSrc} alt="Profile" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{profileName || "Professional User"}</p>
                <p className="truncate text-xs text-slate-500">@{(profileEmail || "professional").split("@")[0]}</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex-1 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.section ? activeSection === item.section : false;

              const sharedClassName = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-[#2d6a4f] text-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]"
                  : "bg-[#eef5f3] text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner"
              }`;

              return (
                item.href ? (
                  <Link key={item.label} href={item.href} className={sharedClassName}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ) : (
                  <button key={item.label} onClick={() => setActiveSection(item.section ?? "overview")} className={sharedClassName}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              );
            })}
          </nav>

          <button
            onClick={async () => {
              if (user.role === "professional") {
                await fetch("/api/professionals/session", { method: "DELETE" }).catch(() => undefined);
              }
              await signOut({ callbackUrl: "/" });
            }}
            className="mt-6 flex items-center gap-3 rounded-xl bg-[#eef5f3] px-4 py-3 text-sm font-medium text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] transition hover:shadow-inner"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </aside>

    <section className="h-full overflow-y-auto bg-[#eef5f3] px-3 py-4 md:px-4 lg:px-5">
      <div className="flex flex-col gap-4 rounded-[24px] bg-[#eef5f3] px-5 py-4 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff] md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Welcome!</h2>
              <p className="text-sm text-slate-500">Welcome back, it’s explore now!</p>
            </div>

            <div className="flex w-full max-w-3xl items-center gap-3 md:w-auto md:flex-1 md:justify-end">
              <div className="flex h-12 flex-1 items-center gap-3 rounded-full border-none bg-[#f6fefb] px-4 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff] md:max-w-xl">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                className="grid h-11 w-11 place-items-center rounded-full border-none bg-[#f6fefb] text-[#1ec28e] shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]"
                onClick={() => setIsNotificationOpen(true)}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
                    {/* Notification Modal */}
                    {isNotificationOpen && (
                      <NotificationModal
                        isOpen={isNotificationOpen}
                        onClose={() => setIsNotificationOpen(false)}
                        notifications={notificationFollowers}
                        section2={notificationBooksVideos}
                        section3={notificationPurchases}
                      />
                    )}
              <button
                className="grid h-11 w-11 place-items-center rounded-full border-none bg-[#f6fefb] text-[#1ec28e] shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]"
                onClick={() => setIsCalendarOpen(true)}
                aria-label="Open calendar"
              >
                <CalendarIcon className="h-4 w-4" />
              </button>
                  {/* Calendar Modal */}
                  {isCalendarOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all">
                      <div className="bg-gradient-to-br from-[#f6fefb] to-[#e0f7ef] rounded-3xl shadow-2xl px-0 py-0 w-full max-w-md relative border border-[#d1f5e0]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0f7ef] bg-white rounded-t-3xl">
                          <div className="text-xl font-bold text-[#1ec28e] tracking-wide">Calendar</div>
                          <button
                            className="text-3xl text-gray-400 hover:text-[#1ec28e] transition-colors"
                            onClick={() => setIsCalendarOpen(false)}
                            aria-label="Close calendar"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex justify-center items-center p-6">
                          {typeof window !== 'undefined' && require('./FullCalendarModalContent').default && React.createElement(require('./FullCalendarModalContent').default)}
                        </div>
                      </div>
                    </div>
                  )}
            </div>
          </div>

          {searchQuery.trim() ? (
            <div className="mt-6 rounded-[24px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Search Results</h3>
                  <p className="text-sm text-slate-500">
                    {searchResults.length} result{searchResults.length === 1 ? "" : "s"} found for “{searchQuery.trim()}”.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full bg-[#effaf6] px-4 py-2 text-xs font-semibold text-[#1ec28e] transition hover:bg-[#dff5eb]"
                >
                  Clear Search
                </button>
              </div>

              {searchResults.length === 0 ? (
                <p className="rounded-2xl bg-[#f7faf8] px-4 py-3 text-sm text-slate-500">No matching results found.</p>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full rounded-2xl border border-slate-100 bg-[#f7faf8] p-4 text-left transition hover:border-[#1ec28e]/40 hover:bg-[#f2fbf7]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{result.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{result.description}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1ec28e]">
                          {result.section}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : activeSection === "add" ? (
            <div className="mt-6 space-y-6">
              <div className="rounded-[24px] bg-white p-3 shadow-sm">
                <div className="flex w-full max-w-sm items-center gap-2 rounded-2xl bg-[#f7faf8] p-1">
                  <button
                    type="button"
                    onClick={() => setAddContentTab("books")}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                      addContentTab === "books" ? "bg-[#1ec28e] text-white" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Books
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddContentTab("videos")}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                      addContentTab === "videos" ? "bg-[#1ec28e] text-white" : "text-slate-600 hover:bg-white"
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
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                      >
                        {isBookFormOpen ? "Close" : "Add+"}
                      </button>
                    </div>
                  </div>

                  {isBookFormOpen ? (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
                      <div className="w-full max-w-xl rounded-[12px] bg-white shadow-2xl flex flex-col max-h-[90vh]">
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
                                <option value="Technology">Technology</option>
                                <option value="Business">Business</option>
                                <option value="Design">Design</option>
                                <option value="Education">Education</option>
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
                            onClick={() => setIsBookFormOpen(false)}
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
                                  <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
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
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                      >
                        {isVideoFormOpen ? "Close" : "Add+"}
                      </button>
                    </div>
                  </div>

                  {isVideoFormOpen ? (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
                      <div className="w-full max-w-xl rounded-[12px] bg-white shadow-2xl flex flex-col max-h-[90vh]">
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
                                <option value="Technology">Technology</option>
                                <option value="Business">Business</option>
                                <option value="Design">Design</option>
                                <option value="Education">Education</option>
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
                            onClick={() => setIsVideoFormOpen(false)}
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
                                  <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
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
          ) : activeSection === "upgrade" ? (
            <div className="mt-6 space-y-6">
              <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <form onSubmit={handleUpgradeSubmit} className="rounded-[24px] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Upgrade Profile</h3>
                    <p className="text-sm text-slate-500">Pay with Razorpay to rank higher than other professionals.</p>
                  </div>
                  <CreditCard className="h-5 w-5 text-[#1ec28e]" />
                </div>

                <div className="mt-6 rounded-2xl bg-[#f7faf8] p-4">
                  <p className="text-sm font-semibold text-slate-900">Selected plan</p>
                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {upgradePlans.find((plan) => plan.key === upgradePlan)?.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {upgradePlans.find((plan) => plan.key === upgradePlan)?.duration}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-[#1ec28e]">
                      {upgradePlans.find((plan) => plan.key === upgradePlan)?.price}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Cardholder name
                    <input
                      type="text"
                      placeholder="Name on card"
                      className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Card number"
                    className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Razorpay payment</p>
                  <p className="mt-1 text-xs text-slate-500">Open payment link, complete payment, then confirm below.</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenRazorpay}
                      className="inline-flex h-10 items-center rounded-full bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                    >
                      Pay Now
                    </button>
                    <a
                      href={RAZORPAY_PAYMENT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
                    >
                      {RAZORPAY_PAYMENT_LINK}
                    </a>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#f7faf8] p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">What you get</p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Higher ranking in professional listings</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Boost badge on your profile</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Priority visibility for clients</li>
                  </ul>
                </div>

                {profileError && (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</div>
                )}

                {profileMessage && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {profileMessage}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={processingUpgrade}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-[#1ec28e] bg-white px-5 text-sm font-medium text-[#1ec28e] transition hover:bg-[#effaf6] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <CreditCard className="h-4 w-4" />
                    {processingUpgrade ? "Confirming..." : "Confirm Payment"}
                  </button>
                  <span className="text-xs text-slate-500">{hasOpenedRazorpay ? "Payment link opened. After payment, click Confirm Payment." : "Open Razorpay link first."}</span>
                </div>
              </form>

              <aside className="rounded-[24px] bg-white p-6 shadow-sm">
                <h4 className="text-base font-semibold text-slate-900">Upgrade summary</h4>
                <p className="mt-2 text-sm text-slate-500">Your profile is currently visible as a standard professional profile.</p>

                <div className="mt-5 grid gap-3">
                  {upgradePlans.map((plan) => {
                    const isSelected = upgradePlan === plan.key;

                    return (
                      <button
                        key={plan.key}
                        type="button"
                        onClick={() => {
                          setUpgradePlan(plan.key);
                          setHasOpenedRazorpay(false);
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-[#1ec28e] bg-[#effaf6]"
                            : "border-slate-200 bg-white hover:border-[#1ec28e]/40 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-slate-900">{plan.name}</p>
                            <p className="text-sm text-slate-500">{plan.duration}</p>
                          </div>
                          <p className="text-lg font-semibold text-[#1ec28e]">{plan.price}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-[#f7faf8] p-4">
                  <p className="text-sm font-semibold text-slate-900">Boost status</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {profileBoostedUntil ? `Active until ${new Date(profileBoostedUntil).toLocaleDateString()}` : "Not upgraded yet"}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-[#effaf6] p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Ranking benefit</p>
                  <p className="mt-2">Upgraded profiles appear higher than standard professionals in search and discovery lists.</p>
                </div>
                </aside>
              </div>

              {profileBoostedUntil ? (
                <div className="rounded-[24px] bg-white p-6 shadow-sm">
                  <h4 className="text-base font-semibold text-slate-900">Upgrade timeline</h4>
                  <p className="mt-1 text-sm text-slate-500">Live remaining duration for your active profile boost.</p>
                  <UpgradeTimeline boostedUntil={profileBoostedUntil} />
                </div>
              ) : null}
              </div>
          ) : activeSection === "settings" ? (
            <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="rounded-[24px] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src={avatarSrc}
                    alt="Profile preview"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-3xl border border-slate-100 object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Profile Photo</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">Update your public image</p>
                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#1ec28e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#18ab7d]">
                      <Upload className="h-4 w-4" />
                      Choose photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#f7faf8] p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Certificates</p>
                  <p className="mt-1">Upload certificates, awards, or proof documents.</p>
                </div>

                <label className="mt-4 block space-y-2 text-sm font-medium text-slate-700">
                  Add certificates
                  <div className="flex min-h-14 items-center gap-3 rounded-full border border-dashed border-slate-300 px-4 text-sm text-slate-500">
                    <Upload className="h-4 w-4 text-slate-400" />
                    <span>{certificateUploads.length > 0 ? `${certificateUploads.length} file(s) selected` : "Choose one or more files"}</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={(event) => setCertificateUploads(Array.from(event.target.files ?? []))}
                  />
                </label>

                {certificateList.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Saved certificates</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {certificateList.map((certificate) => (
                        <a
                          key={certificate}
                          href={certificate}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#f7faf8] px-3 py-1 text-xs text-slate-600 transition hover:bg-[#eaf7f1] hover:text-[#1ec28e]"
                        >
                          {certificate.split("/").pop()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleProfileSave} className="rounded-[24px] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Edit Profile</h3>
                    <p className="text-sm text-slate-500">Update your profile information and details.</p>
                  </div>
                  <Settings className="h-5 w-5 text-[#1ec28e]" />
                </div>

                {/* First Name + Last Name */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    First Name
                    <input
                      type="text"
                      value={profileFirstName}
                      onChange={(event) => setProfileFirstName(event.target.value)}
                      placeholder="Enter first name"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Last Name
                    <input
                      type="text"
                      value={profileLastName}
                      onChange={(event) => setProfileLastName(event.target.value)}
                      placeholder="Enter last name"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>
                </div>

                {/* Email + Phone */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Email Address
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(event) => setProfileEmail(event.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Phone Number
                    <input
                      type="tel"
                      value={profileContactNumber}
                      onChange={(event) => setProfileContactNumber(event.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>
                </div>

                {/* Address */}
                <div className="mt-4">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Address
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(event) => setProfileAddress(event.target.value)}
                      placeholder="Enter your address"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>
                </div>

                {/* City + Postal Code + Country */}
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    City
                    <input
                      type="text"
                      value={profileCity}
                      onChange={(event) => setProfileCity(event.target.value)}
                      placeholder="Enter city"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Postal Code
                    <input
                      type="text"
                      value={profilePostalCode}
                      onChange={(event) => setProfilePostalCode(event.target.value)}
                      placeholder="Enter postal code"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Country
                    <input
                      type="text"
                      value={profileCountry}
                      onChange={(event) => setProfileCountry(event.target.value)}
                      placeholder="Enter country"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>
                </div>

                {/* Social Links - Row 1 */}
                <div className="mt-4">
                  <p className="mb-3 text-sm font-medium text-slate-700">Social Links</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-slate-700">
                      Facebook
                      <input
                        type="url"
                        value={profileFacebook}
                        onChange={(event) => setProfileFacebook(event.target.value)}
                        placeholder="https://facebook.com/username"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                      />
                    </label>

                    <label className="space-y-2 text-sm font-medium text-slate-700">
                      Google
                      <input
                        type="url"
                        value={profileGoogle}
                        onChange={(event) => setProfileGoogle(event.target.value)}
                        placeholder="https://google.com/username"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                      />
                    </label>
                  </div>
                </div>

                {/* Social Links - Row 2 */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Twitter
                    <input
                      type="url"
                      value={profileTwitter}
                      onChange={(event) => setProfileTwitter(event.target.value)}
                      placeholder="https://twitter.com/username"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Pinterest
                    <input
                      type="url"
                      value={profilePinterest}
                      onChange={(event) => setProfilePinterest(event.target.value)}
                      placeholder="https://pinterest.com/username"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>
                </div>

                {/* About Me */}
                <div className="mt-4">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    About Me
                    <textarea
                      value={profileAboutMe}
                      onChange={(event) => setProfileAboutMe(event.target.value)}
                      placeholder="Tell us about yourself, your experience, and expertise..."
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>
                </div>

                {/* Specialization and Location (kept for backward compatibility) */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Specialization
                    <input
                      type="text"
                      value={profileSpecialization}
                      onChange={(event) => setProfileSpecialization(event.target.value)}
                      placeholder="e.g. UI/UX Design"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Location
                    <input
                      type="text"
                      value={profileLocation}
                      onChange={(event) => setProfileLocation(event.target.value)}
                      placeholder="Enter your city or address"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                  </label>
                </div>

                {profileError && (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</div>
                )}

                {profileMessage && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {profileMessage}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1ec28e] px-5 text-sm font-medium text-white transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    {savingProfile ? "Saving..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="mt-6 rounded-[24px] bg-white p-5 shadow-sm md:p-6">
                <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
                  <div className="flex justify-center lg:justify-start">
                    <Image
                      src={avatarSrc}
                      alt="Professional profile"
                      width={92}
                      height={92}
                      className="h-20 w-20 rounded-3xl border border-slate-100 object-cover"
                    />
                  </div>

                  <div className="text-center lg:text-left">
                    <p className="text-sm font-medium text-[#1ec28e]">Professional Profile</p>
                    <h3 className="mt-1 text-2xl font-semibold text-slate-900">{profileName || "Professional User"}</h3>

                    {(profileSpecialization || profileContactNumber) && (
                      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs lg:justify-start">
                        {profileSpecialization ? (
                          <span className="rounded-full bg-[#f7faf8] px-3 py-1 text-slate-600">{profileSpecialization}</span>
                        ) : null}
                        {profileContactNumber ? (
                          <span className="rounded-full bg-[#f7faf8] px-3 py-1 text-slate-600">{profileContactNumber}</span>
                        ) : null}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 lg:justify-start">
                      <span className="rounded-full bg-[#effaf6] px-3 py-1 text-[#1ec28e]">Professional</span>
                      {certificateList.length > 0 ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1">{certificateList.length} Certificates</span>
                      ) : null}
                      {profileBoostedUntil ? (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Boost active</span>
                      ) : null}
                    </div>

                    {profileLocation ? (
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#1ec28e] transition hover:text-[#18ab7d]"
                      >
                        {profileLocation}
                      </a>
                    ) : null}
                  </div>

                  <div className="flex items-start justify-center lg:justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveSection("settings")}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1ec28e] px-5 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                    >
                      <Settings className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>

                {certificateList.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {certificateList.slice(0, 4).map((certificate) => (
                      <a
                        key={certificate}
                        href={certificate}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#f7faf8] px-3 py-1 text-xs text-slate-600 transition hover:bg-[#eaf7f1] hover:text-[#1ec28e]"
                      >
                        {certificate.split("/").pop()}
                      </a>
                    ))}
                    {certificateList.length > 4 && (
                      <span className="rounded-full bg-[#f7faf8] px-3 py-1 text-xs text-slate-600">
                        +{certificateList.length - 4} more
                      </span>
                    )}
                  </div>
                )}

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div key={card.title} className="rounded-[24px] bg-white p-5 shadow-sm">
                      <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${card.iconBg}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mt-4 text-center text-base font-semibold text-slate-900">{card.title}</h3>
                      <p className="mt-2 text-center text-sm text-slate-500">{card.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-900">Featured Course</h3>
                    <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm">
                      {[1, 2, 3].map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => setFeaturedPage(pageNumber as FeaturedPage)}
                          className={`min-w-10 rounded-full px-3 py-2 text-sm font-medium transition ${
                            featuredPage === pageNumber ? "bg-[#1ec28e] text-white" : "text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>
                  </div>

                  {featuredContent}
                </div>

                <aside className="rounded-[24px] bg-white p-4 shadow-sm">
                  {featuredPage === 2 ? (
                    <>
                      <div className="space-y-3">
                        <div className="relative overflow-hidden rounded-[18px] bg-slate-950">
                          <iframe
                            className="aspect-video w-full"
                            src={`https://www.youtube.com/embed/${detailVideos[0].youtubeId}`}
                            title={detailVideos[0].title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>

                        <div className="relative overflow-hidden rounded-[18px] bg-slate-950">
                          <iframe
                            className="aspect-video w-full"
                            src={`https://www.youtube.com/embed/${detailVideos[1].youtubeId}`}
                            title={detailVideos[1].title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
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
          )}
        </section>
      </div>
    </main>
  );
}