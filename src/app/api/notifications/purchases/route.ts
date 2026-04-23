import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPayments } from "@/lib/payment-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "professional") {
      return NextResponse.json({ data: [] });
    }

    const allPayments = await getPayments();

    // Filter for this professional only
    const myPayments = allPayments
      .filter((p) => p.professionalId === session.user.id)
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

    const data = myPayments.map((p) => ({
      id: p.id,
      studentName: p.studentName,
      studentEmail: p.studentEmail,
      professionalId: p.professionalId,
      plan: p.plan,
      amount: p.amount,
      paidAt: p.paidAt,
      items: p.items?.map((item) => ({
        title: item.title,
        contentType: item.contentType,
      })) ?? [],
    }));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
