import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { markProfessionalLoggedIn, markProfessionalLoggedOut } from "@/lib/professional-login-store";

export const runtime = "nodejs";

export async function POST() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		if (session.user.role !== "professional") {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		await markProfessionalLoggedIn(session.user.id);

		return NextResponse.json({ ok: true }, { status: 200 });
	} catch (error) {
		console.error("Error in POST /api/professionals/session:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		if (session.user.role !== "professional") {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		await markProfessionalLoggedOut(session.user.id);

		return NextResponse.json({ ok: true }, { status: 200 });
	} catch (error) {
		console.error("Error in DELETE /api/professionals/session:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
