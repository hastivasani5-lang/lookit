"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
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
import DashboardOverviewSection from "@/components/dashboard/DashboardOverviewSection";
import DashboardAddSection from "@/components/dashboard/DashboardAddSection";
import DashboardUpgradeSection from "@/components/dashboard/DashboardUpgradeSection";
import DashboardSettingsSection from "@/components/dashboard/DashboardSettingsSection";

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

export type DashboardSection = "overview" | "add" | "upgrade" | "settings";
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
   { label: "Settings", icon: Settings, section: "settings" },
];

const overviewCards = [
  {
    title: "Business Analytics",
    description: "Invest in your future with our business analysis course",
    icon: LayoutGrid,
    iconBg: "bg-[#eef5ff] text-[#5067d9]",
  },
  {
    title: "Design",
    description: "Invest in your future with our design strategy course",
    icon: BookOpen,
    iconBg: "bg-[#effaf6] text-[#1ec28e]",
  },
  {
    title: "Currency",
    description: "Invest in your future with our finance and currency course",
    icon: CreditCard,
    iconBg: "bg-[#f0f7ff] text-[#5067d9]",
  },
  {
    title: "Sale Marketing",
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
  const [hasOpenedRazorpay, setHasOpenedRazorpay] = useState(false);
  const [likedBookIds, setLikedBookIds] = useState<Set<string>>(new Set());
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set());
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const section = searchParams?.get("section");
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
    if (featuredPage === 2) {
      return (
        <div className="grid gap-4 lg:grid-cols-3">
          {coursePageTwo.map((video, index) => (
            <article key={`${video.title}-${index}`} className="overflow-hidden rounded-[22px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="relative aspect-video bg-slate-950">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="space-y-3 p-4">
                <span className="inline-flex rounded-full bg-[#1ec28e]/10 px-3 py-1 text-xs font-medium text-[#1ec28e]">
                  {video.tag}
                </span>
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
                <Image src={course.image} alt={course.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw" className="object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-[#1ec28e] px-3 py-1 text-xs font-medium text-white">
                  {course.tag}
                </div>
                <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#1ec28e] shadow-sm">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4 p-4">
                <h4 className="text-sm font-semibold leading-5 text-slate-900">{course.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{course.academy}</span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    4.8
                  </span>
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
              <Image src={course.image} alt={course.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw" className="object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-[#1ec28e] px-3 py-1 text-xs font-medium text-white">
                {course.tag}
              </div>
              <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#1ec28e] shadow-sm">
                <Heart className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <h4 className="text-sm font-semibold leading-5 text-slate-900">{course.title}</h4>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{course.academy}</span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  4.5
                </span>
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
          <p className="text-sm text-slate-500">Welcome back, explore now!</p>
        </div>
        <div className="flex w-full max-w-3xl items-center gap-3 md:w-auto md:flex-1 md:justify-end">
          <div className="flex h-12 flex-1 items-center gap-3 rounded-full border-none bg-[#f6fefb] px-4 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff] md:max-w-xl">
            <Search className="h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search here" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-full border-none bg-[#f6fefb] text-[#1ec28e] shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {searchQuery.trim() ? (
        <div className="mt-6 rounded-[24px] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Search Results</h3>
              <p className="text-sm text-slate-500">{searchResults.length} result{searchResults.length === 1 ? "" : "s"} found for &quot;{searchQuery.trim()}&quot;.</p>
            </div>
            <button type="button" onClick={() => setSearchQuery("")} className="rounded-full bg-[#effaf6] px-4 py-2 text-xs font-semibold text-[#1ec28e] transition hover:bg-[#dff5eb]">Clear Search</button>
          </div>
          {searchResults.length === 0 ? (
            <p className="rounded-2xl bg-[#f7faf8] px-4 py-3 text-sm text-slate-500">No matching results found.</p>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result) => (
                <button key={result.id} type="button" onClick={() => handleSearchResultClick(result)} className="w-full rounded-2xl border border-slate-100 bg-[#f7faf8] p-4 text-left transition hover:border-[#1ec28e]/40 hover:bg-[#f2fbf7]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{result.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{result.description}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1ec28e]">{result.section}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : activeSection === "add" ? (
        <DashboardAddSection
          userName={user.name}
          addContentTab={addContentTab} setAddContentTab={setAddContentTab}
          isBookFormOpen={isBookFormOpen} setIsBookFormOpen={setIsBookFormOpen}
          isVideoFormOpen={isVideoFormOpen} setIsVideoFormOpen={setIsVideoFormOpen}
          bookNameInput={bookNameInput} setBookNameInput={setBookNameInput}
          bookMrpInput={bookMrpInput} setBookMrpInput={setBookMrpInput}
          bookCategoryInput={bookCategoryInput} setBookCategoryInput={setBookCategoryInput}
          bookInstructorInput={bookInstructorInput} setBookInstructorInput={setBookInstructorInput}
          bookModeInput={bookModeInput} setBookModeInput={setBookModeInput}
          bookDescriptionInput={bookDescriptionInput} setBookDescriptionInput={setBookDescriptionInput}
          bookTypeInput={bookTypeInput} setBookTypeInput={setBookTypeInput}
          bookLevelInput={bookLevelInput} setBookLevelInput={setBookLevelInput}
          bookCoursePackageInput={bookCoursePackageInput} setBookCoursePackageInput={setBookCoursePackageInput}
          bookImageFile={bookImageFile} setBookImageFile={setBookImageFile}
          bookLinkInput={bookLinkInput} setBookLinkInput={setBookLinkInput}
          pendingBookFiles={pendingBookFiles} setPendingBookFiles={setPendingBookFiles}
          bookFormError={bookFormError}
          handleBookSave={handleBookSave}
          youtubeLinkInput={youtubeLinkInput} setYoutubeLinkInput={setYoutubeLinkInput}
          videoMrpInput={videoMrpInput} setVideoMrpInput={setVideoMrpInput}
          videoInstructorInput={videoInstructorInput} setVideoInstructorInput={setVideoInstructorInput}
          videoModeInput={videoModeInput} setVideoModeInput={setVideoModeInput}
          videoDescriptionInput={videoDescriptionInput} setVideoDescriptionInput={setVideoDescriptionInput}
          videoTypeInput={videoTypeInput} setVideoTypeInput={setVideoTypeInput}
          videoLevelInput={videoLevelInput} setVideoLevelInput={setVideoLevelInput}
          videoCoursePackageInput={videoCoursePackageInput} setVideoCoursePackageInput={setVideoCoursePackageInput}
          pendingVideoFiles={pendingVideoFiles} setPendingVideoFiles={setPendingVideoFiles}
          youtubeLinkError={youtubeLinkError}
          handleVideoSave={handleVideoSave}
          addedBooks={addedBooks} addedVideos={addedVideos}
          likedBookIds={likedBookIds} likedVideoIds={likedVideoIds}
          handleToggleLikeBook={handleToggleLikeBook} handleToggleLikeVideo={handleToggleLikeVideo}
          handleEditBook={handleEditBook} handleEditVideo={handleEditVideo}
          handleDeleteBookWithConfirm={handleDeleteBookWithConfirm}
          handleDeleteVideoWithConfirm={handleDeleteVideoWithConfirm}
        />
      ) : activeSection === "upgrade" ? (
        <DashboardUpgradeSection
          upgradePlan={upgradePlan} setUpgradePlan={setUpgradePlan}
          profileBoostedUntil={profileBoostedUntil}
          profileError={profileError} profileMessage={profileMessage}
          processingUpgrade={processingUpgrade}
          hasOpenedRazorpay={hasOpenedRazorpay}
          handleOpenRazorpay={handleOpenRazorpay}
          handleUpgradeSubmit={handleUpgradeSubmit}
          setHasOpenedRazorpay={setHasOpenedRazorpay}
        />
      ) : activeSection === "settings" ? (
        <DashboardSettingsSection
          avatarSrc={avatarSrc}
          profileFirstName={profileFirstName} setProfileFirstName={setProfileFirstName}
          profileLastName={profileLastName} setProfileLastName={setProfileLastName}
          profileEmail={profileEmail} setProfileEmail={setProfileEmail}
          profileContactNumber={profileContactNumber} setProfileContactNumber={setProfileContactNumber}
          profileAddress={profileAddress} setProfileAddress={setProfileAddress}
          profileCity={profileCity} setProfileCity={setProfileCity}
          profilePostalCode={profilePostalCode} setProfilePostalCode={setProfilePostalCode}
          profileCountry={profileCountry} setProfileCountry={setProfileCountry}
          profileFacebook={profileFacebook} setProfileFacebook={setProfileFacebook}
          profileGoogle={profileGoogle} setProfileGoogle={setProfileGoogle}
          profileTwitter={profileTwitter} setProfileTwitter={setProfileTwitter}
          profilePinterest={profilePinterest} setProfilePinterest={setProfilePinterest}
          profileAboutMe={profileAboutMe} setProfileAboutMe={setProfileAboutMe}
          profileSpecialization={profileSpecialization} setProfileSpecialization={setProfileSpecialization}
          profileLocation={profileLocation} setProfileLocation={setProfileLocation}
          certificateUploads={certificateUploads} setCertificateUploads={setCertificateUploads}
          certificateList={certificateList}
          setPhotoFile={setPhotoFile}
          profileError={profileError} profileMessage={profileMessage}
          savingProfile={savingProfile}
          handleProfileSave={handleProfileSave}
        />
      ) : (
        <DashboardOverviewSection
          avatarSrc={avatarSrc}
          profileName={profileName}
          profileSpecialization={profileSpecialization}
          profileContactNumber={profileContactNumber}
          profileLocation={profileLocation}
          profileBoostedUntil={profileBoostedUntil}
          certificateList={certificateList}
          mapsHref={mapsHref}
          featuredPage={featuredPage}
          setFeaturedPage={setFeaturedPage}
          setActiveSection={setActiveSection}
        />
      )}
    </section>
      </div>
    </main>
  );
}
