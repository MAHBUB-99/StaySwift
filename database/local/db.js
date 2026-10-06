import crypto from "crypto";
import fs from "fs";
import path from "path";
import seed from "./data";

// A small JSON database. Tables are arrays in memory; every write is saved
// to .data/db.json so bookings, sign-ups and reviews survive a restart.
// Delete .data/db.json (or bump `version` in data.js) to start from the seed.

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

function load() {
  try {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (saved.version === seed.version) return saved;
  } catch {
    // No saved file yet, or it is unreadable: start from the seed.
  }
  return structuredClone(seed);
}

// Kept on globalThis so dev-server hot reloads don't reset the data. It is
// reloaded when `version` in data.js changes.
export function getDb() {
  if (!globalThis.__stayswiftDb || globalThis.__stayswiftDb.version !== seed.version) {
    globalThis.__stayswiftDb = load();
  }
  return globalThis.__stayswiftDb;
}

export function saveDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(getDb(), null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

// 24 hex characters, the same shape as the seed ids.
export const newId = () => crypto.randomBytes(12).toString("hex");

export const nowISO = () => new Date().toISOString();
