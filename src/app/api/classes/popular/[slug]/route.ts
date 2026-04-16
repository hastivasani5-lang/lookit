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

function toClassSlug(title: string, professionalId: string, videoId: string) {
  const base = toSlug(title) || "class";
  return `${base}--${professionalId}--${videoId}`;
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
  const [users, libraries] = await Promise.all([getAllUsers(), getAllLibraries()]);

  const approvedProfessionals = new Map(
    users
      .filter((user) => user.role === "professional" && user.approvalStatus === "approved")
      .map((user) => [user.id, user]),
  );

  let matched:
    | {
        professionalId: string;
        videoId: string;
        title: string;
        url: string;
        createdAt: string;
      }
    | null = null;

  for (const [professionalId, library] of Object.entries(libraries.professionals)) {
    if (!approvedProfessionals.has(professionalId)) {
      continue;
    }

    for (const video of library.videos) {
      if ((video.level ?? "").trim().toLowerCase() !== "advanced") {
        continue;
      }

      if (typeof video.url !== "string" || video.url.trim().length === 0) {
        continue;
      }

      if (toClassSlug(video.name, professionalId, video.id) === slug.toLowerCase()) {
        matched = {
          professionalId,
          videoId: video.id,
          title: video.name,
          url: video.url,
          createdAt: video.createdAt,
        };
        break;
      }
    }

    if (matched) {
      break;
    }
  }

  if (!matched) {
    return NextResponse.json({ message: "Class not found." }, { status: 404 });
  }

  const professional = approvedProfessionals.get(matched.professionalId);
  if (!professional) {
    return NextResponse.json({ message: "Class not found." }, { status: 404 });
  }

  const library = libraries.professionals[matched.professionalId] ?? { books: [], videos: [], categories: [] };
  const advancedVideos = library.videos
    .filter((video) => (video.level ?? "").trim().toLowerCase() === "advanced")
    .filter((video) => typeof video.url === "string" && video.url.trim().length > 0)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  const instructorVideos = advancedVideos.map((video, index) => {
    const thumb = toYoutubeThumb(video.url) || professional.image || `/pro${(index % 4) + 1}.jpeg`;

    return {
      title: `Instructor ${index + 1} - ${video.name}`,
      url: video.url,
      thumb,
    };
  });

  const selectedVideo = advancedVideos.find((video) => toSlug(video.name) === slug.toLowerCase()) ?? advancedVideos[0] ?? null;
  const selectedVideoById = advancedVideos.find((video) => video.id === matched.videoId) ?? selectedVideo;

  return NextResponse.json({
    classItem: {
      title: matched.title,
      rating: "4.8",
      image: professional.image || "/pro1.jpeg",
      tag: "Advanced",
      description: "Master advanced concepts with this professional class and instructor-led video guidance.",
      videoUrl: selectedVideoById?.url ?? matched.url,
      videos: instructorVideos,
    },
  });
}
