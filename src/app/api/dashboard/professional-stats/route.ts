import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getProfessionalLibrary } from "@/lib/content-library-store";
import { getFollowerIds } from "@/lib/follows-store";
import { getPayments } from "@/lib/payment-store";
import { getReviews } from "@/lib/reviews-store";
import { getAllLibraries } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "professional") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const professionalId = session.user.id;

  const [library, followerIds, allPayments, allReviews] = await Promise.all([
    getProfessionalLibrary(professionalId),
    getFollowerIds(professionalId),
    getPayments(),
    getReviews(),
  ]);

  // Payments for this professional
  const myPayments = allPayments.filter((p) => p.professionalId === professionalId);
  const totalEarnings = myPayments.reduce((sum, p) => {
    const num = parseFloat(p.amount.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  // Reviews for this professional
  const myReviews = allReviews.filter((r) => r.professionalId === professionalId);
  const avgRating =
    myReviews.length > 0
      ? myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length
      : 0;

  // Recent purchases (last 10)
  const recentPurchases = myPayments
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      studentName: p.studentName,
      studentEmail: p.studentEmail,
      plan: p.plan,
      amount: p.amount,
      paidAt: p.paidAt,
    }));

  // Recent followers (last 10) — we only have IDs, show count
  const followersCount = followerIds.length;

  // Weekly earnings (last 7 days)
  const now = new Date();
  const weeklyEarnings: number[] = Array(7).fill(0);
  const weeklyLabels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    weeklyLabels.push(d.toLocaleDateString("en-IN", { weekday: "short" }));
    const dayStart = new Date(d.setHours(0, 0, 0, 0)).getTime();
    const dayEnd = new Date(d.setHours(23, 59, 59, 999)).getTime();
    const dayTotal = myPayments
      .filter((p) => {
        const t = new Date(p.paidAt).getTime();
        return t >= dayStart && t <= dayEnd;
      })
      .reduce((sum, p) => {
        const num = parseFloat(p.amount.replace(/[^0-9.]/g, ""));
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    weeklyEarnings[6 - i] = dayTotal;
  }

  return NextResponse.json({
    booksCount: library.books.length,
    videosCount: library.videos.length,
    followersCount,
    totalEarnings: totalEarnings.toFixed(0),
    reviewsCount: myReviews.length,
    avgRating: avgRating.toFixed(1),
    recentPurchases,
    weeklyLabels,
    weeklyEarnings,
  });
}
