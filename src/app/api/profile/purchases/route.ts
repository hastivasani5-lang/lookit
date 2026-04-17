import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getPayments } from "@/lib/payment-store";
import { getUserById } from "@/lib/user-store";

export const runtime = "nodejs";

type PurchaseRow = {
  id: string;
  studentId: string;
  studentName: string;
  itemTitle: string;
  contentType: "book" | "video";
  purchaseTime: string;
  transactionId: string;
  amount: string;
};

async function getAuthorizedProfessionalId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const user = await getUserById(session.user.id);
  if (!user || user.role !== "professional") {
    return null;
  }

  return user.id;
}

export async function GET() {
  const professionalId = await getAuthorizedProfessionalId();
  if (!professionalId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const payments = await getPayments();


  // Only show purchases from today (not last 24h, but same calendar date)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = today.getMonth();
  const dd = today.getDate();

  const purchases = payments
    .filter((payment) => payment.professionalId === professionalId && payment.status === "completed")
    .flatMap((payment) =>
      payment.items
        .filter((item): item is { contentId?: string; title: string; contentType: "book" | "video"; price: string } =>
          item.contentType === "book" || item.contentType === "video",
        )
        .map((item, index) => ({
          id: `${payment.id}-${item.contentId ?? item.title}-${index}`,
          studentId: payment.studentId,
          studentName: payment.studentName,
          itemTitle: item.title,
          contentType: item.contentType,
          purchaseTime: payment.paidAt,
          transactionId: payment.transactionId,
          amount: item.price,
        } satisfies PurchaseRow)),
    )
    .filter((purchase) => {
      const d = new Date(purchase.purchaseTime);
      return d.getFullYear() === yyyy && d.getMonth() === mm && d.getDate() === dd;
    })
    .sort((left, right) => new Date(right.purchaseTime).getTime() - new Date(left.purchaseTime).getTime());

  const uniqueStudentsCount = new Set(purchases.map((purchase) => purchase.studentId)).size;
  const totalPurchases = purchases.length;
  const booksCount = purchases.filter((purchase) => purchase.contentType === "book").length;
  const videosCount = purchases.filter((purchase) => purchase.contentType === "video").length;

  return NextResponse.json({
    purchases,
    uniqueStudentsCount,
    totalPurchases,
    booksCount,
    videosCount,
    lastUpdated: new Date().toISOString(),
  });
}
