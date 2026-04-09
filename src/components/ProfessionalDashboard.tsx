"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  ChevronRight,
  CreditCard,
  Heart,
  LayoutGrid,
  LogOut,
  Save,
  Search,
  Settings,
  Star,
  Upload,
  Users,
  Video,
} from "lucide-react";

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
  sizeLabel: string;
  url: string;
  source: "file" | "youtube";
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

const sidebarItems: Array<{ label: string; icon: typeof LayoutGrid; section: DashboardSection }> = [
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
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [addContentTab, setAddContentTab] = useState<AddContentTab>("books");
  const [featuredPage, setFeaturedPage] = useState<FeaturedPage>(1);
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileSpecialization, setProfileSpecialization] = useState(user.specialization ?? "");
  const [profileContactNumber, setProfileContactNumber] = useState(user.contactNumber ?? "");
  const [profileLocation, setProfileLocation] = useState(user.location ?? "");
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
  const [bookImageLinkInput, setBookImageLinkInput] = useState("");
  const [bookLinkInput, setBookLinkInput] = useState("");
  const [bookFormError, setBookFormError] = useState("");
  const [youtubeLinkInput, setYoutubeLinkInput] = useState("");
  const [youtubeLinkError, setYoutubeLinkError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        return;
      }

      setProfileBoostedUntil(result.user?.profileBoostedUntil ?? null);
      setProfileMessage(result.message || "Your profile has been upgraded.");
      router.refresh();
    } catch {
      setProfileError("Unable to process payment.");
    } finally {
      setProcessingUpgrade(false);
    }
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

        setAddedBooks(Array.isArray(payload.books) ? payload.books : []);
        setAddedVideos(Array.isArray(payload.videos) ? payload.videos : []);
      } catch {
        setAddedBooks([]);
        setAddedVideos([]);
      }
    };

    void loadLibrary();
  }, [isMounted, user.role]);

  const handleBookUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const trimmedBookName = bookNameInput.trim();
    const trimmedBookMrp = bookMrpInput.trim();
    const trimmedBookCategory = bookCategoryInput.trim();
    const parsedMrp = Number(trimmedBookMrp);

    if (!trimmedBookName || !trimmedBookMrp || !trimmedBookCategory) {
      setBookFormError("Please enter book name, MRP, and category/type before uploading.");
      event.target.value = "";
      return;
    }

    const trimmedBookImageLink = bookImageLinkInput.trim();
    let resolvedBookImageUrl = "";

    if (bookImageFile) {
      resolvedBookImageUrl = URL.createObjectURL(bookImageFile);
    } else if (trimmedBookImageLink) {
      if (!parseHttpUrl(trimmedBookImageLink)) {
        setBookFormError("Please provide a valid image link.");
        event.target.value = "";
        return;
      }
      resolvedBookImageUrl = trimmedBookImageLink;
    } else {
      setBookFormError("Please upload a book image file or provide an image link.");
      event.target.value = "";
      return;
    }

    if (!Number.isFinite(parsedMrp) || parsedMrp <= 0) {
      setBookFormError("Please enter a valid MRP amount.");
      event.target.value = "";
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
          const response = await fetch("/api/profile/library", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "book",
              name: trimmedBookName,
              category: trimmedBookCategory,
              mrp: parsedMrp.toFixed(2),
              imageUrl: trimmedBookImageLink || "/books.png",
              url: "",
              source: "file",
              fileName: file.name,
              sizeLabel: formatFileSize(file.size),
            }),
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
    setBookImageLinkInput("");
    setBookLinkInput("");
    event.target.value = "";
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
    setBookImageLinkInput("");
    setBookLinkInput("");
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

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const localVideos = files.map((file, index) => ({
      id: `video-${Date.now()}-${index}`,
      name: file.name,
      sizeLabel: formatFileSize(file.size),
      url: URL.createObjectURL(file),
      source: "file" as const,
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
              url: "",
              source: "file",
              sizeLabel: formatFileSize(file.size),
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

    event.target.value = "";
  };

  const handleYouTubeAdd = async () => {
    const trimmedLink = youtubeLinkInput.trim();
    if (!trimmedLink) {
      setYoutubeLinkError("Please enter a YouTube link.");
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
          sizeLabel: "YouTube Link",
          url: embedUrl,
          source: "youtube",
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
    } catch {
      setYoutubeLinkError("Unable to add YouTube video.");
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    setAddedBooks((currentBooks) => {
      const bookToRemove = currentBooks.find((book) => book.id === bookId);
      if (bookToRemove?.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(bookToRemove.imageUrl);
      }
      if (bookToRemove?.url.startsWith("blob:")) {
        URL.revokeObjectURL(bookToRemove.url);
      }

      return currentBooks.filter((book) => book.id !== bookId);
    });

    await fetch("/api/profile/library", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "book", id: bookId }),
    }).catch(() => undefined);
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
    <main className="h-screen overflow-hidden bg-[#f3f4fb] p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid h-[calc(100vh-2rem)] max-w-[1600px] grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(17,24,39,0.08)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="flex flex-col border-b border-slate-200 bg-white px-5 py-6 lg:sticky lg:top-0 lg:h-full lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 px-2 pb-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1ec28e]/10 text-[#1ec28e]">
              <div className="h-5 w-5 rounded-full border-4 border-current border-r-transparent" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">LearnFlow</h1>
              <p className="text-xs text-slate-500">Professional dashboard</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#f7faf8] p-4">
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
              const isActive = activeSection === item.section;

              return (
                <button
                  key={item.label}
                  onClick={() => setActiveSection(item.section)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive ? "bg-[#1ec28e]/10 text-[#1ec28e]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </aside>

  <section className="h-full overflow-y-auto bg-[#f7f8fd] px-4 py-5 md:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-[24px] bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Welcome!</h2>
              <p className="text-sm text-slate-500">Welcome back, it’s explore now!</p>
            </div>

            <div className="flex w-full max-w-3xl items-center gap-3 md:w-auto md:flex-1 md:justify-end">
              <div className="flex h-12 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 md:max-w-xl">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
                <Bell className="h-4 w-4" />
              </button>
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
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Add Books</h3>
                        <p className="text-sm text-slate-500">Enter details and upload book files.</p>
                      </div>
                      <BookOpen className="h-5 w-5 text-[#1ec28e]" />
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <input
                        type="text"
                        value={bookNameInput}
                        onChange={(event) => setBookNameInput(event.target.value)}
                        placeholder="Book name"
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={bookMrpInput}
                        onChange={(event) => setBookMrpInput(event.target.value)}
                        placeholder="MRP"
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                      />
                      <input
                        type="text"
                        value={bookCategoryInput}
                        onChange={(event) => setBookCategoryInput(event.target.value)}
                        placeholder="Category / Type"
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                      />
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="flex h-11 cursor-pointer items-center justify-between rounded-xl border border-dashed border-slate-300 px-3 text-sm text-slate-600 transition hover:border-[#1ec28e] hover:bg-[#f7faf8]">
                        <span className="truncate">{bookImageFile ? bookImageFile.name : "Upload book image file"}</span>
                        <span className="rounded-full bg-[#effaf6] px-2.5 py-1 text-xs font-medium text-[#1ec28e]">Browse</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => setBookImageFile(event.target.files?.[0] ?? null)}
                        />
                      </label>

                      <input
                        type="url"
                        value={bookImageLinkInput}
                        onChange={(event) => setBookImageLinkInput(event.target.value)}
                        placeholder="Or paste Google image link"
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                      />
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                      <input
                        type="url"
                        value={bookLinkInput}
                        onChange={(event) => setBookLinkInput(event.target.value)}
                        placeholder="Paste Amazon book link"
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                      />
                      <button
                        type="button"
                        onClick={handleAmazonBookAdd}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                      >
                        Add Amazon Book
                      </button>
                    </div>

                    <label className="mt-5 flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 px-4 text-sm text-slate-600 transition hover:border-[#1ec28e] hover:bg-[#f7faf8]">
                      <span>Choose books to upload</span>
                      <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e]">Browse</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        className="hidden"
                        onChange={handleBookUpload}
                      />
                    </label>

                    {bookFormError && <p className="mt-3 text-xs font-medium text-red-600">{bookFormError}</p>}
                  </div>

                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-slate-900">Uploaded Books</h4>
                      <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">
                        {addedBooks.length}
                      </span>
                    </div>

                    {addedBooks.length === 0 ? (
                      <p className="rounded-2xl bg-[#f7faf8] px-4 py-3 text-sm text-slate-500">No books uploaded yet.</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {addedBooks.map((book) => (
                          <article key={book.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-[#f7faf8]">
                            <img src={book.imageUrl} alt={book.name} className="h-44 w-full object-cover" />
                            <div className="space-y-2 p-4">
                              <p className="line-clamp-2 text-sm font-semibold text-slate-900">{book.name}</p>
                              <p className="text-xs text-slate-500">{book.category}</p>
                              <p className="text-sm font-semibold text-[#1ec28e]">MRP ₹{book.mrp}</p>
                              <p className="truncate text-xs text-slate-500">
                                {book.source === "amazon" ? "Amazon Link" : book.fileName} • {book.sizeLabel}
                              </p>
                              <div className="flex items-center gap-2 pt-1">
                                <a
                                  href={book.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#1ec28e] transition hover:bg-[#effaf6]"
                                >
                                  View Book
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="inline-flex rounded-full bg-[#fff1f1] px-3 py-1.5 text-xs font-medium text-[#cc2a2a] transition hover:bg-[#ffe2e2]"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Add Videos</h3>
                        <p className="text-sm text-slate-500">Upload tutorial or course videos.</p>
                      </div>
                      <Video className="h-5 w-5 text-[#1ec28e]" />
                    </div>

                    <label className="mt-5 flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 px-4 text-sm text-slate-600 transition hover:border-[#1ec28e] hover:bg-[#f7faf8]">
                      <span>Choose videos to upload</span>
                      <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-medium text-[#1ec28e]">Browse</span>
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                    </label>

                    <div className="mt-4 flex gap-2">
                      <input
                        type="url"
                        value={youtubeLinkInput}
                        onChange={(event) => setYoutubeLinkInput(event.target.value)}
                        placeholder="Paste YouTube link"
                        className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                      />
                      <button
                        type="button"
                        onClick={handleYouTubeAdd}
                        className="h-11 rounded-xl bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
                      >
                        Add Link
                      </button>
                    </div>

                    {youtubeLinkError && <p className="mt-3 text-xs font-medium text-red-600">{youtubeLinkError}</p>}
                  </div>

                  <div className="rounded-[24px] bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-slate-900">Uploaded Videos</h4>
                      <span className="rounded-full bg-[#effaf6] px-3 py-1 text-xs font-semibold text-[#1ec28e]">
                        {addedVideos.length}
                      </span>
                    </div>

                    {addedVideos.length === 0 ? (
                      <p className="rounded-2xl bg-[#f7faf8] px-4 py-3 text-sm text-slate-500">No videos uploaded yet.</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {addedVideos.map((video) => (
                          <article key={video.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-[#f7faf8]">
                            {video.source === "youtube" ? (
                              <iframe
                                className="aspect-video w-full bg-black"
                                src={video.url}
                                title={video.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video src={video.url} controls className="aspect-video w-full bg-black" />
                            )}
                            <div className="space-y-1 p-4">
                              <p className="truncate text-sm font-semibold text-slate-900">{video.name}</p>
                              <p className="text-xs text-slate-500">{video.sizeLabel}</p>
                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(video.id)}
                                className="inline-flex rounded-full bg-[#fff1f1] px-3 py-1.5 text-xs font-medium text-[#cc2a2a] transition hover:bg-[#ffe2e2]"
                              >
                                Delete
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : activeSection === "upgrade" ? (
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <form onSubmit={handleUpgradeSubmit} className="rounded-[24px] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Upgrade Profile</h3>
                    <p className="text-sm text-slate-500">Pay to rank higher than other professionals.</p>
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
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1ec28e] px-5 text-sm font-medium text-white transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <CreditCard className="h-4 w-4" />
                    {processingUpgrade ? "Processing..." : "Pay & Upgrade"}
                  </button>
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
                        onClick={() => setUpgradePlan(plan.key)}
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
                    <h3 className="text-lg font-semibold text-slate-900">Settings</h3>
                    <p className="text-sm text-slate-500">Update your profile information and photo.</p>
                  </div>
                  <Settings className="h-5 w-5 text-[#1ec28e]" />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Name
                    <input
                      type="text"
                      value={profileName}
                      onChange={(event) => setProfileName(event.target.value)}
                      className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Email
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(event) => setProfileEmail(event.target.value)}
                      className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Specialization
                    <input
                      type="text"
                      value={profileSpecialization}
                      onChange={(event) => setProfileSpecialization(event.target.value)}
                      placeholder="e.g. UI/UX Design"
                      className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Contact number
                    <input
                      type="text"
                      value={profileContactNumber}
                      onChange={(event) => setProfileContactNumber(event.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Location
                    <input
                      type="text"
                      value={profileLocation}
                      onChange={(event) => setProfileLocation(event.target.value)}
                      placeholder="Enter your city or address"
                      className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e]"
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
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1ec28e] px-5 text-sm font-medium text-white transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    {savingProfile ? "Saving..." : "Save changes"}
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