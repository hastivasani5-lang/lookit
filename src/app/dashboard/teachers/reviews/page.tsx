import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import ProfessionalReviewsClient from "@/components/ProfessionalReviewsClient";
import DashboardSidebar from "@/components/DashboardSidebar";
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
    <main className="h-screen w-full overflow-hidden bg-[#f0f4f8]">
      <section className="grid h-full w-full lg:grid-cols-[260px_minmax(0,1fr)]">
        <DashboardSidebar
          profileName={user?.name || "Professional User"}
          profileEmail={user?.email || "professional@demo.com"}
          avatarSrc={user?.image || "/person.png"}
        />

        <div className="h-full overflow-y-auto bg-[#f0f4f8] px-4 py-5 md:px-6 lg:px-7">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1ec28e]">
              Professional Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Student Reviews</h1>
            <p className="mt-1 text-sm text-slate-500">
              All reviews submitted by students for your profile, updated in real time.
            </p>
          </div>

          <ProfessionalReviewsClient />
        </div>
      </section>
    </main>
  );
}
