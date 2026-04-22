import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  addBooking,
  getBookingsForProfessional,
  updateBookingStatus,
} from "@/lib/advance-bookings-store";

export const runtime = "nodejs";

// GET - professional sees their bookings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "professional") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const bookings = await getBookingsForProfessional(session.user.id);
  return NextResponse.json({ bookings });
}

// POST - anyone can book (no auth required)
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    classId?: string;
    classTitle?: string;
    classDate?: string;
    classTime?: string;
    platform?: string;
    professionalId?: string;
    professionalName?: string;
    studentName?: string;
    studentEmail?: string;
    studentPhone?: string;
    message?: string;
  };

  if (!body.studentName?.trim() || !body.studentEmail?.trim() || !body.classId) {
    return NextResponse.json({ message: "Name, email and class are required." }, { status: 400 });
  }

  const booking = await addBooking({
    classId: body.classId,
    classTitle: body.classTitle || "",
    classDate: body.classDate || "",
    classTime: body.classTime || "",
    platform: body.platform || "",
    professionalId: body.professionalId || "",
    professionalName: body.professionalName || "",
    studentName: body.studentName.trim(),
    studentEmail: body.studentEmail.trim(),
    studentPhone: body.studentPhone?.trim() || "",
    message: body.message?.trim() || "",
  });

  return NextResponse.json({ booking, message: "Booking confirmed!" });
}

// PATCH - update status
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "professional") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    status?: "pending" | "confirmed" | "cancelled";
  };

  if (!body.id || !body.status) {
    return NextResponse.json({ message: "ID and status required." }, { status: 400 });
  }

  await updateBookingStatus(body.id, body.status);
  return NextResponse.json({ message: "Status updated." });
}
