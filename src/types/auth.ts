export type UserRole = "student" | "professional";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  image?: string;
  specialization?: string;
  contactNumber?: string;
  location?: string;
  certificates?: string[];
  reviews?: string[];
  profileBoostedUntil?: string;
  provider: "credentials" | "google";
  createdAt: string;
}
