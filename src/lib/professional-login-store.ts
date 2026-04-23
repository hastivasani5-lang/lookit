import { promises as fs } from "fs";

import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const FILE_PATH = getDataFile("professional-logins.json");
const DB_KEY = "professional-logins";

type ProfessionalLoginStore = {
	professionalIds: string[];
};

const defaultStore: ProfessionalLoginStore = {
	professionalIds: [],
};

async function ensureFile() {
	await fs.mkdir(DATA_DIR, { recursive: true });
	try {
		await fs.access(FILE_PATH);
	} catch {
		await fs.writeFile(FILE_PATH, JSON.stringify(defaultStore, null, 2), "utf-8");
	}
}

async function readStore(): Promise<ProfessionalLoginStore> {
	if (isPostgresConfigured()) {
		await ensureDbSchema();
		const db = getDbPool();
		const result = await db.query<{ data: unknown }>(`SELECT data FROM app_data WHERE key = $1 LIMIT 1`, [DB_KEY]);

		if (result.rows.length === 0) {
			return defaultStore;
		}

		const parsed = result.rows[0].data as Partial<ProfessionalLoginStore>;
		return {
			professionalIds: Array.isArray(parsed?.professionalIds)
				? parsed.professionalIds.filter((value): value is string => typeof value === "string")
				: [],
		};
	}

	await ensureFile();
	const raw = await fs.readFile(FILE_PATH, "utf-8");

	try {
		const parsed = JSON.parse(raw) as Partial<ProfessionalLoginStore>;
		return {
			professionalIds: Array.isArray(parsed?.professionalIds)
				? parsed.professionalIds.filter((value): value is string => typeof value === "string")
				: [],
		};
	} catch {
		return defaultStore;
	}
}

async function writeStore(store: ProfessionalLoginStore) {
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
			[DB_KEY, JSON.stringify(store)],
		);
		return;
	}

	await fs.writeFile(FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export async function markProfessionalLoggedIn(professionalId: string) {
	try {
		const id = professionalId.trim();
		if (!id) {
			return;
		}

		const store = await readStore();
		if (!store.professionalIds.includes(id)) {
			store.professionalIds.unshift(id);
			await writeStore(store);
		}
	} catch (error) {
		console.error("Error marking professional as logged in:", error);
		// Don't throw - this is a non-critical operation
	}
}

export async function getLoggedInProfessionalIds() {
	const store = await readStore();
	return store.professionalIds;
}

export async function markProfessionalLoggedOut(professionalId: string) {
	const id = professionalId.trim();
	if (!id) {
		return;
	}

	const store = await readStore();
	const nextIds = store.professionalIds.filter((entry) => entry !== id);

	if (nextIds.length !== store.professionalIds.length) {
		await writeStore({ professionalIds: nextIds });
	}
}

export async function removeProfessionalLogin(professionalId: string) {
	await markProfessionalLoggedOut(professionalId);
}
