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
  if (!professionalId) {
    return NextResponse.json({ message: "Missing professionalId." }, { status: 400 });
  }

  const allReviews = await getReviews();
  const reviews = allReviews.filter((r) => r.professionalId === professionalId);

  return NextResponse.json({ reviews });
}
