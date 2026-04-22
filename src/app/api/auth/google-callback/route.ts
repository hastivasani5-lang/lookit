import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Get role from localStorage (passed via query param)
    const searchParams = request.nextUrl.searchParams;
    const roleFromQuery = searchParams.get("role");
    
    // Default to student if no role specified
    const role = roleFromQuery || session.user.role || "student";
    
    // Redirect based on role
    if (role === "professional") {
      return NextResponse.redirect(new URL("/dashboard/teachers", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/students", request.url));
    }
    
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}