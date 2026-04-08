import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserById } from "@/lib/user-store";
import { getProfessionalLibrary } from "@/lib/content-library-store";

export const runtime = "nodejs";

function splitCategories(specialization: string | undefined) {
  if (!specialization) {
    return [];
  }

  return specialization
    .split(/[,|/]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const user = await getUserById(id);

  if (!user || user.role !== "professional") {
    return NextResponse.json({ message: "Professional not found." }, { status: 404 });
  }

  const library = await getProfessionalLibrary(id);
  const categories = Array.from(new Set([...library.categories, ...splitCategories(user.specialization)]));

  return NextResponse.json({
    professional: {
      id: user.id,
      name: user.name,
      email: user.email,
      specialization: user.specialization ?? "",
      contactNumber: user.contactNumber ?? "",
      location: user.location ?? "",
      createdAt: user.createdAt,
      categories,
      books: library.books,
      videos: library.videos,
    },
  });
}
