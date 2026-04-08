export type UserRole = "student" | "professional";
export type ProfessionalApprovalStatus = "pending" | "approved" | "rejected";

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
  approvalStatus: ProfessionalApprovalStatus;
  approvalReviewedBy?: string;
  approvalReviewedAt?: string;
  approvalNote?: string;
  provider: "credentials" | "google";
  createdAt: string;
}
