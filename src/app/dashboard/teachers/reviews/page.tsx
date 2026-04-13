import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfessionalReviewsClient from "@/components/ProfessionalReviewsClient";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";

export default async function ProfessionalReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);
  if (!user || user.role !== "professional") {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eef5f3] px-3 pb-12 pt-28 sm:px-4 md:px-6 lg:px-8">
        <section className="mx-auto grid w-full max-w-[1600px] gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <ProfessionalSidebar />

          <div className="rounded-[28px] bg-[#eef5f3] p-4 shadow-[20px_20px_40px_#d0dbd6,-20px_-20px_40px_#ffffff] md:p-6">
            <div className="rounded-[24px] bg-[#eef5f3] px-5 py-4 shadow-[12px_12px_24px_#d0dbd6,-12px_-12px_24px_#ffffff]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2c5a48]">Professional Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Incoming Reviews</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                See every student review submitted for your profile in real time.
              </p>
            </div>

            <div className="mt-6">
              <ProfessionalReviewsClient />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
