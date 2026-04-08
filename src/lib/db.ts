import { Pool } from "pg";

let pool: Pool | null = null;

export function isPostgresConfigured() {
  if (process.env.DATABASE_URL) {
    return true;
  }

  return Boolean(process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE);
}

export function getDbPool() {
  if (pool) {
    return pool;
  }

  const connectionString =
    process.env.DATABASE_URL ||
    (() => {
      if (!process.env.PGHOST || !process.env.PGUSER || !process.env.PGDATABASE) {
        return "";
      }

      const password = encodeURIComponent(process.env.PGPASSWORD ?? "");
      const port = process.env.PGPORT ?? "5432";
      return `postgresql://${process.env.PGUSER}:${password}@${process.env.PGHOST}:${port}/${process.env.PGDATABASE}`;
    })();

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const useSsl = process.env.DATABASE_SSL === "true";

  pool = new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });

  return pool;
}

let schemaReadyPromise: Promise<void> | null = null;

export function ensureDbSchema() {
  if (!schemaReadyPromise) {
    const db = getDbPool();
    schemaReadyPromise = db
      .query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT,
          role TEXT NOT NULL CHECK (role IN ('student', 'professional')),
          image TEXT,
          specialization TEXT,
          contact_number TEXT,
          location TEXT,
          certificates TEXT[] NOT NULL DEFAULT '{}',
          reviews TEXT[] NOT NULL DEFAULT '{}',
          profile_boosted_until TIMESTAMPTZ,
          approval_status TEXT NOT NULL DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
          approval_reviewed_by TEXT,
          approval_reviewed_at TIMESTAMPTZ,
          approval_note TEXT,
          provider TEXT NOT NULL CHECK (provider IN ('credentials', 'google')),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `)
      .then(() =>
        db.query(`
          ALTER TABLE users
          ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'approved';
        `),
      )
      .then(() =>
        db.query(`
          ALTER TABLE users
          ADD COLUMN IF NOT EXISTS approval_reviewed_by TEXT;
        `),
      )
      .then(() =>
        db.query(`
          ALTER TABLE users
          ADD COLUMN IF NOT EXISTS approval_reviewed_at TIMESTAMPTZ;
        `),
      )
      .then(() =>
        db.query(`
          ALTER TABLE users
          ADD COLUMN IF NOT EXISTS approval_note TEXT;
        `),
      )
      .then(() => undefined);
  }

  return schemaReadyPromise;
}
