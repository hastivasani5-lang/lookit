import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReviews } from "@/lib/reviews-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const professionalId = request.nextUrl.searchParams.get("professionalId");
  const contentId = request.nextUrl.searchParams.get("contentId");

  if (!professionalId) {
    return NextResponse.json({ message: "Missing professionalId." }, { status: 400 });
  }

  const allReviews = await getReviews();

  // Show all reviews for this professional (no content filtering)
  const reviews = allReviews.filter((r) => r.professionalId === professionalId);

  return NextResponse.json({ reviews });
}
