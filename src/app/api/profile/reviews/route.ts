import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { addReview, getReviews } from "@/lib/reviews-store";
import { getUserById } from "@/lib/user-store";

export const runtime = "nodejs";

type ReviewPayload = {
  professionalId?: string;
  contentId?: string;
  contentType?: string;
  rating?: number;
  review?: string;
};

function formatAverageRating(reviews: Array<{ rating: number }>) {
  if (reviews.length === 0) {
    return 0;
  }

  return Math.round((reviews.reduce((sum, entry) => sum + entry.rating, 0) / reviews.length) * 10) / 10;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!user || (user.role !== "professional" && user.role !== "student")) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const reviews = (await getReviews()).filter((review) =>
    user.role === "professional" ? review.professionalId === user.id : review.studentId === user.id,
  );
  const averageRating = formatAverageRating(reviews);

  return NextResponse.json({
    reviews,
    totalReviews: reviews.length,
    averageRating,
    lastUpdated: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const student = await getUserById(session.user.id);
  if (!student || student.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as ReviewPayload;
  const professionalId = typeof body.professionalId === "string" ? body.professionalId.trim() : "";
  const review = typeof body.review === "string" ? body.review.trim() : "";
  const rating = typeof body.rating === "number" ? body.rating : Number.NaN;
  const contentId = typeof body.contentId === "string" ? body.contentId.trim() : undefined;
  const contentType = body.contentType === "book" || body.contentType === "video" ? body.contentType : undefined;

  if (!professionalId) {
    return NextResponse.json({ message: "Please select a professional." }, { status: 400 });
  }

  if (!review || review.length < 5) {
    return NextResponse.json({ message: "Please write a longer review." }, { status: 400 });
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ message: "Please provide a rating between 1 and 5." }, { status: 400 });
  }

  const professional = await getUserById(professionalId);
  if (!professional || professional.role !== "professional" || professional.approvalStatus !== "approved") {
    return NextResponse.json({ message: "Professional not found." }, { status: 404 });
  }

  const record = await addReview({
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    professionalId: professional.id,
    professionalName: professional.name,
    contentId,
    contentType,
    rating,
    review,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Review submitted successfully.",
    review: record,
  });
}
