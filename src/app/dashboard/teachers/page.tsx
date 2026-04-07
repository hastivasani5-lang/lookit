import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import ProfessionalDashboard from "@/components/ProfessionalDashboard";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";

export default async function TeachersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "student") {
    redirect("/dashboard/students");
  }

  const user = (await getUserById(session.user.id)) ?? {
    id: session.user.id,
    name: session.user.name ?? "Professional User",
    email: session.user.email ?? "professional@example.com",
    image: session.user.image ?? null,
    specialization: undefined,
    contactNumber: undefined,
    location: session.user.location ?? null,
    certificates: [],
    reviews: [],
    profileBoostedUntil: session.user.profileBoostedUntil ?? null,
  };

  return (
    <ProfessionalDashboard
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
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
