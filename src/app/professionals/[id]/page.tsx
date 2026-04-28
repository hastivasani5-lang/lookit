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
import Link from "next/link";

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

  // Validate ID format
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Not Found</h1>
            <p className="text-gray-600 mb-6">The professional profile you're looking for doesn't exist or is no longer available.</p>
            <Link href="/professionals" className="inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105">
              Back to Professionals
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (session?.user?.role === "professional" && session.user.id !== id) {
    redirect(`/professionals/${session.user.id}`);
  }

  const user = await getUserById(id);

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Not Found</h1>
            <p className="text-gray-600 mb-6">The professional profile you're looking for doesn't exist or is no longer available.</p>
            <Link href="/professionals" className="inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105">
              Back to Professionals
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (user.role !== "professional") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">This profile is not a professional account.</p>
            <Link href="/professionals" className="inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105">
              Back to Professionals
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (user.approvalStatus === "rejected") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Unavailable</h1>
            <p className="text-gray-600 mb-6">This professional profile is no longer available.</p>
            <Link href="/professionals" className="inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105">
              Back to Professionals
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
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
