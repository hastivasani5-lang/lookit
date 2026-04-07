import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { updateUserProfile } from "@/lib/user-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const name = typeof formData.get("name") === "string" ? formData.get("name")?.toString().trim() : "";
    const email = typeof formData.get("email") === "string" ? formData.get("email")?.toString().trim().toLowerCase() : "";
    const specialization =
      typeof formData.get("specialization") === "string" ? formData.get("specialization")?.toString().trim() : "";
    const contactNumber =
      typeof formData.get("contactNumber") === "string" ? formData.get("contactNumber")?.toString().trim() : "";
    const location = typeof formData.get("location") === "string" ? formData.get("location")?.toString().trim() : "";
    const reviewsText = typeof formData.get("reviews") === "string" ? formData.get("reviews")?.toString() : "";
    const photo = formData.get("photo");
    const certificateFiles = formData.getAll("certificates").filter((item): item is File => item instanceof File && item.size > 0);

    let imagePath: string | null | undefined = undefined;
    const certificatePaths: string[] = [];

    if (photo instanceof File && photo.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileExtension = photo.name.includes(".")
        ? `.${photo.name.split(".").pop()}`
        : ".png";
      const fileName = `${session.user.id}-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      const buffer = Buffer.from(await photo.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    if (certificateFiles.length > 0) {
      const certificatesDir = path.join(process.cwd(), "public", "uploads", "certificates");
      await fs.mkdir(certificatesDir, { recursive: true });

      for (const certificate of certificateFiles) {
        const fileExtension = certificate.name.includes(".")
          ? `.${certificate.name.split(".").pop()}`
          : ".pdf";
        const fileName = `${session.user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${fileExtension}`;
        const filePath = path.join(certificatesDir, fileName);

        const buffer = Buffer.from(await certificate.arrayBuffer());
        await fs.writeFile(filePath, buffer);
        certificatePaths.push(`/uploads/certificates/${fileName}`);
      }
    }

    if (name && name.length < 2) {
      return NextResponse.json({ message: "Name must be at least 2 characters." }, { status: 400 });
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Please provide a valid email." }, { status: 400 });
    }

    const updatedUser = await updateUserProfile({
      id: session.user.id,
      name: name || undefined,
      email: email || undefined,
      specialization: specialization || undefined,
      contactNumber: contactNumber || undefined,
      location: location || undefined,
      reviews: reviewsText ? reviewsText.split("\n").map((line) => line.trim()).filter(Boolean) : undefined,
      image: imagePath,
      certificates: certificatePaths.length > 0 ? certificatePaths : undefined,
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image ?? null,
        specialization: updatedUser.specialization ?? "",
        contactNumber: updatedUser.contactNumber ?? "",
        location: updatedUser.location ?? "",
        certificates: updatedUser.certificates ?? [],
        reviews: updatedUser.reviews ?? [],
        profileBoostedUntil: updatedUser.profileBoostedUntil ?? null,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update profile.";
    return NextResponse.json({ message }, { status: 400 });
  }
}