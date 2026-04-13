import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getPayments } from "@/lib/payment-store";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const payments = await getPayments();
  return NextResponse.json({ payments });
}
