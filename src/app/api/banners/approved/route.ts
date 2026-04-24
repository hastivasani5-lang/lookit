import { NextResponse } from "next/server";

import { getApprovedBanners } from "@/lib/banners-store";

export const runtime = "nodejs";

export async function GET() {
  const banners = await getApprovedBanners();
  return NextResponse.json({ banners });
}
