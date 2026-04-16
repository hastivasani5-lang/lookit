import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteReviewById, getReviews } from "@/lib/reviews-store";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const reviews = await getReviews();

  return NextResponse.json({ reviews });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { reviewId?: string };
  const reviewId = typeof body.reviewId === "string" ? body.reviewId.trim() : "";

  if (!reviewId) {
    return NextResponse.json({ message: "Review ID is required." }, { status: 400 });
  }

  const deleted = await deleteReviewById(reviewId);

  if (!deleted) {
    return NextResponse.json({ message: "Review not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Review deleted." });
}
