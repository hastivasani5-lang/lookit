import type { UserRole } from "@/types/auth";
import type { ProfessionalApprovalStatus } from "@/types/auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      location?: string | null;
      profileBoostedUntil?: string | null;
      approvalStatus?: ProfessionalApprovalStatus;
    };
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    location?: string;
    profileBoostedUntil?: string | null;
    approvalStatus?: ProfessionalApprovalStatus;
  }
}
