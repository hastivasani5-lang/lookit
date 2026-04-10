import { cookies } from "next/headers";

import AdminLoginView from "@/components/admin/AdminLoginView";
import AdminProfileView from "@/components/admin/AdminProfileView";

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_session")?.value === "authorized";

  return isLoggedIn ?
   <div className="font-sans bg-[#eef5f3]"><AdminProfileView /></div> :
   <div className="font-sans bg-[#eef5f3]"><AdminLoginView /></div>;
}
