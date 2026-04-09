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

export function buildPublicProfessional(user: AppUser, index = 0): PublicProfessional {
  const fallback = getFallbackProfile(index);
  const specialization = normalizeSpecialization(user.specialization, fallback.specialization);
  const location = normalizeSpecialization(user.location, fallback.location);
  const reviewsCount = Math.max(user.reviews?.length ?? 0, 0);

  return {
    id: user.id,
    name: user.name,
    specialization,
    category: inferCategory(specialization, fallback.category),
    language: fallback.language,
    location,
    rating: fallback.rating,
    reviews: reviewsCount > 0 ? reviewsCount * 50 : fallback.reviews,
    image: getOnlineProfessionalImage(user.id),
  };
}
