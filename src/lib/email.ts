export async function sendLoginOtpEmail(input: { to: string; name: string; otp: string }) {
	void input;
	throw new Error("OTP login is disabled.");
}