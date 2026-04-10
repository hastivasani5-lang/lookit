import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/user-store";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { redirectTo: "/alert" },
        { status: 200 },
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { redirectTo: "/alert" },
        { status: 200 },
      );
    }

    const redirectTo = user.role === "professional" ? "/dashboard/teachers" : "/dashboard/students";

    return NextResponse.json({ redirectTo }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to process request right now." },
      { status: 500 },
    );
  }
}
