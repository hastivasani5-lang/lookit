import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/user-store";
import { getPayments } from "@/lib/payment-store";
import { getProfessionalNotifications } from "@/lib/notifications-store";

export const runtime = "nodejs";

export type AdminActivityNotification = {
  id: string;
  type: "new_student" | "new_professional" | "new_payment" | "profile_update" | "new_content" | "new_booking" | "new_class" | "banner_upload";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const [users, payments, profileNotifications] = await Promise.all([
    getAllUsers(),
    getPayments(),
    getProfessionalNotifications(),
  ]);

  const notifications: AdminActivityNotification[] = [];

  // New student registrations (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  for (const user of users) {
    const createdAt = new Date(user.createdAt);
    if (createdAt < sevenDaysAgo) continue;

    if (user.role === "student") {
      notifications.push({
        id: `user-${user.id}`,
        type: "new_student",
        title: "New Student Registered",
        message: `${user.name} (${user.email}) joined as a student.`,
        createdAt: user.createdAt,
        read: false,
      });
    } else if (user.role === "professional") {
      notifications.push({
        id: `user-${user.id}`,
        type: "new_professional",
        title: "New Professional Registered",
        message: `${user.name} (${user.email}) registered as a professional.`,
        createdAt: user.createdAt,
        read: false,
      });
    }
  }

  // New payments (last 7 days)
  for (const payment of payments) {
    const paidAt = new Date(payment.paidAt);
    if (paidAt < sevenDaysAgo) continue;
    notifications.push({
      id: `payment-${payment.id}`,
      type: "new_payment",
      title: "New Plan Purchase",
      message: `${payment.studentName} purchased "${payment.plan}" from ${payment.professionalName} — ${payment.amount}.`,
      createdAt: payment.paidAt,
      read: false,
    });
  }

  // Profile updates / content uploads from professionals
  for (const n of profileNotifications) {
    const createdAt = new Date(n.createdAt);
    if (createdAt < sevenDaysAgo) continue;

    const fields = n.changedFields ?? [];

    if (fields.includes("advance_booking")) {
      notifications.push({
        id: `profile-${n.id}`,
        type: "new_booking",
        title: "New Advance Booking",
        message: `${n.professionalName}: ${n.summary}`,
        createdAt: n.createdAt,
        read: false,
      });
    } else if (fields.includes("upcoming_class")) {
      notifications.push({
        id: `profile-${n.id}`,
        type: "new_class",
        title: "New Class Scheduled",
        message: `${n.professionalName}: ${n.summary}`,
        createdAt: n.createdAt,
        read: false,
      });
    } else if (fields.includes("banner_upload")) {
      notifications.push({
        id: `profile-${n.id}`,
        type: "banner_upload",
        title: "Banner Uploaded for Approval",
        message: `${n.professionalName}: ${n.summary}`,
        createdAt: n.createdAt,
        read: false,
      });
    } else {
      const isContent =
        n.summary?.toLowerCase().includes("book") ||
        n.summary?.toLowerCase().includes("video") ||
        n.details?.toLowerCase().includes("book") ||
        n.details?.toLowerCase().includes("video");

      notifications.push({
        id: `profile-${n.id}`,
        type: isContent ? "new_content" : "profile_update",
        title: isContent ? "New Content Added" : "Profile Updated",
        message: `${n.professionalName}: ${n.summary || n.details || "Profile changed."}`,
        createdAt: n.createdAt,
        read: false,
      });
    }
  }

  // Sort newest first
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ notifications: notifications.slice(0, 50) });
}
