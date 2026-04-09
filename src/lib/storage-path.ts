import os from "os";
import path from "path";

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const VERCEL_DATA_DIR = path.join(os.tmpdir(), "lookit-data");

export function getDataDir() {
  return process.env.VERCEL ? VERCEL_DATA_DIR : LOCAL_DATA_DIR;
}

export function getDataFile(fileName: string) {
  return path.join(getDataDir(), fileName);
}