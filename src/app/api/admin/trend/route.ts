import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApprovalNotifications } from "@/lib/approval-notifications-store";
import { getProfessionalNotifications } from "@/lib/notifications-store";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const [approvalNotifs, alerts] = await Promise.all([
    getApprovalNotifications(),
    getProfessionalNotifications(),
  ]);

  // Build last 7 days labels + counts
  const now = new Date();
  const days: { label: string; date: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      date: d.toISOString().slice(0, 10), // YYYY-MM-DD
    });
  }

  const approvalValues = days.map(({ date }) =>
    approvalNotifs.filter(
      (n) => n.createdAt.slice(0, 10) === date && n.audience === "admin" && n.event === "decision",
    ).length,
  );

  const alertValues = days.map(({ date }) =>
    alerts.filter((n) => n.createdAt.slice(0, 10) === date).length,
  );

  return NextResponse.json({
    labels: days.map((d) => d.label),
    approvals: approvalValues,
    alerts: alertValues,
  });
}
