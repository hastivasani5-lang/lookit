import { NextResponse } from "next/server";
import { buildShopCatalog } from "@/lib/shop-catalog";
import { categories } from "@/data/categories";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Validate category slug
  const category = categories.find((cat) => cat.slug === slug);
  if (!category) {
    return NextResponse.json(
      { error: "Category not found", items: [] },
      { status: 404 }
    );
  }

  const allItems = await buildShopCatalog();

  // Filter items whose book.category matches this category title (case-insensitive)
  const filtered = allItems.filter((item) => {
    const itemCat = (item.category ?? "").toLowerCase().trim();
    const catTitle = category.title.toLowerCase().trim();
    return itemCat === catTitle;
  });

  return NextResponse.json({
    category: { title: category.title, slug: category.slug },
    items: filtered,
  });
}
