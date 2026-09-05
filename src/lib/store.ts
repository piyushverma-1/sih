import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { CandidateProfile } from "./types";
import { EMPTY_PROFILE } from "./sample-data";

const DATA_DIR = path.join(process.cwd(), ".data");
const PROFILE_PATH = path.join(DATA_DIR, "profile.json");

let cache: CandidateProfile | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

async function readFromDisk(): Promise<CandidateProfile | null> {
  try {
    const raw = await fs.readFile(PROFILE_PATH, "utf8");
    return JSON.parse(raw) as CandidateProfile;
  } catch {
    return null;
  }
}

async function writeToDisk(profile: CandidateProfile): Promise<void> {
  await ensureDir();
  writeQueue = writeQueue.then(async () => {
    const tmp = PROFILE_PATH + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(profile, null, 2), "utf8");
    await fs.rename(tmp, PROFILE_PATH);
  });
  await writeQueue;
}

export async function loadProfileServer(): Promise<CandidateProfile> {
  if (cache) return cache;
  const disk = await readFromDisk();
  cache = disk ?? { ...EMPTY_PROFILE };
  if (!disk) await writeToDisk(cache);
  return cache;
}

export async function saveProfileServer(
  patch: Partial<CandidateProfile> | ((p: CandidateProfile) => CandidateProfile)
): Promise<CandidateProfile> {
  const current = await loadProfileServer();
  const next =
    typeof patch === "function" ? patch(current) : { ...current, ...patch };
  cache = next;
  await writeToDisk(next);
  return next;
}

export async function resetProfileServer(): Promise<CandidateProfile> {
  cache = { ...EMPTY_PROFILE, createdAt: new Date().toISOString() };
  await writeToDisk(cache);
  return cache;
}