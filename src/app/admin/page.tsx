import { cookies } from "next/headers";

import AdminLoginViewClient from "../../components/admin/AdminLoginViewClient";
import AdminPanelView from "@/components/admin/AdminPanelView";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_session")?.value === "authorized";

  return isLoggedIn ? <div className="font-sans bg-[#eef5f3]"><AdminPanelView /></div> : <div className="font-sans bg-[#eef5f3]"><AdminLoginViewClient /></div>;
}
