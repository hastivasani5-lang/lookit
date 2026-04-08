"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const ADMIN_PROFILE = {
  name: "Admin",
  email: "jenilgadhiya@gmail.com",
  avatar: "/pro1.jpeg",
  role: "System Administrator",
};

export default function AdminProfileView() {
  const router = useRouter();

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#eef0fb] p-4 sm:p-6">
      <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.14)] sm:p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src={ADMIN_PROFILE.avatar}
            alt="Admin profile"
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
            priority
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{ADMIN_PROFILE.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{ADMIN_PROFILE.role}</p>
            <p className="mt-1 text-sm text-slate-600">{ADMIN_PROFILE.email}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="h-11 rounded-full border border-slate-200 px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="h-11 rounded-full bg-[#1ec28e] px-6 text-sm font-medium text-white transition hover:bg-[#18ab7d]"
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
