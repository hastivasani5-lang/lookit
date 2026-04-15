import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StudentProfileDashboard from "@/components/StudentProfileDashboard";
import { authOptions } from "@/lib/auth";
import { getStudentLibrary } from "@/lib/content-library-store";
import { getUserById } from "@/lib/user-store";

export default async function StudentProfileDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);

  if (!user || user.role !== "student") {
    redirect("/login");
  }

  const library = await getStudentLibrary(user.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef2f7] px-4 pb-12 pt-28 md:px-6 lg:px-8">
        <StudentProfileDashboard
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            contactNumber: user.contactNumber,
            location: user.location,
            createdAt: user.createdAt,
          }}
          library={{
            purchasedBooks: library.purchasedBooks.map((book) => ({
              id: book.id,
              title: book.title,
              amount: book.amount,
            })),
            watchedVideos: library.watchedVideos.map((video) => ({
              id: video.id,
              title: video.title,
              amount: video.amount,
            })),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
