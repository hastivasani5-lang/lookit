import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getReviews, addReview } from "@/lib/reviews-store";
import { getUserById } from "@/lib/user-store";

export const runtime = "nodejs";

type ReviewPayload = {
  professionalId?: string;
  review?: string;
  rating?: number;
  contentId?: string;
  contentType?: "book" | "video";
};

function formatAverageRating(reviews: { rating: number }[]): string {
  if (reviews.length === 0) return "0.0";
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return avg.toFixed(1);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ reviews: [] });
    }

    const user = await getUserById(session.user.id);
    if (!user || (user.role !== "professional" && user.role !== "student")) {
      return NextResponse.json({ reviews: [] });
    }

    const allReviews = await getReviews();
    const reviews = allReviews
      .filter((r) =>
        user.role === "professional"
          ? r.professionalId === user.id
          : r.studentId === user.id,
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      reviews,
      totalReviews: reviews.length,
      averageRating: formatAverageRating(reviews),
      lastUpdated: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
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

  if (!professionalId) return NextResponse.json({ message: "Please select a professional." }, { status: 400 });
  if (!review || review.length < 5) return NextResponse.json({ message: "Please write a longer review." }, { status: 400 });
  if (!Number.isFinite(rating) || rating < 3 || rating > 5) return NextResponse.json({ message: "Only positive reviews (3 stars or above) are allowed." }, { status: 400 });

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

  return NextResponse.json({ message: "Review submitted successfully.", review: record });
}
