import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApprovalNotifications } from "@/lib/approval-notifications-store";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const notifications = await getApprovalNotifications("admin");

  return NextResponse.json({ notifications });
}
