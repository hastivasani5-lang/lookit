import { NextResponse } from "next/server";
import fs from "fs";

const DATA_PATH = "data/payments.json";

export async function GET() {
  // Read all purchases
  let paymentsRaw = [];
  try {
    const file = fs.readFileSync(DATA_PATH, "utf8");
    if (file.trim().startsWith("{")) {
      // If root is object, try to get .payments array
      const obj = JSON.parse(file);
      paymentsRaw = Array.isArray(obj.payments) ? obj.payments : [];
    } else if (file.trim().startsWith("[")) {
      paymentsRaw = JSON.parse(file);
    } else {
      paymentsRaw = [];
    }
  } catch (e) { paymentsRaw = []; }
  // Only return purchases from the last 24 hours
  const now = Date.now();
  const payments = paymentsRaw.filter((p: any) => p && p.timestamp && now - new Date(p.timestamp).getTime() < 24 * 60 * 60 * 1000);
  return NextResponse.json({ data: payments });
}
