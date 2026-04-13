import { NextResponse } from "next/server";

import { getLoggedInProfessionalIds } from "@/lib/professional-login-store";
import { getUserById } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
	const loggedInProfessionalIds = await getLoggedInProfessionalIds();
	const users = await Promise.all(loggedInProfessionalIds.map((id) => getUserById(id)));

	const instructors = users
		.filter((user): user is NonNullable<typeof user> => Boolean(user))
		.filter((user) => user.role === "professional" && user.approvalStatus !== "rejected")
		.map((user) => ({
			id: user.id,
			name: user.name,
			role: user.specialization?.trim() || "Professional",
			img: user.image?.trim() || "/pro1.jpeg",
		}));

	return NextResponse.json({ instructors });
}
