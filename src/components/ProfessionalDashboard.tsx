"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  BookOpen,
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

// ── Sub-components ────────────────────────────────────────────────────────────
import AddSection from "@/components/professional/AddSection";
import MiniCalendar from "@/components/professional/MiniCalendar";
import NotificationDrawer from "@/components/professional/NotificationDrawer";
import OverviewSection from "@/components/professional/OverviewSection";
import SettingsSection from "@/components/professional/SettingsSection";
import UpgradeProgressChart from "@/components/professional/UpgradeProgressChart";
import UpgradeSection from "@/components/professional/UpgradeSection";
// import AutoPopupModal from "@/components/AutoPopupModal"; // Removed - only for students

// ── Types & static data ───────────────────────────────────────────────────────
import {
  type AddContentTab,
  type AddedBook,
  type AddedVideo,
  type DashboardSection,
  type FeaturedPage,
  type SearchResultItem,
  type UpgradePlanKey,
  coursePageOne,
  coursePageTwo,
  coursePageThree,
  detailVideos,
  overviewCards,
  sidebarItems,
  upgradePlans,
  RAZORPAY_PAYMENT_LINK,
} from "@/components/professional/DashboardTypes";

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

// ── Suppress unused-import warnings for static data used in sub-components ───
void overviewCards; void coursePageOne; void coursePageTwo; void coursePageThree; void detailVideos; void upgradePlans; void RAZORPAY_PAYMENT_LINK;

export default function ProfessionalDashboard({ user }: ProfessionalDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notification panel state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifFollows, setNotifFollows] = useState<Array<{ studentId: string; studentName?: string; followedAt: string }>>([]);
  const [notifPurchases, setNotifPurchases] = useState<Array<{ id: string; studentName: string; items?: Array<{ title: string; contentType: string }>; amount: string; paidAt: string; professionalId: string }>>([]);
  const [notifReviews, setNotifReviews] = useState<Array<{ id: string; studentName: string; rating: number; review: string; createdAt: string; professionalId: string }>>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto popup modal after 2 seconds - ONLY FOR STUDENTS, NOT FOR PROFESSIONALS
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Professionals should not see this modal - it's for students only
      // Remove or comment out this useEffect for professionals
      // const autoModalFlag = localStorage.getItem(`professional_auto_modal_shown_${user.id}`);
      // if (!autoModalFlag) {
      //   const timer = setTimeout(() => {
      //     setShowModal(true);
      //   }, 2000); // 2 seconds after login
      //   return () => clearTimeout(timer);
      // }
    }
  }, [user.id]);

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
    const allCourses = featuredPage === 2
      ? coursePageTwo.map((c) => ({ title: c.title, tag: c.tag, academy: c.academy, lessons: "Video", price: "$39.00", rating: "4.7" }))
      : featuredPage === 3
        ? coursePageThree.map((c) => ({ title: c.title, tag: c.tag, academy: c.academy, lessons: c.lessons, price: "$59.00", rating: "4.8" }))
        : coursePageOne.map((c) => ({ title: c.title, tag: c.tag, academy: c.academy, lessons: c.lessons, price: "$49.00", rating: "4.5" }));

    return (
      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white overflow-hidden">
        {allCourses.map((course, index) => (
          <div key={`${course.title}-${index}`} className="flex items-center gap-4 px-4 py-3 hover:bg-[#f6fefb] transition">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1ec28e]/10 text-[#1ec28e] text-sm font-bold">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{course.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{course.academy} · {course.lessons}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden rounded-full bg-[#1ec28e]/10 px-2.5 py-0.5 text-xs font-medium text-[#1ec28e] sm:inline">{course.tag}</span>
              <span className="flex items-center gap-1 text-xs text-amber-500">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {course.rating}
              </span>
              <span className="text-sm font-bold text-[#1ec28e]">{course.price}</span>
            </div>
          </div>
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

  // const handleCloseModal = () => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem(`professional_auto_modal_shown_${user.id}`, "1");
  //   }
  //   setShowModal(false);
  // };

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
    // ── EDIT MODE ──────────────────────────────────────────────────────────
    if (editingBookId) {
      const trimmedName = bookNameInput.trim();
      const trimmedMrp = bookTypeInput === "free" ? "0" : bookMrpInput.trim();
      const trimmedCategory = bookCategoryInput.trim();
      const trimmedUrl = bookLinkInput.trim();
      const parsedMrp = Number(trimmedMrp);

      if (!trimmedName || !trimmedCategory) {
        setBookFormError("Please enter book name and category before saving.");
        return;
      }
      if (bookTypeInput === "paid" && (!trimmedMrp || !Number.isFinite(parsedMrp) || parsedMrp <= 0)) {
        setBookFormError("Please enter a valid price amount.");
        return;
      }

      setBookFormError("");

      // Optimistically update local state
      setAddedBooks((prev) =>
        prev.map((book) =>
          book.id === editingBookId
            ? { ...book, name: trimmedName, mrp: parsedMrp.toFixed(2), category: trimmedCategory, url: trimmedUrl || book.url }
            : book
        )
      );

      try {
        await fetch(`/api/profile/library/books/${editingBookId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            category: trimmedCategory,
            mrp: parsedMrp.toFixed(2),
            url: trimmedUrl || undefined,
          }),
        });
      } catch {
        // local state already updated; silently ignore network errors
      }

      // Reset form
      setBookNameInput("");
      setBookMrpInput("");
      setBookCategoryInput("");
      setBookImageFile(null);
      setPendingBookFiles([]);
      setBookImageLinkInput("");
      setBookLinkInput("");
      setEditingBookId(null);
      setIsBookFormOpen(false);
      return;
    }

    // ── ADD MODE (original logic) ──────────────────────────────────────────
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
    const trimmedBookMrp = bookTypeInput === "free" ? "0" : bookMrpInput.trim();
    const trimmedBookCategory = bookCategoryInput.trim();
    const parsedMrp = Number(trimmedBookMrp);

    if (!trimmedBookName || !trimmedBookCategory) {
      setBookFormError("Please enter book name and category/type before uploading.");
      return;
    }
    if (bookTypeInput === "paid" && !trimmedBookMrp) {
      setBookFormError("Please enter a price for paid content.");
      return;
    }

    const trimmedBookImageLink = bookImageLinkInput.trim();
    let resolvedBookImageUrl = "";

    if (trimmedBookImageLink) {
      if (!parseHttpUrl(trimmedBookImageLink)) {
        setBookFormError("Please provide a valid image link.");
        return;
      }
      resolvedBookImageUrl = trimmedBookImageLink;
    } else {
      setBookFormError("Please provide a book image link (file upload is not supported on live).");
      return;
    }

    if (bookTypeInput === "paid" && (!Number.isFinite(parsedMrp) || parsedMrp <= 0)) {
      setBookFormError("Please enter a valid price amount.");
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
    const trimmedBookMrp = bookTypeInput === "free" ? "0" : bookMrpInput.trim();
    const trimmedBookCategory = bookCategoryInput.trim();
    const trimmedBookImageLink = bookImageLinkInput.trim();
    const trimmedBookLink = bookLinkInput.trim();
    const parsedMrp = Number(trimmedBookMrp);

    if (!trimmedBookName || !trimmedBookCategory || !trimmedBookLink) {
      setBookFormError("Please enter book name, category/type, and Amazon link.");
      return;
    }

    if (bookTypeInput === "paid" && (!trimmedBookMrp || !Number.isFinite(parsedMrp) || parsedMrp <= 0)) {
      setBookFormError("Please enter a valid price amount.");
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
    // ── EDIT MODE ──────────────────────────────────────────────────────────
    if (editingVideoId) {
      const trimmedName = bookNameInput.trim();
      const trimmedMrp = videoTypeInput === "free" ? "0" : videoMrpInput.trim();
      const trimmedUrl = youtubeLinkInput.trim();
      const parsedMrp = Number(trimmedMrp);

      if (!trimmedName) {
        setYoutubeLinkError("Please enter a video title before saving.");
        return;
      }
      if (videoTypeInput === "paid" && (!trimmedMrp || !Number.isFinite(parsedMrp) || parsedMrp <= 0)) {
        setYoutubeLinkError("Please enter a valid price amount.");
        return;
      }

      setYoutubeLinkError("");

      // Optimistically update local state
      setAddedVideos((prev) =>
        prev.map((video) =>
          video.id === editingVideoId
            ? { ...video, name: trimmedName, mrp: parsedMrp.toFixed(2), url: trimmedUrl || video.url }
            : video
        )
      );

      try {
        await fetch(`/api/profile/library/videos/${editingVideoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            mrp: parsedMrp.toFixed(2),
            url: trimmedUrl || undefined,
          }),
        });
      } catch {
        // local state already updated; silently ignore network errors
      }

      // Reset form
      setBookNameInput("");
      setVideoMrpInput("");
      setYoutubeLinkInput("");
      setPendingVideoFiles([]);
      setEditingVideoId(null);
      setIsVideoFormOpen(false);
      return;
    }

    // ── ADD MODE (original logic) ──────────────────────────────────────────
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

    const trimmedVideoMrp = videoTypeInput === "free" ? "0" : videoMrpInput.trim();
    if (videoTypeInput === "paid" && !trimmedVideoMrp) {
      setYoutubeLinkError("Please enter a price for paid content.");
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
    const trimmedMrp = videoTypeInput === "free" ? "0" : videoMrpInput.trim();
    if (!trimmedLink) {
      setYoutubeLinkError("Please enter a YouTube link.");
      return;
    }

    if (videoTypeInput === "paid" && !trimmedMrp) {
      setYoutubeLinkError("Please enter a price for paid content.");
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

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const [followsRes, purchasesRes, reviewsRes] = await Promise.all([
        fetch("/api/notifications/followers", { cache: "no-store" }),
        fetch("/api/notifications/purchases", { cache: "no-store" }),
        fetch("/api/profile/reviews", { cache: "no-store" }),
      ]);
      const followsData = followsRes.ok ? await followsRes.json() : { data: [] };
      const purchasesData = purchasesRes.ok ? await purchasesRes.json() : { data: [] };
      const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { reviews: [] };

      setNotifFollows(Array.isArray(followsData.data) ? followsData.data : []);
      // Filter purchases for this professional
      const allPurchases = Array.isArray(purchasesData.data) ? purchasesData.data : [];
      setNotifPurchases(allPurchases.filter((p: { professionalId?: string }) => !p.professionalId || p.professionalId === user.id));
      const allReviews = Array.isArray(reviewsData.reviews) ? reviewsData.reviews : [];
      setNotifReviews(allReviews.filter((r: { professionalId?: string }) => r.professionalId === user.id));
    } catch {
      // silently fail
    } finally {
      setNotifLoading(false);
    }
  };

  const handleBellClick = () => {
    setNotifOpen((prev) => {
      if (!prev) void fetchNotifications();
      return !prev;
    });
  };

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
    <div className="min-h-screen w-full bg-[#f0f4f8]">
      {/* AutoPopupModal removed for professionals - only for students */}
      {/* {showModal && <AutoPopupModal onClose={handleCloseModal} userId={user.id} />} */}

      {/* ── MOBILE TOPBAR ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/20 px-4 py-3 lg:hidden"
        style={{ background: "linear-gradient(135deg, #0d7a57 0%, #1ec28e 100%)" }}>
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-white">LearnFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleBellClick}
            className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-white">
            <Bell className="h-4 w-4" />
            {(notifFollows.length + notifPurchases.length + notifReviews.length) > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#1ec28e]">
                {Math.min(99, notifFollows.length + notifPurchases.length + notifReviews.length)}
              </span>
            )}
          </button>
          <button onClick={() => setSidebarOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-white" aria-label="Toggle menu">
            {sidebarOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto px-5 py-6 shadow-2xl"
            style={{ background: "linear-gradient(160deg, #0d7a57 0%, #15a374 40%, #1ec28e 100%)" }}>
            <div className="flex items-center justify-between pb-5">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-white">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">LearnFlow</p>
                  <p className="text-[10px] text-white/60">Professional Dashboard</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 border border-white/10">
              <div className="flex items-center gap-3">
                <Image src={avatarSrc} alt="Profile" width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-2 ring-white/40" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{profileName || "Professional"}</p>
                  <p className="truncate text-[11px] text-white/60">@{(profileEmail || "professional").split("@")[0]}</p>
                </div>
              </div>
            </div>
            <nav className="mt-5 flex-1 space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.section ? activeSection === item.section : false;
                const cls = `flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${isActive ? "bg-white text-[#1ec28e] shadow-lg" : "text-white/80 hover:bg-white/10 hover:text-white"}`;
                return item.href ? (
                  <Link key={item.label} href={item.href} className={cls} onClick={() => setSidebarOpen(false)}>
                    <Icon className="h-4 w-4 shrink-0" />{item.label}
                  </Link>
                ) : (
                  <button key={item.label} onClick={() => { setActiveSection(item.section ?? "overview"); setSidebarOpen(false); }} className={cls}>
                    <Icon className="h-4 w-4 shrink-0" />{item.label}
                  </button>
                );
              })}
            </nav>
            <button onClick={async () => {
              if (user.role === "professional") await fetch("/api/professionals/session", { method: "DELETE" }).catch(() => undefined);
              await signOut({ callbackUrl: "/" });
            }} className="mt-4 flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1ec28e] shadow-lg transition hover:bg-white/90">
              <LogOut className="h-4 w-4 shrink-0" />Log Out
            </button>
          </aside>
        </div>
      )}

      {/* ── DESKTOP + MOBILE LAYOUT ── */}
      <div className="flex lg:h-screen">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside
          className="hidden w-[260px] shrink-0 flex-col border-r border-white/10 px-5 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto"
          style={{ background: "linear-gradient(160deg, #0d7a57 0%, #15a374 40%, #1ec28e 100%)" }}
        >
          <div className="flex items-center gap-3 px-2 pb-7">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-wide text-white">LearnFlow</h1>
              <p className="text-[11px] text-white/60">Professional Dashboard</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image src={avatarSrc} alt="Profile" width={46} height={46} className="h-[46px] w-[46px] rounded-full object-cover ring-2 ring-white/40" />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#15a374] bg-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{profileName || "Professional User"}</p>
                <p className="truncate text-[11px] text-white/60">@{(profileEmail || "professional").split("@")[0]}</p>
              </div>
            </div>
          </div>
          <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.section
                ? activeSection === item.section
                : item.href ? (typeof window !== "undefined" && window.location.pathname === item.href) : false;
              const cls = `flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${isActive ? "bg-white text-[#1ec28e] shadow-lg" : "text-white/80 hover:bg-white/10 hover:text-white"}`;
              return item.href ? (
                <Link key={item.label} href={item.href} className={cls}><Icon className="h-4 w-4 shrink-0" />{item.label}</Link>
              ) : (
                <button key={item.label} onClick={() => setActiveSection(item.section ?? "overview")} className={cls}>
                  <Icon className="h-4 w-4 shrink-0" />{item.label}
                </button>
              );
            })}
          </nav>
          <button onClick={async () => {
            if (user.role === "professional") await fetch("/api/professionals/session", { method: "DELETE" }).catch(() => undefined);
            await signOut({ callbackUrl: "/" });
          }} className="mt-4 flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1ec28e] shadow-lg transition hover:bg-white/90">
            <LogOut className="h-4 w-4 shrink-0" />Log Out
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <section className="min-h-screen flex-1 overflow-y-auto bg-[#f0f4f8] lg:h-screen">
          <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 lg:px-7">

            {/* Desktop topbar */}
            <div className="mb-6 hidden items-center justify-between gap-4 lg:flex">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Welcome back, {profileName?.split(" ")[0] || "Professional"} 👋</h2>
                <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening with your profile today.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-64 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input type="text" placeholder="Search..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                </div>
                <div className="relative">
                  <button onClick={handleBellClick}
                    className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-[#1ec28e]">
                    <Bell className="h-4 w-4" />
                    {(notifFollows.length + notifPurchases.length + notifReviews.length) > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1ec28e] text-[10px] font-bold text-white">
                        {Math.min(99, notifFollows.length + notifPurchases.length + notifReviews.length)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile search + welcome */}
            <div className="mb-5 lg:hidden">
              <h2 className="mb-3 text-lg font-bold text-slate-800">Welcome back, {profileName?.split(" ")[0] || "Professional"} 👋</h2>
              <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input type="text" placeholder="Search..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
              </div>
            </div>

            {/* ── SECTIONS ── */}
            {searchQuery.trim() ? (
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Search Results</h3>
                    <p className="text-sm text-slate-500">{searchResults.length} result{searchResults.length === 1 ? "" : "s"} found for &quot;{searchQuery.trim()}&quot;.</p>
                  </div>
                  <button type="button" onClick={() => setSearchQuery("")}
                    className="rounded-xl bg-[#effaf6] px-4 py-2 text-xs font-semibold text-[#1ec28e] transition hover:bg-[#d8f5ec]">Clear</button>
                </div>
                {searchResults.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No results found.</p>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <button key={result.id} type="button" onClick={() => handleSearchResultClick(result)}
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:bg-[#effaf6]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{result.title}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{result.description}</p>
                          </div>
                          <span className="shrink-0 rounded-lg bg-[#effaf6] px-2 py-0.5 text-[11px] font-semibold text-[#1ec28e]">{result.section}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            ) : activeSection === "add" ? (
              <AddSection
                addContentTab={addContentTab} setAddContentTab={setAddContentTab}
                isBookFormOpen={isBookFormOpen} setIsBookFormOpen={setIsBookFormOpen}
                isVideoFormOpen={isVideoFormOpen} setIsVideoFormOpen={setIsVideoFormOpen}
                addedBooks={addedBooks} addedVideos={addedVideos}
                bookNameInput={bookNameInput} setBookNameInput={setBookNameInput}
                bookMrpInput={bookMrpInput} setBookMrpInput={setBookMrpInput}
                bookCategoryInput={bookCategoryInput} setBookCategoryInput={setBookCategoryInput}
                bookImageFile={bookImageFile} setBookImageFile={setBookImageFile}
                pendingBookFiles={pendingBookFiles} setPendingBookFiles={setPendingBookFiles}
                bookImageLinkInput={bookImageLinkInput} setBookImageLinkInput={setBookImageLinkInput}
                bookLinkInput={bookLinkInput} setBookLinkInput={setBookLinkInput}
                bookFormError={bookFormError}
                bookInstructorInput={bookInstructorInput} setBookInstructorInput={setBookInstructorInput}
                bookModeInput={bookModeInput} setBookModeInput={setBookModeInput}
                bookDescriptionInput={bookDescriptionInput} setBookDescriptionInput={setBookDescriptionInput}
                bookTypeInput={bookTypeInput} setBookTypeInput={setBookTypeInput}
                bookLevelInput={bookLevelInput} setBookLevelInput={setBookLevelInput}
                bookCoursePackageInput={bookCoursePackageInput} setBookCoursePackageInput={setBookCoursePackageInput}
                youtubeLinkInput={youtubeLinkInput} setYoutubeLinkInput={setYoutubeLinkInput}
                youtubeLinkError={youtubeLinkError}
                videoMrpInput={videoMrpInput} setVideoMrpInput={setVideoMrpInput}
                pendingVideoFiles={pendingVideoFiles} setPendingVideoFiles={setPendingVideoFiles}
                videoInstructorInput={videoInstructorInput} setVideoInstructorInput={setVideoInstructorInput}
                videoModeInput={videoModeInput} setVideoModeInput={setVideoModeInput}
                videoDescriptionInput={videoDescriptionInput} setVideoDescriptionInput={setVideoDescriptionInput}
                videoTypeInput={videoTypeInput} setVideoTypeInput={setVideoTypeInput}
                videoLevelInput={videoLevelInput} setVideoLevelInput={setVideoLevelInput}
                videoCoursePackageInput={videoCoursePackageInput} setVideoCoursePackageInput={setVideoCoursePackageInput}
                likedBookIds={likedBookIds} likedVideoIds={likedVideoIds}
                userName={profileName}
                editingBookId={editingBookId}
                editingVideoId={editingVideoId}
                handleBookSave={handleBookSave} handleVideoSave={handleVideoSave}
                handleEditBook={handleEditBook} handleEditVideo={handleEditVideo}
                handleDeleteBookWithConfirm={handleDeleteBookWithConfirm}
                handleDeleteVideoWithConfirm={handleDeleteVideoWithConfirm}
                handleToggleLikeBook={handleToggleLikeBook}
                handleToggleLikeVideo={handleToggleLikeVideo}
              />

            ) : activeSection === "upgrade" ? (
              <UpgradeSection
                upgradePlan={upgradePlan} setUpgradePlan={setUpgradePlan}
                profileBoostedUntil={profileBoostedUntil}
                hasOpenedRazorpay={hasOpenedRazorpay} setHasOpenedRazorpay={setHasOpenedRazorpay}
                processingUpgrade={processingUpgrade}
                profileError={profileError} profileMessage={profileMessage}
                handleUpgradeSubmit={handleUpgradeSubmit}
                handleOpenRazorpay={handleOpenRazorpay}
                setActiveSection={setActiveSection}
              />

            ) : activeSection === "settings" ? (
              <SettingsSection
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
                certificateList={certificateList}
                certificateUploads={certificateUploads} setCertificateUploads={setCertificateUploads}
                setPhotoFile={setPhotoFile}
                savingProfile={savingProfile}
                profileError={profileError} profileMessage={profileMessage}
                handleProfileSave={handleProfileSave}
              />

            ) : (
              <OverviewSection
                avatarSrc={avatarSrc}
                profileName={profileName}
                profileSpecialization={profileSpecialization}
                profileContactNumber={profileContactNumber}
                profileLocation={profileLocation}
                profileBoostedUntil={profileBoostedUntil}
                certificateList={certificateList}
                mapsHref={mapsHref}
                addedBooks={addedBooks}
                addedVideos={addedVideos}
                featuredPage={featuredPage}
                setFeaturedPage={setFeaturedPage}
                featuredContent={featuredContent}
                setActiveSection={setActiveSection}
              />
            )}

          </div>
        </section>
      </div>

      <NotificationDrawer
        notifOpen={notifOpen} setNotifOpen={setNotifOpen}
        notifLoading={notifLoading}
        notifFollows={notifFollows}
        notifPurchases={notifPurchases}
        notifReviews={notifReviews}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}
