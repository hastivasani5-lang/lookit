import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAllUsers } from "@/lib/user-store";
import { getPayments } from "@/lib/payment-store";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const [users, payments] = await Promise.all([getAllUsers(), getPayments()]);

  const studentCount = users.filter((u) => u.role === "student").length;
  const professionalCount = users.filter((u) => u.role === "professional").length;
  const transactionCount = payments.length;

  return NextResponse.json({ studentCount, professionalCount, transactionCount });
}
