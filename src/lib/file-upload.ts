import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export async function uploadFile(file: File, folder: string): Promise<string> {
  // On Vercel, use Blob Storage
  if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return blob.url;
  }

  // Local development — save to public/uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const extension = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/uploads/${folder}/${fileName}`;
}
