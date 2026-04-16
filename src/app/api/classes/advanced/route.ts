import { NextResponse } from "next/server";

import { getAllLibraries } from "@/lib/content-library-store";
import { getAllUsers } from "@/lib/user-store";

export const runtime = "nodejs";

type AdvancedClassItem = {
  id: string;
  title: string;
  rating: string;
  image: string;
  tag: string;
  slug: string;
  videoCount: number;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toClassSlug(title: string, professionalId: string) {
  const base = toSlug(title) || "class";
  return `${base}--${professionalId}`;
}

const fallbackImages = ["/pro1.jpeg", "/pro2.jpeg", "/pro3.jpeg", "/pro4.jpeg"];

export async function GET() {
  const [users, libraries] = await Promise.all([getAllUsers(), getAllLibraries()]);

  const approvedProfessionals = new Map(
    users
      .filter((user) => user.role === "professional" && user.approvalStatus === "approved")
      .map((user) => [user.id, user]),
  );

  const classes: Array<AdvancedClassItem & { createdAt: string }> = [];

  for (const [professionalId, library] of Object.entries(libraries.professionals)) {
    const professional = approvedProfessionals.get(professionalId);
    if (!professional) {
      continue;
    }

    const advancedVideos = library.videos.filter(
      (video) =>
        (video.level ?? "").trim().toLowerCase() === "advanced" &&
        typeof video.url === "string" &&
        video.url.trim().length > 0,
    );

    if (advancedVideos.length === 0) {
      continue;
    }

    const sortedAdvancedVideos = [...advancedVideos].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
    const primaryVideo = sortedAdvancedVideos[0];

    classes.push({
      id: professionalId,
      title: primaryVideo.name,
      rating: "4.8",
      image: professional.image || fallbackImages[classes.length % fallbackImages.length] || "/instructor.avif",
      tag: "Advanced",
      slug: toClassSlug(primaryVideo.name, professionalId),
      videoCount: sortedAdvancedVideos.length,
      createdAt: primaryVideo.createdAt,
    });
  }

  classes.sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return NextResponse.json({
    classes: classes.map(({ createdAt: _createdAt, ...item }) => item),
  });
}
