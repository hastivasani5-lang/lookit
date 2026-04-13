import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import ProfessionalDashboard from "@/components/ProfessionalDashboard";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";

export default async function TeachersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "professional") {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);

  if (!user || user.role !== "professional" || user.approvalStatus === "rejected") {
    redirect("/login");
  }

  return (
    <ProfessionalDashboard
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image ?? null,
        specialization: user.specialization ?? null,
        contactNumber: user.contactNumber ?? null,
        location: user.location ?? null,
        certificates: user.certificates ?? [],
        reviews: user.reviews ?? [],
        profileBoostedUntil: user.profileBoostedUntil ?? null,
      }}
    />
  );
}
