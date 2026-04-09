import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import ProfessionalProfileClient from "@/app/professionals/[id]/ProfessionalProfileClient";
import { professionals } from "@/app/professionals/data";
import Footer from "@/components/Footer";

type ProfessionalProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfessionalProfilePage({ params }: ProfessionalProfilePageProps) {
  const { id } = await params;
  const professionalId = Number(id);
  const professional = professionals.find((item) => item.id === professionalId);

  if (!professional) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProfessionalProfileClient professional={professional} />
      <Footer />

    </>
  );
}
