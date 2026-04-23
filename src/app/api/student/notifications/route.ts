import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  getStudentNotifications,
  markAllStudentNotificationsRead,
  deleteStudentNotification,
} from "@/lib/student-notifications-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const notifications = await getStudentNotifications(session.user.id);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { markAllRead?: boolean };
  if (!body.markAllRead) {
    return NextResponse.json({ message: "Bad request." }, { status: 400 });
  }
  await markAllStudentNotificationsRead(session.user.id);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ message: "Missing notification id." }, { status: 400 });
  }
  await deleteStudentNotification(session.user.id, body.id);
  return NextResponse.json({ success: true });
}
