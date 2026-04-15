import { NextResponse } from "next/server";

import { buildShopCatalog } from "@/lib/shop-catalog";

export const runtime = "nodejs";

export async function GET() {
  const items = await buildShopCatalog();

  return NextResponse.json({
    items,
  });
}
