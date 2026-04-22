import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { promises as fs } from "fs";
import path from "path";

import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import {
  addProfessionalBook,
  addProfessionalVideo,
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

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const kind = formData.get("kind");

    if (kind !== "book") {
      return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
    }

    const nameValue = formData.get("name");
    const categoryValue = formData.get("category");
    const mrpValue = formData.get("mrp");
    const urlValue = formData.get("url");
    const fileNameValue = formData.get("fileName");
    const sizeLabelValue = formData.get("sizeLabel");
    const imageLinkValue = formData.get("imageLink");

    const name = typeof nameValue === "string" ? nameValue.trim() : "";
    const category = typeof categoryValue === "string" ? categoryValue.trim() : "";
    const mrp = typeof mrpValue === "string" ? mrpValue.trim() : "";
    const url = typeof urlValue === "string" ? urlValue.trim() : "";
    const source = formData.get("source") === "amazon" ? "amazon" : "file";
    const fileName = typeof fileNameValue === "string" ? fileNameValue.trim() : "Uploaded file";
    const sizeLabel = typeof sizeLabelValue === "string" ? sizeLabelValue.trim() : "-";
    const imageLink = typeof imageLinkValue === "string" ? imageLinkValue.trim() : "";
    const imageFile = formData.get("imageFile");
    const bookFile = formData.get("bookFile");

    if (!name || !category || !mrp) {
      return NextResponse.json({ message: "Missing book details." }, { status: 400 });
    }

    let imageUrl = imageLink;

    if (imageFile instanceof File && imageFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "books");
      await fs.mkdir(uploadDir, { recursive: true });

      const extension = imageFile.name.includes(".")
        ? `.${imageFile.name.split(".").pop()}`
        : ".png";
      const fileNameOnDisk = `${professionalId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
      const absolutePath = path.join(uploadDir, fileNameOnDisk);
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      await fs.writeFile(absolutePath, buffer);
      imageUrl = `/uploads/books/${fileNameOnDisk}`;
    }

    if (!imageUrl) {
      return NextResponse.json({ message: "Book image is required." }, { status: 400 });
    }

    // Save the actual PDF/book file
    let savedFileUrl = url;
    if (bookFile instanceof File && bookFile.size > 0) {
      const pdfUploadDir = path.join(process.cwd(), "public", "uploads", "book-files");
      await fs.mkdir(pdfUploadDir, { recursive: true });

      const ext = bookFile.name.includes(".") ? `.${bookFile.name.split(".").pop()}` : ".pdf";
      const pdfFileName = `${professionalId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const pdfPath = path.join(pdfUploadDir, pdfFileName);
      const pdfBuffer = Buffer.from(await bookFile.arrayBuffer());
      await fs.writeFile(pdfPath, pdfBuffer);
      savedFileUrl = `/uploads/book-files/${pdfFileName}`;
    }

    const book = await addProfessionalBook(professionalId, {
      name,
      category,
      mrp,
      imageUrl,
      url: savedFileUrl,
      fileUrl: savedFileUrl,
      source,
      fileName,
      sizeLabel,
    });

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
