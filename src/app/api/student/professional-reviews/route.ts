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

  // Filter by professionalId AND contentId (if provided)
  const reviews = allReviews.filter((r) => {
    if (r.professionalId !== professionalId) return false;
    // If contentId is given, only show reviews for that specific content
    if (contentId) {
      // Show reviews that match this contentId, OR old reviews with no contentId (legacy)
      return r.contentId === contentId || !r.contentId;
    }
    return true;
  });

  return NextResponse.json({ reviews });
}
