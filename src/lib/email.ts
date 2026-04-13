import nodemailer from "nodemailer";

function getSmtpConfig() {
	const host = process.env.SMTP_HOST?.trim() || process.env.MAIL_HOST?.trim();
	const portRaw = process.env.SMTP_PORT || process.env.MAIL_PORT || "587";
	const port = Number.parseInt(portRaw, 10);
	const user = process.env.SMTP_USER?.trim() || process.env.MAIL_USER?.trim() || process.env.EMAIL_USER?.trim();
	const pass = process.env.SMTP_PASS?.trim() || process.env.MAIL_PASS?.trim() || process.env.EMAIL_PASS?.trim();
	const from =
		process.env.SMTP_FROM?.trim() ||
		process.env.MAIL_FROM?.trim() ||
		process.env.OTP_FROM_EMAIL?.trim() ||
		user;
	const secureFlag = process.env.SMTP_SECURE ?? process.env.MAIL_SECURE;
	const secure = typeof secureFlag === "string" ? secureFlag === "true" : port === 465;

	if (!host || !Number.isFinite(port) || port <= 0 || !user || !pass || !from) {
		throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in .env.local.");
	}

	if (
		user.includes("your-email") ||
		pass.includes("your-app-password") ||
		pass.includes("your-password")
	) {
		throw new Error("SMTP is not configured with real credentials.");
	}

	return { host, port, user, pass, from, secure };
}

export async function sendLoginOtpEmail(input: { to: string; name: string; otp: string }) {
	const config = getSmtpConfig();
	const transporter = nodemailer.createTransport({
		host: config.host,
		port: config.port,
		secure: config.secure,
		auth: {
			user: config.user,
			pass: config.pass,
		},
	});

	try {
		await transporter.sendMail({
			from: config.from,
			to: input.to,
			subject: "Your LOOKIT login OTP",
			text: `Hello ${input.name},\n\nYour LOOKIT login OTP is ${input.otp}. It will expire in 10 minutes.\n\nIf you did not request this, you can ignore this email.`,
			html: `<p>Hello ${input.name},</p><p>Your LOOKIT login OTP is <strong>${input.otp}</strong>. It will expire in 10 minutes.</p><p>If you did not request this, you can ignore this email.</p>`,
		});
	} catch (error) {
		const raw = error instanceof Error ? error.message : "Unable to send OTP email.";
		if (raw.includes("535") || raw.toLowerCase().includes("username and password not accepted")) {
			throw new Error("SMTP authentication failed. For Gmail, use your Gmail address in SMTP_USER and a Google App Password in SMTP_PASS.");
		}
		throw new Error("Unable to send OTP email. Please verify SMTP settings.");
	}
}