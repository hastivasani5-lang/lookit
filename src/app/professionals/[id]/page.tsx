import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";

import Navbar from "@/components/Navbar";
import ProfessionalProfileClient from "@/app/professionals/[id]/ProfessionalProfileClient";
import Footer from "@/components/Footer";
import { buildPublicProfessional, buildSeedProfessional } from "@/lib/professional-display";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import { professionals as seedProfessionals } from "@/app/professionals/data";
import { getProfessionalLibrary } from "@/lib/content-library-store";

type ProfessionalProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfessionalProfilePage({ params }: ProfessionalProfilePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const user = await getUserById(id);
  const library = await getProfessionalLibrary(id);
  const seedProfessional = seedProfessionals.find((item) => String(item.id) === id);
  const professional =
    user && user.role === "professional" && user.approvalStatus === "approved"
      ? buildPublicProfessional(user)
      : seedProfessional
        ? buildSeedProfessional(seedProfessional)
        : null;
  const hasLibraryItems = library.books.length > 0 || library.videos.length > 0;

  if (!professional) {
    notFound();
  }

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
      <Footer />

    </>
  );
}
