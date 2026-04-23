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
    // Only show reviews that have this exact contentId
    // Legacy reviews without contentId are NOT shown
    if (contentId) {
      return r.contentId === contentId;
    }
    // If no contentId given, only show reviews that have a contentId (not legacy)
    return !!r.contentId;
  });

  return NextResponse.json({ reviews });
}
