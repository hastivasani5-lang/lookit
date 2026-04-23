import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import {
  addProfessionalBook,
  addProfessionalVideo,
  deleteProfessionalVideo,
  getProfessionalLibrary,
} from "@/lib/content-library-store";
import { getFollowerIds } from "@/lib/follows-store";
import { appendStudentNotification } from "@/lib/student-notifications-store";

async function notifyFollowers(professionalId: string, type: "new_content" | "announcement", message: string) {
  try {
    const ids = await getFollowerIds(professionalId);
    await Promise.all(ids.map((sid) => appendStudentNotification(sid, type, message)));
  } catch (err) {
    console.error("[notifyFollowers] fan-out error:", err);
  }
}

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
  mrp: string;
  url: string;
  source: "file" | "youtube";
  sizeLabel: string;
  level?: string;
};

type DeletePayload = {
  kind: "book" | "video";
  id: string;
};

async function getAuthorizedProfessionalId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const user = await getUserById(session.user.id);
  if (!user || user.role !== "professional") {
    return null;
  }

  return user.id;
}

export async function GET() {
  const professionalId = await getAuthorizedProfessionalId();

  if (!professionalId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const library = await getProfessionalLibrary(professionalId);
  return NextResponse.json({
    books: library.books,
    videos: library.videos,
    categories: library.categories,
  });
}

export async function POST(request: Request) {
  const professionalId = await getAuthorizedProfessionalId();

  if (!professionalId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";

  // Handle multipart form (file upload removed — use URL-based input instead)
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const kind = formData.get("kind");

    if (kind !== "book") {
      return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
    }

    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const category = (formData.get("category") as string | null)?.trim() ?? "";
    const mrp = (formData.get("mrp") as string | null)?.trim() ?? "";
    const url = (formData.get("url") as string | null)?.trim() ?? "";
    const source = formData.get("source") === "amazon" ? "amazon" : ("file" as const);
    const fileName = (formData.get("fileName") as string | null)?.trim() ?? "Uploaded file";
    const sizeLabel = (formData.get("sizeLabel") as string | null)?.trim() ?? "-";
    const imageUrl = (formData.get("imageLink") as string | null)?.trim() ?? "";

    if (!name || !category || !mrp) {
      return NextResponse.json({ message: "Missing book details." }, { status: 400 });
    }

    if (!imageUrl) {
      return NextResponse.json({ message: "Book image URL is required." }, { status: 400 });
    }

    const book = await addProfessionalBook(professionalId, {
      name,
      category,
      mrp,
      imageUrl,
      url,
      fileUrl: url,
      source,
      fileName,
      sizeLabel,
    });

    await notifyFollowers(professionalId, "new_content", `New book: "${name}" — ₹${mrp}`);
    return NextResponse.json({ book });
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

    if (!payload.imageUrl?.trim()) {
      return NextResponse.json({ message: "Book image is required." }, { status: 400 });
    }

    const book = await addProfessionalBook(professionalId, {
      name: payload.name.trim(),
      category: payload.category.trim(),
      mrp: payload.mrp.trim(),
      imageUrl: payload.imageUrl.trim(),
      url: payload.url?.trim() || "",
      source: payload.source === "amazon" ? "amazon" : "file",
      fileName: payload.fileName?.trim() || "Uploaded file",
      sizeLabel: payload.sizeLabel?.trim() || "-",
    });

    await notifyFollowers(professionalId, "new_content", `New book: "${payload.name.trim()}" — ₹${payload.mrp.trim()}`);
    return NextResponse.json({ book });
  }

  if (body.kind === "video") {
    const payload = body as Partial<AddVideoPayload>;

    if (!payload.name?.trim() || !payload.mrp?.trim()) {
      return NextResponse.json({ message: "Video name and MRP are required." }, { status: 400 });
    }

    const video = await addProfessionalVideo(professionalId, {
      name: payload.name.trim(),
      mrp: payload.mrp.trim(),
      url: payload.url?.trim() || "",
      source: payload.source === "youtube" ? "youtube" : "file",
      sizeLabel: payload.sizeLabel?.trim() || "-",
      level: payload.level?.trim() || "",
    });

    await notifyFollowers(professionalId, "new_content", `New video: "${payload.name.trim()}" — ₹${payload.mrp.trim()}`);
    return NextResponse.json({ video });
  }

  return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
}


export async function DELETE(request: Request) {
  const professionalId = await getAuthorizedProfessionalId();

  if (!professionalId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Partial<DeletePayload>;

  if (!body.id || !body.kind) {
    return NextResponse.json({ message: "Missing delete payload." }, { status: 400 });
  }

  if (body.kind === "book") {
    return NextResponse.json({ message: "Books cannot be deleted once added." }, { status: 403 });
  }

  if (body.kind === "video") {
    await deleteProfessionalVideo(professionalId, body.id);
    return NextResponse.json({ message: "Video removed." });
  }

  return NextResponse.json({ message: "Invalid delete payload." }, { status: 400 });
}
