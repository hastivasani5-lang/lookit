import { NextResponse } from "next/server";

import { getAllLibraries } from "@/lib/content-library-store";
import { getAllUsers } from "@/lib/user-store";

export const runtime = "nodejs";

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

function getProfessionalIdFromSlug(slug: string) {
  const parts = slug.split("--");
  return parts.length >= 2 ? parts[parts.length - 1] : "";
}

function toYoutubeThumb(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "").trim();
      return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.includes("/embed/")) {
        const id = parsed.pathname.split("/embed/")[1]?.split("/")[0]?.trim();
        return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
      }

      const id = parsed.searchParams.get("v")?.trim();
      return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
    }

    return "";
  } catch {
    return "";
  }
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const normalizedSlug = slug.toLowerCase();
  const professionalIdFromSlug = getProfessionalIdFromSlug(normalizedSlug);

  const [users, libraries] = await Promise.all([getAllUsers(), getAllLibraries()]);

  const approvedProfessionals = new Map(
    users
      .filter((user) => user.role === "professional" && user.approvalStatus === "approved")
      .map((user) => [user.id, user]),
  );

  if (!professionalIdFromSlug || !approvedProfessionals.has(professionalIdFromSlug)) {
    return NextResponse.json({ message: "Class not found." }, { status: 404 });
  }

  const professional = approvedProfessionals.get(professionalIdFromSlug);
  const library = libraries.professionals[professionalIdFromSlug] ?? { books: [], videos: [], categories: [] };

  if (!professional) {
    return NextResponse.json({ message: "Class not found." }, { status: 404 });
  }

  const advancedVideos = library.videos
    .filter(
      (video) =>
        (video.level ?? "").trim().toLowerCase() === "advanced" &&
        typeof video.url === "string" &&
        video.url.trim().length > 0,
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  if (advancedVideos.length === 0) {
    return NextResponse.json({ message: "Class not found." }, { status: 404 });
  }

  const expectedSlug = toClassSlug(advancedVideos[0].name, professionalIdFromSlug);
  if (expectedSlug !== normalizedSlug) {
    return NextResponse.json({ message: "Class not found." }, { status: 404 });
  }

  const selectedVideoIndex = 0;

  return NextResponse.json({
    classItem: {
      title: advancedVideos[selectedVideoIndex]?.name || "Advanced Class",
      image: professional.image || "/pro1.jpeg",
      videos: advancedVideos.map((video, index) => ({
        id: video.id,
        title: video.name,
        url: video.url,
        thumb: toYoutubeThumb(video.url) || professional.image || `/pro${(index % 4) + 1}.jpeg`,
        duration: video.sizeLabel || "--:--",
        source: video.source,
      })),
      selectedVideoIndex,
    },
  });
}
