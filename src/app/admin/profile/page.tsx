import { cookies } from "next/headers";
import AdminLoginView from "@/components/admin/AdminLoginView";

function AdminProfileView() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <h1 className="text-2xl font-bold text-[#1e2a55] mb-2">Admin Profile</h1>
        <p className="text-gray-500">Profile management coming soon.</p>
      </div>
    </div>
  );
}

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_session")?.value === "authorized";

  return isLoggedIn ?
   <div className="font-sans bg-[#eef5f3]"><AdminProfileView /></div> :
   <div className="font-sans bg-[#eef5f3]"><AdminLoginView /></div>;
}
