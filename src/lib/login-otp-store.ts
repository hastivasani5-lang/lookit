export async function createLoginOtpChallenge(_: {
	userId: string;
	email: string;
	role: "student" | "professional";
	otp: string;
}) {
	throw new Error("This flow is no longer available.");
}

export async function verifyLoginOtpChallenge(_: { challengeId: string; otp: string }) {
	return null;
}

export async function getLoginOtpChallengeById(_: string) {
	return null;
}