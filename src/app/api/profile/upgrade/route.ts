import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { updateUserProfile } from "@/lib/user-store";
import { appendPaymentRecord } from "@/lib/payment-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const plan = typeof formData.get("plan") === "string" ? formData.get("plan")?.toString() : "pro";
    const months = plan === "elite" ? 3 : plan === "premium" ? 2 : plan === "pro" ? 1 : 1;
    const amountByPlan: Record<string, string> = {
      starter: "₹9.00",
      pro: "₹19.00",
      premium: "₹39.00",
      elite: "₹59.00",
    };
    const boostedUntil = new Date();
    boostedUntil.setMonth(boostedUntil.getMonth() + months);

    const updatedUser = await updateUserProfile({
      id: session.user.id,
      profileBoostedUntil: boostedUntil.toISOString(),
    });

    await appendPaymentRecord({
      actorId: session.user.id,
      actorRole: "professional",
      actorName: session.user.name ?? updatedUser.name,
      actorEmail: session.user.email ?? updatedUser.email,
      category: "profile-upgrade",
      itemType: "upgrade",
      itemTitle: `${plan} profile boost`,
      amount: amountByPlan[plan] ?? amountByPlan.pro,
    });

    return NextResponse.json({
      message: "Payment successful. Your profile has been upgraded.",
      user: {
        id: updatedUser.id,
        profileBoostedUntil: updatedUser.profileBoostedUntil ?? null,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process payment.";
    return NextResponse.json({ message }, { status: 400 });
  }
}