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
  locations: string[];
  zipCode: string;
  rating: number;
  reviews: number;
  image: string;
  profileBoostedUntil?: string;
  profileUpgradeTier?: AppUser["profileUpgradeTier"];
};

export function buildSeedProfessional(professional: SeedProfessional): PublicProfessional {
  return {
    id: String(professional.id),
    name: professional.name,
    specialization: professional.specialization,
    category: professional.category,
    language: professional.language,
    location: professional.location,
    locations: [professional.location],
    zipCode: "",
    rating: professional.rating,
    reviews: professional.reviews,
    image: getOnlineProfessionalImage(professional.id),
    profileBoostedUntil: undefined,
    profileUpgradeTier: undefined,
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
  const locations = Array.isArray(user.locations) && user.locations.length > 0 
    ? user.locations.filter((loc): loc is string => typeof loc === "string" && loc.trim().length > 0)
    : location !== "Location not set" ? [location] : [];
  const reviewsCount = Math.max(user.reviews?.length ?? 0, 0);
  const derivedRating = reviewsCount > 0 ? Math.min(5, 4 + Math.min(reviewsCount, 10) / 10) : 4.5;

  // Extract ZIP code from location if present (e.g. "Mumbai 400001" or "400001")
  const zipMatch = location.match(/\b\d{5,6}\b/);
  const zipCode = zipMatch ? zipMatch[0] : "";

  return {
    id: user.id,
    name: user.name,
    specialization,
    category: inferCategory(specialization, "special-ed"),
    language: "English",
    location,
    locations,
    zipCode,
    rating: Number(derivedRating.toFixed(1)),
    reviews: reviewsCount,
    image: user.image?.trim() || PROFILE_PLACEHOLDER_SVG,
    profileBoostedUntil: user.profileBoostedUntil,
    profileUpgradeTier: user.profileUpgradeTier,
  };
}
