import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import Navbar from "@/components/Navbar";
import ProfessionalProfileClient from "@/app/professionals/[id]/ProfessionalProfileClient";
import Footer from "@/components/Footer";
import TopRatedProfessionalsSection from "@/components/TopRatedProfessionalsSection";
import { buildPublicProfessional } from "@/lib/professional-display";
import { authOptions } from "@/lib/auth";
import { getProfessionalUsers, getUserById } from "@/lib/user-store";
import { getProfessionalLibrary } from "@/lib/content-library-store";

type ProfessionalProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function hasActiveProfileUpgrade(profileBoostedUntil?: string) {
  if (!profileBoostedUntil) {
    return false;
  }

  const boostedUntil = new Date(profileBoostedUntil);
  if (Number.isNaN(boostedUntil.getTime())) {
    return false;
  }

  return boostedUntil.getTime() > Date.now();
}

export default async function ProfessionalProfilePage({ params }: ProfessionalProfilePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "professional" && session.user.id !== id) {
    redirect(`/professionals/${session.user.id}`);
  }

  const user = await getUserById(id);

  if (!user || user.role !== "professional" || user.approvalStatus === "rejected") {
    notFound();
  }

  const library = await getProfessionalLibrary(id);
  const professional = buildPublicProfessional(user);
  const hasLibraryItems = library.books.length > 0 || library.videos.length > 0;
  const topRatedProfessionals = session?.user?.role === "professional"
    ? []
    : (await getProfessionalUsers())
        .filter(
          (item) =>
            item.approvalStatus === "approved" &&
            item.id !== user.id &&
            hasActiveProfileUpgrade(item.profileBoostedUntil) &&
            item.profileUpgradeTier === "top",
        )
        .map((item, index) => buildPublicProfessional(item, index))
        .sort((left, right) => right.rating - left.rating || right.reviews - left.reviews)
        .slice(0, 8);

  return (
    <>
      <Navbar />
      <ProfessionalProfileClient
        professional={professional}
        canAddToCart={session?.user?.role === "student"}
        hasLibraryItems={hasLibraryItems}
        categories={library.categories}
        books={library.books}
        videos={library.videos}
      />
      {topRatedProfessionals.length > 0 ? <TopRatedProfessionalsSection professionals={topRatedProfessionals} /> : null}
      <Footer />

    </>
  );
}
