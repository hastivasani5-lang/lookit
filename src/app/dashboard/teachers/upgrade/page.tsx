import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import UpgradePricing from "@/components/UpgradePricing";

export default function UpgradeProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#f7f7fb]">
      <ProfessionalSidebar />
      <main className="flex-1 flex justify-center items-start p-0 md:p-10">
        <UpgradePricing />
      </main>
    </div>
  );
}
