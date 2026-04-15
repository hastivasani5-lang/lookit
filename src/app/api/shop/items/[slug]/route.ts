import { NextResponse } from "next/server";

import { getShopCatalogItemBySlug } from "@/lib/shop-catalog";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!slug?.trim()) {
    return NextResponse.json({ message: "Invalid item slug." }, { status: 400 });
  }

  const item = await getShopCatalogItemBySlug(slug);

  if (!item) {
    return NextResponse.json({ message: "Item not found." }, { status: 404 });
  }

  return NextResponse.json({ item });
}
