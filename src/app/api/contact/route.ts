import { NextResponse } from "next/server";

import { addContactMessage } from "@/lib/contact-messages-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const agreedToTerms = Boolean(body.agreedToTerms);

    if (name.length < 2) {
      return NextResponse.json({ message: "Please enter a valid name." }, { status: 400 });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    if (!subject) {
      return NextResponse.json({ message: "Please enter a subject." }, { status: 400 });
    }

    if (message.length < 5) {
      return NextResponse.json({ message: "Please enter a detailed message." }, { status: 400 });
    }

    if (!agreedToTerms) {
      return NextResponse.json({ message: "Please accept Terms and Conditions." }, { status: 400 });
    }

    const saved = await addContactMessage({
      name,
      phone,
      email,
      subject,
      message,
      agreedToTerms,
    });

    return NextResponse.json({ message: "Message sent successfully.", contact: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Unable to send message right now." }, { status: 500 });
  }
}
