"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, MapPin, PlayCircle, Star, UserCheck, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";

import type { PublicProfessional } from "@/lib/professional-display";
import { addCartItem } from "@/lib/cart-store";

const RAZORPAY_PAYMENT_LINK = "https://razorpay.me/@jenildineshbhaigadhiya";

type UploadedBook = {
  id: string;
  name: string;
  category: string;
  mrp: string;
  imageUrl: string;
  url: string;
  source: "file" | "amazon";
};

type UploadedVideo = {
  id: string;
  name: string;
  mrp?: string;
  url: string;
  source: "file" | "youtube";
  sizeLabel: string;
};

type ContentItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  url: string;
  contentType: "book" | "video";
  imageUrl?: string;
};

type ReviewItem = {
  id: number;
  name: string;
  rating: number;
  message: string;
};

type Props = {
  professional: PublicProfessional;
  canAddToCart: boolean;
  hasLibraryItems: boolean;
  categories: string[];
  books: UploadedBook[];
  videos: UploadedVideo[];
};

type ContentTab = "videos" | "books";

const contentTabs: Array<{ label: string; value: ContentTab }> = [
  { label: "Videos", value: "videos" },
  { label: "Books", value: "books" },
];

function parseAmount(value: string) {
  const amount = Number.parseFloat(value.replace(/[₹$,,\s]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function toPriceLabel(value: string) {
  const amount = parseAmount(value);
  return amount > 0 ? `₹${amount.toFixed(2)}` : "Free";
}

export default function ProfessionalProfileClient({ professional, canAddToCart, hasLibraryItems, categories, books, videos }: Props) {
  const { data: session } = useSession();
  const studentId = session?.user?.id ?? null;
  const isStudent = session?.user?.role === "student";

  const [liveBooks, setLiveBooks] = useState<UploadedBook[]>(books);
  const [liveVideos, setLiveVideos] = useState<UploadedVideo[]>(videos);
  const [liveCategories, setLiveCategories] = useState<string[]>(categories);
  const [activeTab, setActiveTab] = useState<ContentTab>("videos");
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  // Professional profile details from localStorage
  const [savedFirstName, setSavedFirstName] = useState("");
  const [savedLastName, setSavedLastName] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [savedCity, setSavedCity] = useState("");
  const [savedPostalCode, setSavedPostalCode] = useState("");
  const [savedCountry, setSavedCountry] = useState("");
  const [savedFacebook, setSavedFacebook] = useState("");
  const [savedGoogle, setSavedGoogle] = useState("");
  const [savedTwitter, setSavedTwitter] = useState("");
  const [savedPinterest, setSavedPinterest] = useState("");
  const [savedAboutMe, setSavedAboutMe] = useState("");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const [selectedPlan, setSelectedPlan] = useState("single");
  const [selectedProduct, setSelectedProduct] = useState<ContentItem | null>(null);

  // ── Follow state ──────────────────────────────────────────────────────────
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followCount, setFollowCount] = useState(0);

  // Load initial follow state
  useEffect(() => {
    if (!professional.id) return;
    // Get total follower count
    fetch(`/api/follows?professionalId=${professional.id}`)
      .then((r) => r.json())
      .then((data: Array<{ studentId: string }>) => {
        setFollowCount(Array.isArray(data) ? data.length : 0);
        if (studentId) {
          setIsFollowing(data.some((f) => f.studentId === studentId));
        }
      })
      .catch(() => undefined);
  }, [professional.id, studentId]);

  const handleFollow = async () => {
    if (!isStudent || !studentId) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await fetch("/api/follows", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, professionalId: professional.id }),
        });
        setIsFollowing(false);
        setFollowCount((c) => Math.max(0, c - 1));
      } else {
        await fetch("/api/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, professionalId: professional.id }),
        });
        setIsFollowing(true);
        setFollowCount((c) => c + 1);
      }
    } catch {
      // silently fail
    } finally {
      setFollowLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const paymentCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLiveBooks(books);
    setLiveVideos(videos);
    setLiveCategories(categories);
  }, [books, categories, videos]);

  useEffect(() => {
    let isActive = true;

    const loadLatestLibrary = async () => {
      try {
        const response = await fetch(`/api/professionals/${professional.id}/library`, { cache: "no-store" });
        if (!response.ok || !isActive) {
          return;
        }

        const payload = (await response.json().catch(() => ({}))) as {
          books?: UploadedBook[];
          videos?: UploadedVideo[];
          categories?: string[];
        };

        if (!isActive) {
          return;
        }

        setLiveBooks(Array.isArray(payload.books) ? payload.books : []);
        setLiveVideos(Array.isArray(payload.videos) ? payload.videos : []);
        setLiveCategories(Array.isArray(payload.categories) ? payload.categories : []);
      } catch {
        return;
      }
    };

    void loadLatestLibrary();

    return () => {
      isActive = false;
    };
  }, [professional.id]);

  // Load saved professional profile data from localStorage
  useEffect(() => {
    if (!professional.id) return;

    const STORAGE_KEY = `professional-profile-${professional.id}`;
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as Record<string, string>;
        setSavedFirstName(parsed.firstName || "");
        setSavedLastName(parsed.lastName || "");
        setSavedAddress(parsed.address || "");
        setSavedCity(parsed.city || "");
        setSavedPostalCode(parsed.postalCode || "");
        setSavedCountry(parsed.country || "");
        setSavedFacebook(parsed.facebook || "");
        setSavedGoogle(parsed.google || "");
        setSavedTwitter(parsed.twitter || "");
        setSavedPinterest(parsed.pinterest || "");
        setSavedAboutMe(parsed.aboutMe || "");
      }
    } catch {
      // Silently fail if localStorage read fails
    }
  }, [professional.id]);

  // Load real reviews from API
  useEffect(() => {
    if (!professional.id) return;
    setReviewsLoading(true);
    fetch(`/api/professionals/${professional.id}/reviews`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { reviews?: Array<{ id: string; studentName: string; rating: number; review: string; createdAt: string }> }) => {
        if (Array.isArray(data.reviews)) {
          setReviews(
            data.reviews.map((r, i) => ({
              id: i + 1,
              name: r.studentName,
              rating: r.rating,
              message: r.review,
            }))
          );
        }
      })
      .catch(() => undefined)
      .finally(() => setReviewsLoading(false));
  }, [professional.id]);

  const contentMap: Record<ContentTab, ContentItem[]> = useMemo(
    () => ({
      videos: liveVideos.map((video) => ({
        id: video.id,
        title: video.name,
        subtitle: `${video.source === "youtube" ? "YouTube" : "Uploaded video"} • ${video.sizeLabel}`,
        price: toPriceLabel(video.mrp ?? "0"),
        url: video.url,
        contentType: "video" as const,
      })),
      books: liveBooks.map((book) => ({
        id: book.id,
        title: book.name,
        subtitle: `${book.category} • ${book.source === "amazon" ? "Amazon" : "Uploaded book"}`,
        price: toPriceLabel(book.mrp),
        url: book.url,
        contentType: "book" as const,
        imageUrl: book.imageUrl,
      })),
    }),
    [liveBooks, liveVideos]
  );

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const sortedReviews = useMemo(
    () => [...reviews].sort((left, right) => right.rating - left.rating || right.id - left.id),
    [reviews]
  );

  const handleAddToCart = (item: ContentItem) => {
    if (!canAddToCart) {
      return;
    }

    addCartItem({
      id: `${professional.id}:${item.id}`,
      contentId: item.id,
      professionalId: professional.id,
      professionalName: professional.name,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      contentType: item.contentType,
      sourceUrl: item.url,
    });

    setCartItemIds((current) => (current.includes(item.id) ? current : [item.id, ...current]));
  };

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewText.trim()) return;
    const nameToUse = (session?.user?.name ?? reviewName).trim();
    if (!nameToUse) return;

    try {
      const response = await fetch("/api/profile/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: professional.id,
          rating: reviewRating,
          review: reviewText.trim(),
        }),
      });

      if (!response.ok) return;

      // Reload reviews from API to show all real reviews
      const refreshed = await fetch(`/api/professionals/${professional.id}/reviews`, { cache: "no-store" });
      const data = (await refreshed.json()) as { reviews?: Array<{ id: string; studentName: string; rating: number; review: string; createdAt: string }> };
      if (Array.isArray(data.reviews)) {
        setReviews(
          data.reviews.map((r, i) => ({
            id: i + 1,
            name: r.studentName,
            rating: r.rating,
            message: r.review,
          }))
        );
      }

      setReviewName("");
      setReviewText("");
      setReviewRating(5);
    } catch {
      return;
    }
  };

  const submitPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cardName || !cardNumber || !expiry || !cvv) {
      setPaymentSuccess(false);
      return;
    }
    window.open(RAZORPAY_PAYMENT_LINK, "_blank", "noopener,noreferrer");
    setPaymentSuccess(true);
  };

  // Helper: render stars with half-star support
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="h-4 w-4 text-yellow-400" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="h-4 w-4 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  // Calculate rating distribution for the summary
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingCounts[review.rating as keyof typeof ratingCounts]++;
  });
  const totalReviewsCount = reviews.length;

  return (
    <main className="min-h-screen bg-[#edf4f2] px-4 pb-12 pt-10 md:px-8 lg:px-10">
      <section className="mx-auto w-full max-w-7xl rounded-[36px] border border-[#dbe8e4] bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)] md:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <aside className="sticky top-24 overflow-hidden rounded-4xl border border-[#dbe8e4] bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)] md:p-5 lg:rounded-4xl">
            <div className="relative overflow-hidden rounded-3xl">
              <Image
                src={professional.image}
                alt={professional.name}
                width={600}
                height={700}
                className="h-85 w-full object-cover md:h-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Professional Profile</p>
                <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">{professional.name}</h1>
                <p className="mt-1 text-base font-medium text-primary">{professional.specialization}</p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-[#dbe8e4] bg-[#f8fbfa] p-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{professional.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold text-gray-900">{professional.rating.toFixed(1)}</span>
                  <span>({professional.reviews} reviews)</span>
                </div>
                <p className="rounded-full bg-white px-3 py-2">Language: {professional.language}</p>
                <p className="rounded-full bg-white px-3 py-2">Category: {professional.category}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {liveCategories.length > 0 ? (
                    liveCategories.map((category) => (
                      <span key={category} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-500">No categories added yet</span>
                  )}
                </div>
              </div>

              {/* ── Follow Button ── */}
              <div className="flex items-center gap-3 pt-1">
                {isStudent ? (
                  <button
                    type="button"
                    onClick={() => void handleFollow()}
                    disabled={followLoading}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition disabled:opacity-60 ${
                      isFollowing
                        ? "border-2 border-[#1ec28e] bg-white text-[#1ec28e] hover:bg-red-50 hover:border-red-400 hover:text-red-500"
                        : "bg-[#1ec28e] text-white hover:bg-[#17a87a]"
                    }`}
                  >
                    {followLoading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : isFollowing ? (
                      <UserCheck className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1ec28e] py-2.5 text-sm font-bold text-white transition hover:bg-[#17a87a]"
                  >
                    <UserPlus className="h-4 w-4" />
                    Follow
                  </Link>
                )}
                <div className="flex flex-col items-center rounded-2xl border border-[#dbe8e4] bg-[#f8fbfa] px-4 py-2">
                  <span className="text-lg font-bold text-[#1ec28e]">{followCount}</span>
                  <span className="text-[10px] text-gray-500">Followers</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <div className="rounded-4xl border border-[#dbe8e4] bg-[#fbfdfc] p-6 shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Overview</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">Profile overview</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
                Explore this expert’s offerings, learning materials, reviews, and consultation options from one place.
              </p>
            </div>

            <div className="rounded-3xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-lg font-semibold text-gray-900">About</h2>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                {professional.name} is a trusted {professional.specialization.toLowerCase()} helping families
                with personalized support plans, practical sessions, and measurable progress.
              </p>
            </div>

            {(savedAboutMe || savedAddress || savedCity || savedCountry || savedFacebook || savedGoogle || savedTwitter || savedPinterest) && (
              <div className="rounded-3xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h2>

                {/* Personal Details */}
                {(savedFirstName || savedLastName || savedAddress || savedCity || savedPostalCode || savedCountry) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm">Contact Information</h3>
                    <div className="grid gap-3 text-sm text-gray-600">
                      {(savedFirstName || savedLastName) && (
                        <p>
                          <span className="font-medium text-gray-700">Name: </span>
                          {[savedFirstName, savedLastName].filter(Boolean).join(" ")}
                        </p>
                      )}
                      {savedAddress && (
                        <p>
                          <span className="font-medium text-gray-700">Address: </span>
                          {savedAddress}
                        </p>
                      )}
                      {(savedCity || savedPostalCode || savedCountry) && (
                        <p>
                          <span className="font-medium text-gray-700">Location: </span>
                          {[savedCity, savedPostalCode, savedCountry].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* About Me */}
                {savedAboutMe && (
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm">About</h3>
                    <p className="text-sm leading-6 text-gray-600 whitespace-pre-wrap">{savedAboutMe}</p>
                  </div>
                )}

                {/* Social Links */}
                {(savedFacebook || savedGoogle || savedTwitter || savedPinterest) && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm">Connect</h3>
                    <div className="flex flex-wrap gap-3">
                      {savedFacebook && (
                        <a
                          href={savedFacebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#f0f7f5] px-4 py-2 text-sm font-medium text-[#1ec28e] transition hover:bg-[#1ec28e] hover:text-white"
                        >
                          Facebook
                        </a>
                      )}
                      {savedGoogle && (
                        <a
                          href={savedGoogle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#f0f7f5] px-4 py-2 text-sm font-medium text-[#1ec28e] transition hover:bg-[#1ec28e] hover:text-white"
                        >
                          Google
                        </a>
                      )}
                      {savedTwitter && (
                        <a
                          href={savedTwitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#f0f7f5] px-4 py-2 text-sm font-medium text-[#1ec28e] transition hover:bg-[#1ec28e] hover:text-white"
                        >
                          Twitter
                        </a>
                      )}
                      {savedPinterest && (
                        <a
                          href={savedPinterest}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#f0f7f5] px-4 py-2 text-sm font-medium text-[#1ec28e] transition hover:bg-[#1ec28e] hover:text-white"
                        >
                          Pinterest
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <section className="rounded-3xl border border-[#dbe8e4] bg-white p-5 shadow-sm md:p-6" data-aos="fade-up">
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
                {contentTabs.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.value
                        ? "bg-primary text-white"
                        : "bg-[#eef7f4] text-gray-700 hover:bg-[#dff1eb]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className={activeTab === "books" ? "mt-5 overflow-x-auto pb-2" : "mt-5 grid gap-4 sm:grid-cols-2"}>
                {contentMap[activeTab].length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
                    No {activeTab} uploaded yet.
                  </p>
                ) : (
                  <div className={activeTab === "books" ? "flex min-w-max gap-4" : "contents"}>
                  {contentMap[activeTab].map((item) => {
                    const isFree = item.price === "Free";
                    const hasOpenLink = Boolean(item.url);

                    return (
                      <article
                        key={item.id}
                        className={`rounded-2xl border border-gray-200 bg-[#fbfdfc] p-4 ${
                          activeTab === "books"
                            ? "w-[calc((100vw-4.5rem)/2)] min-w-[280px] max-w-[360px] md:w-[calc((100vw-8rem)/2)]"
                            : ""
                        }`}
                      >
                        {activeTab === "books" ? (
                          <div className="mb-3 overflow-hidden rounded-xl border border-gray-100 bg-white">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                width={640}
                                height={360}
                                className="h-36 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-36 w-full items-center justify-center bg-[#f6fbf9] text-xs text-gray-500">
                                No image uploaded
                              </div>
                            )}
                          </div>
                        ) : null}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{item.subtitle}</p>
                          </div>
                          <PlayCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="font-semibold text-primary">{item.price}</span>
                          <span className="text-gray-500 capitalize">{item.contentType}</span>
                        </div>

                        {isFree ? (
                          hasOpenLink ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
                            >
                              Open Free
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="mt-4 w-full rounded-full bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500"
                            >
                              Free (No Link)
                            </button>
                          )
                        ) : (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item)}
                              disabled={!canAddToCart}
                              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {canAddToCart && cartItemIds.includes(item.id) ? "Added" : "Add to Cart"}
                            </button>
                            {hasOpenLink ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-full items-center justify-center rounded-full border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                              >
                                Open
                              </a>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400"
                              >
                                No Link
                              </button>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbe8e4] bg-[#f8fbfa] p-4 text-sm text-gray-600">
                <p>
                  Free items open directly. Paid items can be purchased from your cart.
                  {canAddToCart ? "" : " Please log in as a student to buy paid items."}
                </p>
                {canAddToCart ? (
                  <Link
                    href="/cart"
                    className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#18ab7d]"
                  >
                    Go to Cart
                  </Link>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* ========== REDESIGNED RATINGS SUMMARY SECTION ========== */}
      <section className="mx-auto mt-8 w-full max-w-7xl">
        <div className="rounded-2xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ratings & Reviews</h2>
          
          <div className="grid gap-8 md:grid-cols-[auto,1fr]">
            {/* Left: Average rating circle */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
                <div className="mt-2">{renderStars(parseFloat(averageRating))}</div>
                <p className="mt-2 text-sm text-gray-500">Based on {reviews.length} reviews</p>
              </div>
            </div>

            {/* Right: Rating bars */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star as keyof typeof ratingCounts];
                const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                const barColor =
                  star === 5 ? "bg-green-500" :
                  star === 4 ? "bg-lime-400" :
                  star === 3 ? "bg-yellow-400" :
                  star === 2 ? "bg-orange-400" :
                  "bg-red-500";
                const starColor =
                  star === 5 ? "text-green-500" :
                  star === 4 ? "text-lime-400" :
                  star === 3 ? "text-yellow-400" :
                  star === 2 ? "text-orange-400" :
                  "text-red-500";
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex w-16 items-center gap-1">
                      <span className="text-sm font-medium text-gray-700">{star}</span>
                      <FaStar className={`h-3.5 w-3.5 ${starColor}`} />
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm text-gray-500">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========== REDESIGNED USER REVIEWS SECTION ========== */}
      <section className="mx-auto mt-8 grid w-full max-w-7xl gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8" data-aos="fade-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Write a Review</h2>

          <form onSubmit={submitReview} className="mt-4 space-y-3">
            {isStudent ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#1ec28e]/30 bg-[#effaf6] px-3 py-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1ec28e] text-xs font-bold text-white">
                  {(session?.user?.name ?? "?").charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-slate-700">{session?.user?.name}</span>
                <span className="ml-auto rounded-full bg-[#1ec28e]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1ec28e]">Verified Student</span>
              </div>
            ) : (
              <input
                type="text"
                value={reviewName}
                onChange={(event) => setReviewName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            )}
            <select
              value={reviewRating}
              onChange={(event) => setReviewRating(Number(event.target.value))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
              <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
              <option value={3}>⭐⭐⭐ 3 Stars</option>
              <option value={2}>⭐⭐ 2 Stars</option>
              <option value={1}>⭐ 1 Star</option>
            </select>
            <textarea
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              rows={4}
              placeholder="Write your review..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            {isStudent ? (
              <button
                type="submit"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
              >
                Submit Review
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
              >
                Login to Submit Review
              </Link>
            )}
          </form>
        </div>

        <div className="rounded-2xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8" data-aos="fade-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User Reviews</h2>
          
          {reviewsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : sortedReviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <ul className="space-y-6">
              {sortedReviews.map((review) => (
                <li key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.name}</h3>
                          <div className="mt-1">{renderStars(review.rating)}</div>
                        </div>
                        <span className="text-xs text-gray-400">Verified</span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        {review.message}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Payment Checkout Card - unchanged */}
     
      </section>
    </main>
  );
}