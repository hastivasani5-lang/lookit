import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type OrderPayload = {
  amount: number;
  items: Array<{
    id: string;
    title: string;
    price: string;
  }>;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json(
      { message: "Only students can make purchases." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as OrderPayload;
  const { amount, items } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { message: "Invalid amount." },
      { status: 400 }
    );
  }

  if (!items || items.length === 0) {
    return NextResponse.json(
      { message: "No items in order." },
      { status: 400 }
    );
  }

  try {
    // Convert amount to paise (Razorpay uses paise)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          studentId: session.user.id,
          studentName: session.user.name,
          studentEmail: session.user.email,
          itemCount: items.length,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      const error = await razorpayResponse.json();
      console.error("Razorpay error:", error);
      return NextResponse.json(
        { message: "Failed to create payment order." },
        { status: 500 }
      );
    }

    const order = await razorpayResponse.json();

    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment order error:", error);
    return NextResponse.json(
      { message: "Failed to process payment." },
      { status: 500 }
    );
  }
}
