import { NextResponse } from "next/server";

import { getAllLibraries } from "@/lib/content-library-store";
import { getAllUsers } from "@/lib/user-store";

export const runtime = "nodejs";

type PopularClassItem = {
  id: string;
  title: string;
  rating: string;
  image: string;
  tag: string;
  slug: string;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toClassSlug(title: string, professionalId: string, videoId: string) {
  const base = toSlug(title) || "class";
  return `${base}--${professionalId}--${videoId}`;
}

const fallbackImages = ["/pro1.jpeg", "/pro2.jpeg", "/pro3.jpeg", "/pro4.jpeg"];

export async function GET() {
  const [users, libraries] = await Promise.all([getAllUsers(), getAllLibraries()]);

  const approvedProfessionals = new Map(
    users
      .filter((user) => user.role === "professional" && user.approvalStatus === "approved")
      .map((user) => [user.id, user]),
  );

  const classes: Array<PopularClassItem & { createdAt: string }> = [];

  for (const [professionalId, library] of Object.entries(libraries.professionals)) {
    const professional = approvedProfessionals.get(professionalId);
    if (!professional) {
      continue;
    }

    for (const video of library.videos) {
      if ((video.level ?? "").trim().toLowerCase() !== "advanced") {
        continue;
      }

      if (typeof video.url !== "string" || video.url.trim().length === 0) {
        continue;
      }

      classes.push({
        id: video.id,
        title: video.name,
        rating: "4.8",
        image: professional.image || fallbackImages[classes.length % fallbackImages.length] || "/instructor.avif",
        tag: "Advanced",
        slug: toClassSlug(video.name, professionalId, video.id),
        createdAt: video.createdAt,
      });
    }
  }

  classes.sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return NextResponse.json({
    classes: classes.slice(0, 4).map(({ createdAt: _createdAt, ...item }) => item),
  });
}
