import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  addProfessionalCategory,
  addProfessionalBook,
  addProfessionalVideo,
  deleteProfessionalCategory,
  deleteProfessionalBook,
  deleteProfessionalVideo,
  getProfessionalLibrary,
} from "@/lib/content-library-store";

export const runtime = "nodejs";

const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "library");

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
};

type AddCategoryPayload = {
  kind: "category";
  category: string;
};

type DeletePayload = {
  kind: "book" | "video" | "category";
  id: string;
};

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function saveUploadedFile(
  professionalId: string,
  section: "books" | "videos" | "images",
  file: File,
) {
  const extension = file.name.includes(".") ? `.${sanitizeFileName(file.name.split(".").pop() || "")}` : "";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const directory = path.join(PUBLIC_UPLOADS_DIR, professionalId, section);
  await fs.mkdir(directory, { recursive: true });
  const filePath = path.join(directory, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return `/uploads/library/${professionalId}/${section}/${fileName}`;
}

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

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const kind = typeof formData.get("kind") === "string" ? formData.get("kind")?.toString() : "";

    if (kind === "book") {
      const name = typeof formData.get("name") === "string" ? formData.get("name")?.toString().trim() : "";
      const category = typeof formData.get("category") === "string" ? formData.get("category")?.toString().trim() : "";
      const mrp = typeof formData.get("mrp") === "string" ? formData.get("mrp")?.toString().trim() : "";
      const imageUrlInput =
        typeof formData.get("imageUrl") === "string" ? formData.get("imageUrl")?.toString().trim() : "";
      const file = formData.get("file");
      const imageFile = formData.get("imageFile");

      if (!name || !category || !mrp || !(file instanceof File) || file.size <= 0) {
        return NextResponse.json({ message: "Missing book upload details." }, { status: 400 });
      }

      const parsedMrp = Number(mrp);
      if (!Number.isFinite(parsedMrp) || parsedMrp < 0) {
        return NextResponse.json({ message: "Please provide a valid book MRP." }, { status: 400 });
      }

      const bookUrl = await saveUploadedFile(session.user.id, "books", file);
      const imageUrl =
        imageFile instanceof File && imageFile.size > 0
          ? await saveUploadedFile(session.user.id, "images", imageFile)
          : imageUrlInput || "/books.png";

      const book = await addProfessionalBook(session.user.id, {
        name,
        category,
        mrp: parsedMrp.toFixed(2),
        imageUrl,
        url: bookUrl,
        source: "file",
        fileName: file.name,
        sizeLabel: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });

      return NextResponse.json({ book });
    }

    if (kind === "video") {
      const name = typeof formData.get("name") === "string" ? formData.get("name")?.toString().trim() : "";
      const mrp = typeof formData.get("mrp") === "string" ? formData.get("mrp")?.toString().trim() : "0";
      const file = formData.get("file");

      if (!name || !(file instanceof File) || file.size <= 0) {
        return NextResponse.json({ message: "Missing video upload details." }, { status: 400 });
      }

      const parsedMrp = Number(mrp);
      if (!Number.isFinite(parsedMrp) || parsedMrp < 0) {
        return NextResponse.json({ message: "Please provide a valid video MRP." }, { status: 400 });
      }

      const videoUrl = await saveUploadedFile(session.user.id, "videos", file);

      const video = await addProfessionalVideo(session.user.id, {
        name,
        mrp: parsedMrp.toFixed(2),
        url: videoUrl,
        source: "file",
        sizeLabel: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });

      return NextResponse.json({ video });
    }
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

    const parsedMrp = Number(payload.mrp?.trim() || "0");
    if (!Number.isFinite(parsedMrp) || parsedMrp < 0) {
      return NextResponse.json({ message: "Please provide a valid video MRP." }, { status: 400 });
    }

    const video = await addProfessionalVideo(session.user.id, {
      name: payload.name.trim(),
      mrp: parsedMrp.toFixed(2),
      url: payload.url?.trim() || "",
      source: payload.source === "youtube" ? "youtube" : "file",
      sizeLabel: payload.sizeLabel?.trim() || "-",
    });

    return NextResponse.json({ video });
  }

  if (body.kind === "category") {
    const payload = body as Partial<AddCategoryPayload>;

    if (!payload.category?.trim()) {
      return NextResponse.json({ message: "Category is required." }, { status: 400 });
    }

    const categories = await addProfessionalCategory(session.user.id, payload.category.trim());

    return NextResponse.json({ categories });
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

  if (body.kind === "category") {
    const categories = await deleteProfessionalCategory(session.user.id, body.id);
    return NextResponse.json({ message: "Category removed.", categories });
  }

  return NextResponse.json({ message: "Invalid delete payload." }, { status: 400 });
}
