"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, PlayCircle, Star } from "lucide-react";

import type { PublicProfessional } from "@/lib/professional-display";
import { addCartItem } from "@/lib/cart-store";

type UploadedBook = {
  id: string;
  name: string;
  category: string;
  mrp: string;
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
  const amount = Number.parseFloat(value.replace(/[₹$,\s]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function toPriceLabel(value: string) {
  const amount = parseAmount(value);
  return amount > 0 ? `₹${amount.toFixed(2)}` : "Free";
}

export default function ProfessionalProfileClient({ professional, canAddToCart, hasLibraryItems, categories, books, videos }: Props) {
  const [liveBooks, setLiveBooks] = useState<UploadedBook[]>(books);
  const [liveVideos, setLiveVideos] = useState<UploadedVideo[]>(videos);
  const [liveCategories, setLiveCategories] = useState<string[]>(categories);
  const [activeTab, setActiveTab] = useState<ContentTab>("videos");
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 1,
      name: "Riya P.",
      rating: 5,
      message: "Sessions were structured and super practical. We saw clear progress in 6 weeks.",
    },
    {
      id: 2,
      name: "Amit K.",
      rating: 4,
      message: "Very professional and responsive. Great with parents and school coordination.",
    },
  ]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

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
      })),
    }),
    [liveBooks, liveVideos]
  );

  const showLibrarySection = hasLibraryItems || liveBooks.length > 0 || liveVideos.length > 0;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const handleAddToCart = (item: ContentItem) => {
    if (!canAddToCart) {
      return;
    }

    addCartItem({
      id: `${professional.id}:${item.id}`,
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

  const submitReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      return;
    }

    setReviews((prev) => [
      {
        id: Date.now(),
        name: reviewName.trim(),
        rating: reviewRating,
        message: reviewText.trim(),
      },
      ...prev,
    ]);

    setReviewName("");
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <main className="min-h-screen bg-[#edf4f2] px-4  pb-12 pt-18 md:px-8 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl gap-8 rounded-4xl border border-[#dbe8e4] bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)] md:p-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={professional.image}
            alt={professional.name}
            width={600}
            height={700}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Professional Profile</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">{professional.name}</h1>
            <p className="mt-2 text-lg font-medium text-primary">{professional.specialization}</p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-[#dbe8e4] bg-[#f8fbfa] p-4 text-sm text-gray-700 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{professional.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold text-gray-900">{professional.rating.toFixed(1)}</span>
              <span>({professional.reviews} reviews)</span>
            </div>
            <p>Language: {professional.language}</p>
            <div className="space-y-2">
              <p>Category: {professional.category}</p>
              <div className="flex flex-wrap gap-2">
                {liveCategories.length > 0 ? (
                  liveCategories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary"
                    >
                      {category}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-500">No categories added yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dbe8e4] p-4">
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
            <p className="mt-2 text-sm leading-7 text-gray-600">
              {professional.name} is a trusted {professional.specialization.toLowerCase()} helping families
              with personalized support plans, practical sessions, and measurable progress.
            </p>
          </div>
        </div>
      </section>

      {showLibrarySection ? (
      <section className="mx-auto mt-8 w-full max-w-6xl rounded-3xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8" data-aos="fade-up">
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {contentMap[activeTab].length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">No {activeTab} uploaded yet.</p>
          ) : (
            contentMap[activeTab].map((item) => {
              const isFree = item.price === "Free";
              const hasOpenLink = Boolean(item.url);

              return (
                <article key={item.id} className="rounded-2xl border border-gray-200 bg-[#fbfdfc] p-4">
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
            })
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
      ) : null}

      <section className="mx-auto mt-8 w-full max-w-6xl">
        <div className="rounded-3xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8" data-aos="fade-up">
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#f4faf7] px-4 py-3">
            <h2 className="text-xl font-semibold text-gray-900">User Reviews</h2>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{averageRating} / 5</p>
              <p className="text-xs text-gray-500">{reviews.length} total reviews</p>
            </div>
          </div>

          <form onSubmit={submitReview} className="mt-4 space-y-3">
            <input
              type="text"
              value={reviewName}
              onChange={(event) => setReviewName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <select
              value={reviewRating}
              onChange={(event) => setReviewRating(Number(event.target.value))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
            <textarea
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              rows={4}
              placeholder="Write your review"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
            >
              Submit Review
            </button>
          </form>

          <ul className="mt-6 space-y-3">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-2xl border border-gray-200 bg-[#fafdfc] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e7f6f0] text-sm font-bold text-primary">
                      {review.name.slice(0, 1)}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">Verified learner</p>
                    </div>
                  </div>
                  <p className="text-sm text-primary">{"★".repeat(review.rating)}</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">{review.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
