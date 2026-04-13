import type { AppUser } from "@/types/auth";
import { professionals as fallbackProfessionals, type Professional as SeedProfessional } from "@/app/professionals/data";
import { getOnlineProfessionalImage } from "@/app/professionals/online-images";

export type PublicProfessional = {
  id: string;
  name: string;
  specialization: string;
  category: (typeof fallbackProfessionals)[number]["category"];
  language: (typeof fallbackProfessionals)[number]["language"];
  location: string;
  rating: number;
  reviews: number;
  image: string;
};

export function buildSeedProfessional(professional: SeedProfessional): PublicProfessional {
  return {
    id: String(professional.id),
    name: professional.name,
    specialization: professional.specialization,
    category: professional.category,
    language: professional.language,
    location: professional.location,
    rating: professional.rating,
    reviews: professional.reviews,
    image: getOnlineProfessionalImage(professional.id),
  };
}

function getFallbackProfile(index: number) {
  return fallbackProfessionals[index % fallbackProfessionals.length];
}

function normalizeSpecialization(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function inferCategory(specialization: string, fallback: PublicProfessional["category"]) {
  const normalized = specialization.toLowerCase();

  if (normalized.includes("speech")) return "speech";
  if (normalized.includes("dyslexia")) return "dyslexia";
  if (normalized.includes("autism")) return "autism";
  if (normalized.includes("special")) return "special-ed";
  if (normalized.includes("adhd")) return "adhd";

  return fallback;
}

const PROFILE_PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23e6f4ef'/%3E%3Ccircle cx='200' cy='170' r='78' fill='%2398b8ab'/%3E%3Crect x='90' y='270' width='220' height='170' rx='85' fill='%2398b8ab'/%3E%3C/svg%3E";

export function buildPublicProfessional(user: AppUser, index = 0): PublicProfessional {
  const fallback = getFallbackProfile(index);
  const specialization = normalizeSpecialization(user.specialization, "Professional Specialist");
  const location = normalizeSpecialization(user.location, "Location not set");
  const reviewsCount = Math.max(user.reviews?.length ?? 0, 0);
  const derivedRating = reviewsCount > 0 ? Math.min(5, 4 + Math.min(reviewsCount, 10) / 10) : 4.5;

  return {
    id: user.id,
    name: user.name,
    specialization,
    category: inferCategory(specialization, "special-ed"),
    language: "English",
    location,
    rating: Number(derivedRating.toFixed(1)),
    reviews: reviewsCount,
    image: user.image?.trim() || PROFILE_PLACEHOLDER_SVG,
  };
}
