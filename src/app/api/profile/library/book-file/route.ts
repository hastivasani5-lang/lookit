import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import { uploadFile } from "@/lib/file-upload";

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

  const fileUrl = await uploadFile(bookFile, "book-files");

  return NextResponse.json({
    fileUrl,
    fileName: bookFile.name,
  });
}
