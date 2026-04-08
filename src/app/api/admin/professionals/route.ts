import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getProfessionalUsers, setProfessionalApproval } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const professionals = await getProfessionalUsers();

  return NextResponse.json({
    professionals: professionals.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      specialization: user.specialization ?? "-",
      provider: user.provider,
      approvalStatus: user.approvalStatus,
      approvalReviewedBy: user.approvalReviewedBy ?? null,
      approvalReviewedAt: user.approvalReviewedAt ?? null,
      approvalNote: user.approvalNote ?? null,
      createdAt: user.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    professionalId?: string;
    status?: "approved" | "rejected";
    note?: string;
    reviewedBy?: string;
  };

  if (!body.professionalId) {
    return NextResponse.json({ message: "Professional ID is required." }, { status: 400 });
  }

  if (body.status !== "approved" && body.status !== "rejected") {
    return NextResponse.json({ message: "Please choose a valid approval status." }, { status: 400 });
  }

  const updatedUser = await setProfessionalApproval(
    body.professionalId,
    body.status,
    body.reviewedBy?.trim() || "Admin",
    body.note,
  );

  return NextResponse.json({
    message: `Professional ${body.status}.`,
    professional: {
      id: updatedUser.id,
      approvalStatus: updatedUser.approvalStatus,
      approvalReviewedBy: updatedUser.approvalReviewedBy ?? null,
      approvalReviewedAt: updatedUser.approvalReviewedAt ?? null,
      approvalNote: updatedUser.approvalNote ?? null,
    },
  });
}
