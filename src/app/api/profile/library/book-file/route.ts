import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { promises as fs } from "fs";
import path from "path";

import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!user || user.role !== "professional") {
    return NextResponse.json({ message: "Only professionals can upload book files." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ message: "Expected multipart/form-data." }, { status: 400 });
  }

  const formData = await request.formData();
  const bookFile = formData.get("bookFile");

  if (!(bookFile instanceof File) || bookFile.size === 0) {
    return NextResponse.json({ message: "No book file provided." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "book-files");
  await fs.mkdir(uploadDir, { recursive: true });

  const extension = bookFile.name.includes(".")
    ? `.${bookFile.name.split(".").pop()}`
    : ".pdf";
  const fileNameOnDisk = `${user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const absolutePath = path.join(uploadDir, fileNameOnDisk);
  const buffer = Buffer.from(await bookFile.arrayBuffer());
  await fs.writeFile(absolutePath, buffer);

  return NextResponse.json({
    fileUrl: `/uploads/book-files/${fileNameOnDisk}`,
    fileName: bookFile.name,
  });
}
