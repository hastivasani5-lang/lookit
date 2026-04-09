import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import CartPageClient from "@/app/cart/CartPageClient";
import { authOptions } from "@/lib/auth";

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    redirect("/login");
  }

  return <CartPageClient />;
}