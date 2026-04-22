import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "advance-bookings.json");

export type AdvanceBooking = {
  id: string;
  classId: string;
  classTitle: string;
  classDate: string;
  classTime: string;
  platform: string;
  professionalId: string;
  professionalName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  message: string;
  bookedAt: string;
  status: "pending" | "confirmed" | "cancelled";
};

async function readStore(): Promise<AdvanceBooking[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(data: AdvanceBooking[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function getAllBookings(): Promise<AdvanceBooking[]> {
  return readStore();
}

export async function getBookingsForProfessional(professionalId: string): Promise<AdvanceBooking[]> {
  const all = await readStore();
  return all.filter((b) => b.professionalId === professionalId);
}

export async function addBooking(booking: Omit<AdvanceBooking, "id" | "bookedAt" | "status">): Promise<AdvanceBooking> {
  const all = await readStore();
  const newBooking: AdvanceBooking = {
    ...booking,
    id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    bookedAt: new Date().toISOString(),
    status: "pending",
  };
  all.unshift(newBooking);
  await writeStore(all);
  return newBooking;
}

export async function updateBookingStatus(id: string, status: AdvanceBooking["status"]): Promise<void> {
  const all = await readStore();
  const idx = all.findIndex((b) => b.id === id);
  if (idx >= 0) {
    all[idx].status = status;
    await writeStore(all);
  }
}
