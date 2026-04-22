/**
 * Update a few users to have today's createdAt for testing the Today table
 * Run: npx tsx scripts/set-today-test-data.ts
 */

import { promises as fs } from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data/users.json");

async function main() {
  const raw = await fs.readFile(USERS_FILE, "utf-8");
  const users = JSON.parse(raw);

  const today = new Date().toISOString();

  // Update first 3 students and first 2 professionals to today
  let studentCount = 0;
  let professionalCount = 0;

  for (const user of users) {
    if (user.role === "student" && studentCount < 3) {
      user.createdAt = today;
      studentCount++;
    } else if (user.role === "professional" && professionalCount < 2) {
      user.createdAt = today;
      professionalCount++;
    }

    if (studentCount >= 3 && professionalCount >= 2) break;
  }

  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  console.log(`✅ Updated ${studentCount} students and ${professionalCount} professionals to today (${today.slice(0, 10)})`);
}

main().catch(console.error);
