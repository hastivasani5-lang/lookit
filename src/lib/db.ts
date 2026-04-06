import { Pool } from "pg";
import { getEnvConfig } from "@/lib/env";

declare global {
  var __lookitDbPool: Pool | undefined;
}

function createPool() {
  const { DATABASE_URL } = getEnvConfig();

  return new Pool({
    connectionString: DATABASE_URL,
    max: 10,
  });
}

export const db = global.__lookitDbPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__lookitDbPool = db;
}

export type TodoRow = {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
};
