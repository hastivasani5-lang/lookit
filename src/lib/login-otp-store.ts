import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import { hash, compare } from "bcryptjs";

import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const FILE_PATH = getDataFile("login-otp-challenges.json");
const DB_KEY = "login-otp-challenges";
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

type LoginOtpChallenge = {
	challengeId: string;
	userId: string;
	email: string;
	role: "student" | "professional";
	otpHash: string;
	attempts: number;
	expiresAt: string;
	createdAt: string;
};

type LoginOtpStore = {
	challenges: LoginOtpChallenge[];
};

const defaultStore: LoginOtpStore = { challenges: [] };

async function ensureFile() {
	await fs.mkdir(DATA_DIR, { recursive: true });
	try {
		await fs.access(FILE_PATH);
	} catch {
		await fs.writeFile(FILE_PATH, JSON.stringify(defaultStore, null, 2), "utf-8");
	}
}

function pruneExpired(challenges: LoginOtpChallenge[]) {
	const now = Date.now();
	return challenges.filter((challenge) => new Date(challenge.expiresAt).getTime() > now);
}

async function readStore(): Promise<LoginOtpStore> {
	if (isPostgresConfigured()) {
		await ensureDbSchema();
		const db = getDbPool();
		const result = await db.query<{ data: unknown }>(`SELECT data FROM app_data WHERE key = $1 LIMIT 1`, [DB_KEY]);

		if (result.rows.length === 0) {
			return defaultStore;
		}

		const parsed = result.rows[0].data as Partial<LoginOtpStore>;
		return {
			challenges: pruneExpired(Array.isArray(parsed?.challenges) ? parsed.challenges : []),
		};
	}

	await ensureFile();
	const raw = await fs.readFile(FILE_PATH, "utf-8");

	try {
		const parsed = JSON.parse(raw) as Partial<LoginOtpStore>;
		return {
			challenges: pruneExpired(Array.isArray(parsed?.challenges) ? parsed.challenges : []),
		};
	} catch {
		return defaultStore;
	}
}

async function writeStore(store: LoginOtpStore) {
	const nextStore = { challenges: pruneExpired(store.challenges) };

	if (isPostgresConfigured()) {
		await ensureDbSchema();
		const db = getDbPool();
		await db.query(
			`
				INSERT INTO app_data (key, data, updated_at)
				VALUES ($1, $2::jsonb, NOW())
				ON CONFLICT (key)
				DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
			`,
			[DB_KEY, JSON.stringify(nextStore)],
		);
		return;
	}

	await fs.writeFile(FILE_PATH, JSON.stringify(nextStore, null, 2), "utf-8");
}

export async function createLoginOtpChallenge(input: {
	userId: string;
	email: string;
	role: "student" | "professional";
	otp: string;
}) {
	const store = await readStore();
	const challengeId = randomUUID();
	const otpHash = await hash(input.otp, 10);
	const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

	store.challenges = [
		...
		store.challenges.filter((challenge) => challenge.userId !== input.userId),
		{
			challengeId,
			userId: input.userId,
			email: input.email,
			role: input.role,
			otpHash,
			attempts: 0,
			expiresAt,
			createdAt: new Date().toISOString(),
		},
	];

	await writeStore(store);
	return { challengeId, expiresAt };
}

export async function verifyLoginOtpChallenge(input: { challengeId: string; otp: string }) {
	const store = await readStore();
	const index = store.challenges.findIndex((challenge) => challenge.challengeId === input.challengeId);

	if (index === -1) {
		return null;
	}

	const challenge = store.challenges[index];
	if (new Date(challenge.expiresAt).getTime() <= Date.now()) {
		store.challenges.splice(index, 1);
		await writeStore(store);
		return null;
	}

	const isValid = await compare(input.otp, challenge.otpHash);
	if (!isValid) {
		challenge.attempts += 1;
		if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
			store.challenges.splice(index, 1);
		}
		await writeStore(store);
		return null;
	}

	store.challenges.splice(index, 1);
	await writeStore(store);

	return {
		userId: challenge.userId,
		email: challenge.email,
		role: challenge.role,
	};
}

export async function getLoginOtpChallengeById(challengeId: string) {
	const store = await readStore();
	return store.challenges.find((challenge) => challenge.challengeId === challengeId) ?? null;
}