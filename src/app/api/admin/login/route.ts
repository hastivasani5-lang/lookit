import { NextResponse } from "next/server";

const ADMIN_EMAIL = "jenilgadhiya@gmail.com";
const ADMIN_PASSWORD = "jenil2511";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  const email = (body.email ?? "").trim().toLowerCase();
  const password = (body.password ?? "").trim();

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ message: "Admin login successful." });
  response.cookies.set("admin_session", "authorized", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
