import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getCertificates, appendCertificate } from "@/lib/certificate-store";
import { appendStudentNotification } from "@/lib/student-notifications-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id || token.role !== "professional") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const profId = token.id as string;
  const profName = (token.name as string | undefined) ?? "Your instructor";
  const studentId = req.nextUrl.searchParams.get("studentId");
  const certificates = await getCertificates();

  const filtered = certificates
    .filter((c) => c.professionalId === profId)
    .filter((c) => (studentId ? c.studentId === studentId : true));

  return NextResponse.json({ certificates: filtered });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id || token.role !== "professional") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const profId = token.id as string;
  const profName = (token.name as string | undefined) ?? "Your instructor";

  let body: { studentId?: unknown; studentName?: unknown; message?: unknown; imageDataUrl?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const { studentId, studentName, message, imageDataUrl } = body;

  if (!studentId || typeof studentId !== "string" || !studentName || typeof studentName !== "string") {
    return NextResponse.json({ message: "studentId and studentName are required." }, { status: 400 });
  }

  const cert = await appendCertificate({
    id: `cert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    professionalId: profId,
    professionalName: profName,
    studentId,
    studentName,
    issuedAt: new Date().toISOString(),
    message: typeof message === "string" ? message : "",
    imageDataUrl: typeof imageDataUrl === "string" ? imageDataUrl : undefined,
  });

  await appendStudentNotification(
    studentId,
    "certificate",
    `🎓 You received a certificate from ${profName}! Tap to download.`,
    { certificateId: cert.id, professionalName: profName },
  );

  return NextResponse.json({ certificate: cert }, { status: 201 });
}
