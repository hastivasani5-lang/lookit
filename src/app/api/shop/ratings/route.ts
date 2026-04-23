import { NextResponse } from "next/server";
import { getReviews } from "@/lib/reviews-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const allReviews = await getReviews();

    // Group reviews by contentId and calculate average rating
    const ratingsByContent: Record<string, { sum: number; count: number }> = {};

    allReviews.forEach((r) => {
      if (!r.contentId) return; // skip legacy reviews
      if (!ratingsByContent[r.contentId]) {
        ratingsByContent[r.contentId] = { sum: 0, count: 0 };
      }
      ratingsByContent[r.contentId].sum += r.rating;
      ratingsByContent[r.contentId].count += 1;
    });

    const ratings: Record<string, number> = {};
    Object.entries(ratingsByContent).forEach(([contentId, data]) => {
      ratings[contentId] = Math.round((data.sum / data.count) * 10) / 10;
    });

    return NextResponse.json({ ratings });
  } catch {
    return NextResponse.json({ ratings: {} });
  }
}
