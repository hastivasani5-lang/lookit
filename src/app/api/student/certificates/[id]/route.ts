import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getCertificates } from "@/lib/certificate-store";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const certificates = await getCertificates();
  const cert = certificates.find((c) => c.id === id);

  if (!cert) {
    return NextResponse.json({ message: "Certificate not found." }, { status: 404 });
  }

  // Only the student who received it can fetch it
  if (cert.studentId !== (token.id as string)) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  return NextResponse.json({ certificate: cert });
}
