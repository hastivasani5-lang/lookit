import { NextResponse } from "next/server";
import { getReviews } from "@/lib/reviews-store";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ reviews: [] });
  }

  try {
    const allReviews = await getReviews();
    const reviews = allReviews
      .filter((r) => r.professionalId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ reviews, total: reviews.length });
  } catch {
    return NextResponse.json({ reviews: [], total: 0 });
  }
}
