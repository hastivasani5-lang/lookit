import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
	return NextResponse.json({ message: "OTP login is disabled." }, { status: 410 });
}