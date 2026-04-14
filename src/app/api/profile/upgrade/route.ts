import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { updateUserProfile } from "@/lib/user-store";
import type { ProfileUpgradeTier } from "@/types/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "professional") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const plan = typeof formData.get("plan") === "string" ? formData.get("plan")?.toString() : "pro";
    const normalizedTier: ProfileUpgradeTier =
      plan === "elite" || plan === "top"
        ? "top"
        : plan === "premium"
          ? "premium"
          : plan === "starter"
            ? "starter"
            : "pro";

    const months = normalizedTier === "top" ? 3 : normalizedTier === "premium" ? 2 : normalizedTier === "pro" ? 1 : 1;
    const boostedUntil = new Date();
    boostedUntil.setMonth(boostedUntil.getMonth() + months);

    const updatedUser = await updateUserProfile({
      id: session.user.id,
      profileBoostedUntil: boostedUntil.toISOString(),
      profileUpgradeTier: normalizedTier,
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