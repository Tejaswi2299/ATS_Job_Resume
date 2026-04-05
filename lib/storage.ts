import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { BaselineResume, SavedResumeMeta } from "@/types";

const uploadDir = path.join(process.cwd(), "data", "uploads");

export async function ensureUploadDir() {
  await fs.mkdir(uploadDir, { recursive: true });
}

export function buildId() {
  return crypto.randomUUID();
}

export async function saveResumeFile(fileName: string, bytes: Buffer) {
  await ensureUploadDir();
  const id = buildId();
  const ext = path.extname(fileName) || ".bin";
  const filePath = path.join(uploadDir, `${id}${ext}`);
  await fs.writeFile(filePath, bytes);
  return { id, filePath };
}

export async function saveResumeMetadata(meta: SavedResumeMeta) {
  await ensureUploadDir();
  const metaPath = path.join(uploadDir, `${meta.id}.json`);
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");
}

export async function listSavedResumes(): Promise<SavedResumeMeta[]> {
  await ensureUploadDir();
  const files = await fs.readdir(uploadDir);
  const metas = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(uploadDir, file), "utf-8");
        return JSON.parse(raw) as SavedResumeMeta;
      })
  );

  return metas.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function getSavedResume(id: string): Promise<SavedResumeMeta | null> {
  try {
    const metaPath = path.join(uploadDir, `${id}.json`);
    const raw = await fs.readFile(metaPath, "utf-8");
    return JSON.parse(raw) as SavedResumeMeta;
  } catch {
    return null;
  }
}

export function buildSavedResumeMeta(args: {
  id: string;
  fileName: string;
  baseline: BaselineResume;
}): SavedResumeMeta {
  return {
    id: args.id,
    fileName: args.fileName,
    uploadedAt: new Date().toISOString(),
    baseline: args.baseline
  };
}
