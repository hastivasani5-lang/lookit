import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getWishlist, toggleWishlistItem, type WishlistItem } from "@/lib/wishlist-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const items = await getWishlist(session.user.id);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as Partial<Omit<WishlistItem, "addedAt">>;
  if (!body.id || !body.title) {
    return NextResponse.json({ message: "Missing item data." }, { status: 400 });
  }
  const result = await toggleWishlistItem(session.user.id, {
    id: body.id,
    title: body.title,
    price: body.price ?? "",
    imageUrl: body.imageUrl ?? "",
    contentType: body.contentType ?? "book",
    professionalName: body.professionalName ?? "",
    slug: body.slug ?? "",
  });
  return NextResponse.json(result);
}
