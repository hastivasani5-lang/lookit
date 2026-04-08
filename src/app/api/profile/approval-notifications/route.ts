import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { getApprovalNotifications } from "@/lib/approval-notifications-store";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const notifications = await getApprovalNotifications("professional");
  const userNotifications = notifications.filter((notification) => notification.professionalId === session.user.id);

  return NextResponse.json({ notifications: userNotifications });
}
