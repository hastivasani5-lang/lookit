import { cookies } from "next/headers";

import AdminLoginView from "@/components/admin/AdminLoginView";
import AdminPanelView from "@/components/admin/AdminPanelView";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_session")?.value === "authorized";

  return isLoggedIn ? <AdminPanelView /> : <AdminLoginView />;
}
