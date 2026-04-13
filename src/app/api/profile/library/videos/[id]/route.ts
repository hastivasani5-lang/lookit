import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import { getPayments } from "@/lib/payment-store";
import {
  deleteProfessionalVideo,
  getProfessionalVideoById,
  updateProfessionalVideo,
} from "@/lib/content-library-store";

export const runtime = "nodejs";

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

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const professionalId = await getAuthorizedProfessionalId();
  if (!professionalId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const video = await getProfessionalVideoById(professionalId, id);

  if (!video) {
    return NextResponse.json({ message: "Video not found." }, { status: 404 });
  }

  const payments = await getPayments();
  const purchases = payments
    .filter((payment) => payment.professionalId === professionalId && payment.status === "completed")
    .flatMap((payment) => {
      const matchingItems = payment.items.filter(
        (item) =>
          item.contentType === "video" &&
          ((item.contentId && item.contentId === video.id) || (!item.contentId && item.title === video.name)),
      );

      return matchingItems.map((item) => ({
        studentId: payment.studentId,
        username: payment.studentName,
        timeline: payment.paidAt,
        paymentStatus: payment.status,
        amount: item.price,
        transactionId: payment.transactionId,
      }));
    });

  const purchasedUsersCount = new Set(purchases.map((purchase) => purchase.studentId)).size;

  return NextResponse.json({
    video,
    purchasedUsersCount,
    purchases,
  });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const professionalId = await getAuthorizedProfessionalId();
  if (!professionalId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    mrp?: string;
    url?: string;
  };

  const payload = {
    name: typeof body.name === "string" ? body.name.trim() : undefined,
    mrp: typeof body.mrp === "string" ? body.mrp.trim() : undefined,
    url: typeof body.url === "string" ? body.url.trim() : undefined,
  };

  const updateInput: {
    name?: string;
    mrp?: string;
    url?: string;
  } = {};

  if (payload.name) updateInput.name = payload.name;
  if (payload.mrp) updateInput.mrp = payload.mrp;
  if (payload.url) updateInput.url = payload.url;

  if (payload.mrp && (!Number.isFinite(Number(payload.mrp)) || Number(payload.mrp) <= 0)) {
    return NextResponse.json({ message: "Please provide a valid MRP." }, { status: 400 });
  }

  const updated = await updateProfessionalVideo(professionalId, id, updateInput);
  if (!updated) {
    return NextResponse.json({ message: "Video not found." }, { status: 404 });
  }

  return NextResponse.json({ video: updated });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const professionalId = await getAuthorizedProfessionalId();
  if (!professionalId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getProfessionalVideoById(professionalId, id);

  if (!existing) {
    return NextResponse.json({ message: "Video not found." }, { status: 404 });
  }

  await deleteProfessionalVideo(professionalId, id);
  return NextResponse.json({ message: "Video deleted." });
}
