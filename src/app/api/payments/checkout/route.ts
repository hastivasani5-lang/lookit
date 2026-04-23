import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { appendPayment } from "@/lib/payment-store";
import { appendStudentBookActivity, appendStudentVideoActivity } from "@/lib/content-library-store";
import { appendStudentNotification } from "@/lib/student-notifications-store";

type CheckoutItem = {
  id: string;
  contentId?: string;
  professionalId: string;
  professionalName: string;
  title: string;
  subtitle: string;
  price: string;
  sourceUrl?: string;
  contentType: "book" | "video" | "course" | "lecture";
};

type CheckoutPayload = {
  items?: CheckoutItem[];
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
};

export const runtime = "nodejs";

function parsePrice(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const amount = Number.parseFloat(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

function formatAmount(value: number) {
  return `₹${value.toFixed(2)}`;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Only students can make purchases. Please log in with a student account." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as CheckoutPayload;
  const items = Array.isArray(body.items) ? body.items : [];

  if (!body.cardName?.trim() || !body.cardNumber?.trim() || !body.expiry?.trim() || !body.cvv?.trim()) {
    return NextResponse.json({ message: "Please complete all payment details." }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ message: "Cart is empty." }, { status: 400 });
  }

  const totalAmount = items.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const firstItem = items[0];
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  await appendPayment({
    id: `payment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    studentId: session.user.id,
    studentName: session.user.name ?? "Student",
    studentEmail: session.user.email ?? "-",
    professionalId: firstItem.professionalId,
    professionalName: firstItem.professionalName,
    plan: `${items.length} Item${items.length > 1 ? "s" : ""} Purchase`,
    amount: formatAmount(totalAmount),
    transactionId,
    paidAt: new Date().toISOString(),
    status: "completed",
    items: items.map((item) => ({
      contentId: item.contentId || item.id,
      title: item.title,
      contentType: item.contentType,
      price: item.price,
    })),
  });

  await Promise.all(
    items.map(async (item) => {
      if (item.contentType === "book") {
        await appendStudentBookActivity(session.user.id, {
          contentId: item.contentId || item.id,
          title: item.title,
          source: item.professionalName,
          amount: item.price,
          accessUrl: item.sourceUrl,
        });
        return;
      }

      if (item.contentType === "video") {
        await appendStudentVideoActivity(session.user.id, {
          contentId: item.contentId || item.id,
          title: item.title,
          provider: item.professionalName,
          amount: item.price,
          accessUrl: item.sourceUrl,
        });
      }
    }),
  );

  // Notify student about purchase
  const itemTitles = items.map((i) => `"${i.title}"`).join(", ");
  await appendStudentNotification(
    session.user.id,
    "purchase_confirmation",
    `Purchase successful! You bought ${itemTitles} for ${formatAmount(totalAmount)}. Transaction ID: ${transactionId}`,
  );

  return NextResponse.json({
    message: "Successful",
    transactionId,
  });
}