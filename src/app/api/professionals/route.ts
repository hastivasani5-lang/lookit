import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { buildPublicProfessional } from "@/lib/professional-display";
import { getProfessionalUsers, getUserById } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id && session.user.role === "professional") {
    const professional = await getUserById(session.user.id);

    if (!professional || professional.role !== "professional" || professional.approvalStatus === "rejected") {
      return NextResponse.json({ professionals: [] });
    }

    return NextResponse.json({
      professionals: [buildPublicProfessional(professional)],
    });
  }

  const professionals = await getProfessionalUsers();
  const visibleProfessionals = professionals.filter(
    (user) => user.role === "professional" && user.approvalStatus !== "rejected",
  );

  return NextResponse.json({
    professionals: visibleProfessionals.map((user, index) => buildPublicProfessional(user, index)),
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
    },
  });
}