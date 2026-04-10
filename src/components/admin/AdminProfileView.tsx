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
    <main className="min-h-screen bg-[#eef5f3] p-4 sm:p-6 font-sans">
      <section className="mx-auto w-full max-w-3xl rounded-3xl neumorph-admin-card bg-white sm:p-8 p-6">
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
            className="h-11 rounded-2xl bg-[#eef5f3] px-6 text-sm font-semibold text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner transition-all"
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="h-11 rounded-2xl bg-[#2d6a4f] px-6 text-sm font-semibold text-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff] transition hover:bg-[#1f5942]"
          >
            Logout
          </button>
        </div>
      <style>{`
        .neumorph-admin-card {
          background: #eef5f3;
          box-shadow: 12px 12px 24px #d0dbd6, -12px -12px 24px #ffffff;
          transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
        }
      `}</style>
      </section>
    </main>
  );
}
