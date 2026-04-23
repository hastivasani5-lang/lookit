import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Use actual role from DB (set in JWT callback)
    const role = session.user.role;

    if (role === "professional") {
      return NextResponse.redirect(new URL("/dashboard/teachers", request.url));
    } else {
      // Student -> home page (logged in state)
      return NextResponse.redirect(new URL("/", request.url));
    }

  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
