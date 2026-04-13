import { NextResponse } from "next/server";
import { compare } from "bcryptjs";

import { createLoginOtpChallenge } from "@/lib/login-otp-store";
import { sendLoginOtpEmail } from "@/lib/email";
import { getUserByEmail, recordProfessionalLoginAttempt } from "@/lib/user-store";

export const runtime = "nodejs";

function mapOtpErrorMessage(message: string) {
	if (message.includes("SMTP authentication failed")) {
		return "Email server login failed. Use a valid SMTP username and password (for Gmail: App Password).";
	}

	if (message.includes("SMTP is not configured")) {
		return "Email OTP is not configured on server. Please set SMTP credentials in .env.local.";
	}

	return "Unable to send OTP right now. Please try again in a moment.";
}

function generateOtp() {
	return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => ({}));
		const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
		const password = typeof body.password === "string" ? body.password : "";
		const role = body.role === "student" || body.role === "professional" ? body.role : null;

		if (!email || !password || !role) {
			return NextResponse.json({ message: "Please provide email, password, and role." }, { status: 400 });
		}

		const user = await getUserByEmail(email);
		if (!user || !user.passwordHash || user.role !== role) {
			return NextResponse.json({ message: "Invalid credentials or account not found." }, { status: 400 });
		}

		if (user.role === "professional" && user.approvalStatus === "rejected") {
			await recordProfessionalLoginAttempt(user, "rejected");
			return NextResponse.json({ message: "Your professional account was rejected by the admin." }, { status: 403 });
		}

		const isPasswordValid = await compare(password, user.passwordHash);
		if (!isPasswordValid) {
			return NextResponse.json({ message: "Invalid credentials or account not found." }, { status: 400 });
		}

		const otp = generateOtp();
		const challenge = await createLoginOtpChallenge({
			userId: user.id,
			email: user.email,
			role: user.role,
			otp,
		});

		await sendLoginOtpEmail({
			to: user.email,
			name: user.name,
			otp,
		});

		return NextResponse.json({
			message: "OTP sent successfully.",
			challengeId: challenge.challengeId,
			email: user.email,
		});
	} catch (error) {
		const raw = error instanceof Error ? error.message : "Unable to send OTP.";
		const message = mapOtpErrorMessage(raw);
		return NextResponse.json({ message }, { status: 500 });
	}
}