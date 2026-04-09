import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  addProfessionalBook,
  addProfessionalVideo,
  deleteProfessionalBook,
  deleteProfessionalVideo,
  getProfessionalLibrary,
} from "@/lib/content-library-store";

export const runtime = "nodejs";

type AddBookPayload = {
  kind: "book";
  name: string;
  category: string;
  mrp: string;
  imageUrl: string;
  url: string;
  source: "file" | "amazon";
  fileName: string;
  sizeLabel: string;
};

type AddVideoPayload = {
  kind: "video";
  name: string;
  url: string;
  source: "file" | "youtube";
  sizeLabel: string;
};

type DeletePayload = {
  kind: "book" | "video";
  id: string;
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "professional") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const library = await getProfessionalLibrary(session.user.id);

  return NextResponse.json({
    books: library.books,
    videos: library.videos,
    categories: library.categories,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "professional") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    kind?: "book" | "video";
    [key: string]: unknown;
  };

  if (body.kind === "book") {
    const payload = body as Partial<AddBookPayload>;

    if (!payload.name?.trim() || !payload.category?.trim() || !payload.mrp?.trim()) {
      return NextResponse.json({ message: "Missing book details." }, { status: 400 });
    }

    const book = await addProfessionalBook(session.user.id, {
      name: payload.name.trim(),
      category: payload.category.trim(),
      mrp: payload.mrp.trim(),
      imageUrl: payload.imageUrl?.trim() || "/books.png",
      url: payload.url?.trim() || "",
      source: payload.source === "amazon" ? "amazon" : "file",
      fileName: payload.fileName?.trim() || "Uploaded file",
      sizeLabel: payload.sizeLabel?.trim() || "-",
    });

    return NextResponse.json({ book });
  }

  if (body.kind === "video") {
    const payload = body as Partial<AddVideoPayload>;

    if (!payload.name?.trim()) {
      return NextResponse.json({ message: "Video name is required." }, { status: 400 });
    }

    const video = await addProfessionalVideo(session.user.id, {
      name: payload.name.trim(),
      url: payload.url?.trim() || "",
      source: payload.source === "youtube" ? "youtube" : "file",
      sizeLabel: payload.sizeLabel?.trim() || "-",
    });

    return NextResponse.json({ video });
  }

  return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "professional") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Partial<DeletePayload>;

  if (!body.id || !body.kind) {
    return NextResponse.json({ message: "Missing delete payload." }, { status: 400 });
  }

  if (body.kind === "book") {
    await deleteProfessionalBook(session.user.id, body.id);
    return NextResponse.json({ message: "Book removed." });
  }

  if (body.kind === "video") {
    await deleteProfessionalVideo(session.user.id, body.id);
    return NextResponse.json({ message: "Video removed." });
  }

  return NextResponse.json({ message: "Invalid delete payload." }, { status: 400 });
}
