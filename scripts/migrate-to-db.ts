/**
 * Migration script: local JSON files → PostgreSQL
 * Run: npx tsx scripts/migrate-to-db.ts
 * Requires DATABASE_URL env var to be set
 */

import { Pool } from "pg";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson(file: string) {
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw);
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  console.log("🔌 Connected to PostgreSQL");

  // Create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL,
      image TEXT,
      specialization TEXT,
      contact_number TEXT,
      location TEXT,
      certificates TEXT[] NOT NULL DEFAULT '{}',
      reviews TEXT[] NOT NULL DEFAULT '{}',
      profile_boosted_until TIMESTAMPTZ,
      profile_upgrade_tier TEXT,
      approval_status TEXT NOT NULL DEFAULT 'approved',
      approval_reviewed_by TEXT,
      approval_reviewed_at TIMESTAMPTZ,
      approval_note TEXT,
      provider TEXT NOT NULL DEFAULT 'credentials',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_data (
      key TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log("✅ Tables created");

  // Migrate users
  const users = await readJson("users.json");
  let userCount = 0;
  for (const user of users) {
    try {
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, image, specialization,
          contact_number, location, certificates, reviews, profile_boosted_until,
          profile_upgrade_tier, approval_status, approval_reviewed_by,
          approval_reviewed_at, approval_note, provider, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name, email = EXCLUDED.email,
           approval_status = EXCLUDED.approval_status`,
        [
          user.id, user.name, user.email, user.passwordHash ?? null,
          user.role, user.image ?? null, user.specialization ?? null,
          user.contactNumber ?? null, user.location ?? null,
          user.certificates ?? [], user.reviews ?? [],
          user.profileBoostedUntil ?? null, user.profileUpgradeTier ?? null,
          user.approvalStatus ?? "approved", user.approvalReviewedBy ?? null,
          user.approvalReviewedAt ?? null, user.approvalNote ?? null,
          user.provider ?? "credentials", user.createdAt ?? new Date().toISOString(),
        ]
      );
      userCount++;
    } catch (e) {
      console.warn(`⚠️  User ${user.email}: ${(e as Error).message}`);
    }
  }
  console.log(`✅ Migrated ${userCount} users`);

  // Migrate app_data (JSON stores)
  const dataFiles: Record<string, string> = {
    "content-library": "content-library.json",
    "payments": "payments.json",
    "reviews": "reviews.json",
    "notifications": "notifications.json",
    "approval-notifications": "approval-notifications.json",
    "contact-messages": "contact-messages.json",
    "follows": "follows.json",
    "professional-logins": "professional-logins.json",
    "upcoming-classes": "upcoming-classes.json",
    "advance-bookings": "advance-bookings.json",
  };

  for (const [key, file] of Object.entries(dataFiles)) {
    try {
      const data = await readJson(file);
      await pool.query(
        `INSERT INTO app_data (key, data, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [key, JSON.stringify(data)]
      );
      console.log(`✅ Migrated ${key}`);
    } catch (e) {
      console.warn(`⚠️  ${file}: ${(e as Error).message}`);
    }
  }

  await pool.end();
  console.log("\n🎉 Migration complete! Set DATABASE_URL on Vercel and redeploy.");
}

main().catch(console.error);
