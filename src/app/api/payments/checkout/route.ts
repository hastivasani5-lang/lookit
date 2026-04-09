import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { appendPaymentRecord } from "@/lib/payment-store";
import { recordStudentBookPurchase, recordStudentVideoActivity } from "@/lib/content-library-store";

type CheckoutItem = {
  professionalId: string;
  professionalName: string;
  title: string;
  price: string;
  contentType: "book" | "video" | "course" | "lecture";
};

function parseAmount(price: string) {
  const amount = Number.parseFloat(price.replace(/[₹$,\s]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    items?: CheckoutItem[];
    cardName?: string;
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
  };

  const items = Array.isArray(body.items) ? body.items : [];

  if (!body.cardName?.trim() || !body.cardNumber?.trim() || !body.expiry?.trim() || !body.cvv?.trim()) {
    return NextResponse.json({ message: "Payment details are required." }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ message: "No items to checkout." }, { status: 400 });
  }

  for (const item of items) {
    const amount = parseAmount(item.price);

    if (amount <= 0) {
      continue;
    }

    await appendPaymentRecord({
      actorId: session.user.id,
      actorRole: "student",
      actorName: session.user.name ?? "Student",
      actorEmail: session.user.email ?? "",
      professionalId: item.professionalId,
      professionalName: item.professionalName,
      category: "content",
      itemType: item.contentType,
      itemTitle: item.title,
      amount: `₹${amount.toFixed(2)}`,
    });

    if (item.contentType === "book") {
      await recordStudentBookPurchase(session.user.id, {
        title: item.title,
        source: item.professionalName,
        amount: `₹${amount.toFixed(2)}`,
      });
    }

    if (item.contentType === "video") {
      await recordStudentVideoActivity(session.user.id, {
        title: item.title,
        provider: item.professionalName,
      });
    }
  }

  return NextResponse.json({ message: "Payment successful." });
}
