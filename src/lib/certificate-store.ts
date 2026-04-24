import { promises as fs } from "fs";

import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const CERTIFICATES_FILE = getDataFile("certificates.json");
const CERTIFICATES_DB_KEY = "certificates";

type CertificateStore = {
  certificates: CertificateRecord[];
};

const defaultStore: CertificateStore = {
  certificates: [],
};

export type CertificateRecord = {
  id: string;
  professionalId: string;
  professionalName: string;
  studentId: string;
  studentName: string;
  issuedAt: string;
  message: string;
  imageDataUrl?: string;
};

async function ensureCertificatesFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CERTIFICATES_FILE);
  } catch {
    await fs.writeFile(CERTIFICATES_FILE, JSON.stringify(defaultStore, null, 2), "utf-8");
  }
}

async function readStore(): Promise<CertificateStore> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();

    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [CERTIFICATES_DB_KEY],
    );

    if (result.rows.length > 0) {
      const parsed = result.rows[0].data as Partial<CertificateStore>;
      return {
        certificates: Array.isArray(parsed?.certificates) ? (parsed.certificates as CertificateRecord[]) : [],
      };
    }

    // DB empty — seed from JSON file
    try {
      const raw = await fs.readFile(CERTIFICATES_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Partial<CertificateStore>;
      const store: CertificateStore = {
        certificates: Array.isArray(parsed?.certificates) ? (parsed.certificates as CertificateRecord[]) : [],
      };
      if (store.certificates.length > 0) {
        await writeStore(store);
      }
      return store;
    } catch {
      return defaultStore;
    }
  }

  await ensureCertificatesFile();
  const raw = await fs.readFile(CERTIFICATES_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw) as Partial<CertificateStore>;
    return {
      certificates: Array.isArray(parsed.certificates) ? (parsed.certificates as CertificateRecord[]) : [],
    };
  } catch {
    return defaultStore;
  }
}

async function writeStore(store: CertificateStore) {
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
      [CERTIFICATES_DB_KEY, JSON.stringify(store)],
    );
    return;
  }

  await fs.writeFile(CERTIFICATES_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function getCertificates(): Promise<CertificateRecord[]> {
  const store = await readStore();
  return store.certificates;
}

export async function appendCertificate(cert: CertificateRecord): Promise<CertificateRecord> {
  const store = await readStore();
  store.certificates = [cert, ...store.certificates];
  await writeStore(store);
  return cert;
}
