import { LayoutGrid, Upload, CreditCard, Users, Star, Settings } from "lucide-react";
import type { DashboardSection } from "./ProfessionalDashboard";

const dashboardSidebarItems: Array<{ label: string; icon: typeof LayoutGrid; section?: DashboardSection; href?: string }> = [
  { label: "Overview", icon: LayoutGrid, section: "overview" },
  { label: "Add", icon: Upload, section: "add" },
  { label: "Upgrade Profile", icon: CreditCard, section: "upgrade" },
  { label: "Purchases", icon: Users, href: "/dashboard/teachers/purchases" },
  { label: "Reviews", icon: Star, href: "/dashboard/teachers/reviews" },
  { label: "Settings", icon: Settings, section: "settings" },
];

export default dashboardSidebarItems;
