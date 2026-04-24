import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { createBanner, getBannersByProfessional } from "@/lib/banners-store";
import { getUserById } from "@/lib/user-store";
import { appendProfessionalNotification } from "@/lib/notifications-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const banners = await getBannersByProfessional(session.user.id);
  return NextResponse.json({ banners });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as { imageUrl?: string };
  const imageUrl = body.imageUrl?.trim() ?? "";

  if (!imageUrl) {
    return NextResponse.json({ message: "Banner image URL is required." }, { status: 400 });
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 401 });
  }

  try {
    const banner = await createBanner({
      professionalId: user.id,
      professionalName: user.name,
      professionalEmail: user.email,
      title: "",
      description: "",
      link: imageUrl,
      imageUrl,
    });

    try {
      await appendProfessionalNotification({
        professionalId: user.id,
        professionalName: user.name,
        professionalEmail: user.email ?? "",
        summary: "Uploaded a new banner for approval",
        details: `Banner image submitted and pending admin review.`,
        changedFields: ["banner_upload"],
      });
    } catch { /* notification must never break the main response */ }

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create banner.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
