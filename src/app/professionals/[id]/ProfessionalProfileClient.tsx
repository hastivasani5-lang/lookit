"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, MapPin, PlayCircle, Star } from "lucide-react";

import type { Professional } from "@/app/professionals/data";

type ContentItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  duration?: string;
};

type ReviewItem = {
  id: number;
  name: string;
  rating: number;
  message: string;
};

type Props = {
  professional: Professional;
};

type ContentTab = "videos" | "books" | "courses" | "lectures";

const contentTabs: Array<{ label: string; value: ContentTab }> = [
  { label: "Videos", value: "videos" },
  { label: "Books", value: "books" },
  { label: "Courses", value: "courses" },
  { label: "Lectures", value: "lectures" },
];

export default function ProfessionalProfileClient({ professional }: Props) {
  const [activeTab, setActiveTab] = useState<ContentTab>("videos");
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

  const [selectedPlan, setSelectedPlan] = useState("single");
  const [selectedProduct, setSelectedProduct] = useState<ContentItem | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const paymentCardRef = useRef<HTMLDivElement | null>(null);

  const contentMap: Record<ContentTab, ContentItem[]> = useMemo(
    () => ({
      videos: [
        { id: "v1", title: `${professional.specialization} Fundamentals`, subtitle: "Beginner video series", price: "Rs 499", duration: "2h 10m" },
        { id: "v2", title: "Parent Strategy Walkthrough", subtitle: "Home implementation guide", price: "Rs 699", duration: "3h 00m" },
      ],
      books: [
        { id: "b1", title: "Action Workbook", subtitle: `${professional.specialization} exercises`, price: "Rs 399" },
        { id: "b2", title: "Parent Playbook", subtitle: "Daily routines and tracking templates", price: "Rs 549" },
      ],
      courses: [
        { id: "c1", title: "8-Week Guided Program", subtitle: "Weekly sessions + assignments", price: "Rs 4,999", duration: "8 weeks" },
        { id: "c2", title: "Assessment to Action", subtitle: "From diagnosis to measurable plan", price: "Rs 3,499", duration: "4 weeks" },
      ],
      lectures: [
        { id: "l1", title: "Live Q&A Master Lecture", subtitle: "Monthly live session", price: "Rs 799", duration: "90 mins" },
        { id: "l2", title: "School Support Lecture", subtitle: "Collaborating with teachers", price: "Rs 999", duration: "120 mins" },
      ],
    }),
    [professional.specialization]
  );

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const handleBuyNow = (item: ContentItem) => {
    setSelectedProduct(item);
    setSelectedPlan("content");
    setPaymentSuccess(false);
    paymentCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const submitPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cardName || !cardNumber || !expiry || !cvv) {
      setPaymentSuccess(false);
      return;
    }
    setPaymentSuccess(true);
  };

  return (
    <main className="min-h-screen bg-[#edf4f2] px-4 pb-12 pt-28 md:px-8 lg:px-10">
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
            <p>Category: {professional.category}</p>
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
          {contentMap[activeTab].map((item) => (
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
                <span className="text-gray-500">{item.duration ?? "Self paced"}</span>
              </div>
              <button
                type="button"
                onClick={() => handleBuyNow(item)}
                className="mt-4 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
              >
                Buy Now
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-6xl gap-8 lg:grid-cols-2">
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

        <div ref={paymentCardRef} className="rounded-3xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8" data-aos="fade-up">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Checkout
          </h2>
          <p className="mt-2 text-sm text-gray-600">Book consultation or purchase content from this profile.</p>

          {selectedProduct ? (
            <div className="mt-4 rounded-2xl border border-[#cdebdd] bg-[#f2fbf7] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Selected Item</p>
              <div className="mt-1 flex items-center justify-between gap-2 text-sm">
                <p className="font-semibold text-gray-900">{selectedProduct.title}</p>
                <p className="font-semibold text-primary">{selectedProduct.price}</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={submitPayment} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Plan</span>
              <select
                value={selectedPlan}
                onChange={(event) => setSelectedPlan(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="single">Single Session - Rs 1,499</option>
                <option value="monthly">Monthly Plan - Rs 4,999</option>
                <option value="course">Course Bundle - Rs 3,499</option>
                <option value="content">Selected Content Item</option>
              </select>
            </label>

            <input
              type="text"
              value={cardName}
              onChange={(event) => setCardName(event.target.value)}
              placeholder="Card holder name"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              type="text"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
              placeholder="Card number"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="password"
                value={cvv}
                onChange={(event) => setCvv(event.target.value)}
                placeholder="CVV"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
            >
              Pay Now
            </button>

            {paymentSuccess ? (
              <p className="rounded-xl bg-[#e9f8f2] px-3 py-2 text-sm text-[#0f7a5c]">
                Payment successful (demo). Your booking request has been placed.
              </p>
            ) : null}
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/professionals"
              className="rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Back to Professionals
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
