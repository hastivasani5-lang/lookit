import os from "os";
import path from "path";

const LOCAL_DATA_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const VERCEL_DATA_DIR = path.join(os.tmpdir(), "lookit-data");

export function getDataDir() {
  if (process.env.VERCEL) {
    return VERCEL_DATA_DIR;
  }

  if (process.cwd().startsWith("/var/task")) {
    return VERCEL_DATA_DIR;
  }

  return LOCAL_DATA_DIR;
}

export function getDataFile(fileName: string) {
  return path.join(getDataDir(), fileName);
}