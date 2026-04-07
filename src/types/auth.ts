export type UserRole = "student" | "professional";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  image?: string;
  provider: "credentials" | "google";
  createdAt: string;
}
