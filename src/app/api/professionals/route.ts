import { NextResponse } from "next/server";

import { buildPublicProfessional } from "@/lib/professional-display";
import { getProfessionalUsers } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  const professionals = await getProfessionalUsers();
  const approvedProfessionals = professionals.filter((user) => user.role === "professional" && user.approvalStatus === "approved");

  return NextResponse.json({
    professionals: approvedProfessionals.map((user, index) => buildPublicProfessional(user, index)),
  });
}