import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAllUsers } from "@/lib/user-store";
import { getAllLibraries } from "@/lib/content-library-store";

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

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const [users, libraries] = await Promise.all([getAllUsers(), getAllLibraries()]);

  const professionals = users
    .filter((user) => user.role === "professional")
    .map((user) => {
      const library = libraries.professionals[user.id] ?? { books: [], videos: [], categories: [] };
      const categories = Array.from(new Set([...library.categories, ...splitCategories(user.specialization)]));

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        categories,
        booksCount: library.books.length,
        videosCount: library.videos.length,
        lastUpdated: library.books[0]?.createdAt || library.videos[0]?.createdAt || user.createdAt,
      };
    });

  const students = users
    .filter((user) => user.role === "student")
    .map((user) => {
      const library = libraries.students[user.id] ?? { purchasedBooks: [], watchedVideos: [] };

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        purchasedBooksCount: library.purchasedBooks.length,
        watchedVideosCount: library.watchedVideos.length,
        lastActivity: library.purchasedBooks[0]?.purchasedAt || library.watchedVideos[0]?.watchedAt || user.createdAt,
      };
    });

  return NextResponse.json({ professionals, students });
}
