import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteBanner, updateBannerStatus } from "@/lib/banners-store";
import { appendProfessionalNotification } from "@/lib/notifications-store";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  const body = (await request.json().catch(() => ({}))) as { status?: string };
  const status = body.status;

  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ message: "Invalid status. Must be 'approved' or 'rejected'." }, { status: 400 });
  }

  const updated = await updateBannerStatus(id, status);

  if (!updated) {
    return NextResponse.json({ message: "Banner not found." }, { status: 404 });
  }

  if (status === "rejected") {
    await appendProfessionalNotification({
      professionalId: updated.professionalId,
      professionalName: updated.professionalName,
      professionalEmail: updated.professionalEmail,
      summary: "Banner rejected",
      details: `Your banner "${updated.title}" was rejected.`,
      changedFields: ["Banner rejected"],
    });
  }

  return NextResponse.json({ banner: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteBanner(id);

  if (!deleted) {
    return NextResponse.json({ message: "Banner not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
