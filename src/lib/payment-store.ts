import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");

export type PaymentActorRole = "student" | "professional";
export type PaymentStatus = "completed" | "pending";

export type PaymentRecord = {
  id: string;
  actorId: string;
  actorRole: PaymentActorRole;
  actorName: string;
  actorEmail: string;
  professionalId?: string;
  professionalName?: string;
  category: "content" | "profile-upgrade";
  itemType: "book" | "video" | "course" | "lecture" | "upgrade";
  itemTitle: string;
  amount: string;
  transactionId: string;
  paidAt: string;
  status: PaymentStatus;
};

async function ensurePaymentsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(PAYMENTS_FILE);
  } catch {
    await fs.writeFile(PAYMENTS_FILE, "[]", "utf-8");
  }
}

async function readPayments(): Promise<PaymentRecord[]> {
  await ensurePaymentsFile();
  const raw = await fs.readFile(PAYMENTS_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(
          (payment): payment is PaymentRecord =>
            typeof payment?.id === "string" &&
            typeof payment?.actorId === "string" &&
            (payment?.actorRole === "student" || payment?.actorRole === "professional") &&
            typeof payment?.actorName === "string" &&
            typeof payment?.actorEmail === "string" &&
            (payment?.category === "content" || payment?.category === "profile-upgrade") &&
            (payment?.itemType === "book" ||
              payment?.itemType === "video" ||
              payment?.itemType === "course" ||
              payment?.itemType === "lecture" ||
              payment?.itemType === "upgrade") &&
            typeof payment?.itemTitle === "string" &&
            typeof payment?.amount === "string" &&
            typeof payment?.transactionId === "string" &&
            typeof payment?.paidAt === "string" &&
            (payment?.status === "completed" || payment?.status === "pending"),
        )
      : [];
  } catch {
    return [];
  }
}

async function writePayments(payments: PaymentRecord[]) {
  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(payments, null, 2), "utf-8");
}

export async function getAllPayments() {
  const payments = await readPayments();
  return payments.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
}

export async function appendPaymentRecord(
  input: Omit<PaymentRecord, "id" | "transactionId" | "paidAt" | "status">,
) {
  const payments = await readPayments();

  const payment: PaymentRecord = {
    id: `payment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actorId: input.actorId,
    actorRole: input.actorRole,
    actorName: input.actorName,
    actorEmail: input.actorEmail,
    professionalId: input.professionalId,
    professionalName: input.professionalName,
    category: input.category,
    itemType: input.itemType,
    itemTitle: input.itemTitle,
    amount: input.amount,
    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    paidAt: new Date().toISOString(),
    status: "completed",
  };

  payments.unshift(payment);
  await writePayments(payments);
  return payment;
}
