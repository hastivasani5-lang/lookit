import { NextResponse } from "next/server";

import { buildPublicProfessional } from "@/lib/professional-display";
import { getApprovedProfessionalUsers } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  const professionals = await getApprovedProfessionalUsers();

  return NextResponse.json({
    professionals: professionals.map((user, index) => buildPublicProfessional(user, index)),
  });
}