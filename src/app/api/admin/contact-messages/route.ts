import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getContactMessages } from "@/lib/contact-messages-store";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const messages = await getContactMessages();

  return NextResponse.json({ messages });
}
