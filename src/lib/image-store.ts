import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import {
  assertBlobConfiguredForWrites,
  shouldUseBlobStorage,
} from "./storage-mode";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Resolve a extensão a partir do tipo MIME ou do nome do arquivo.
 * @param mime - Tipo MIME do arquivo
 * @param filename - Nome original do arquivo
 * @returns Extensão segura ou `null`
 */
export function resolveImageExtension(
  mime: string,
  filename: string,
): string | null {
  const byMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  if (byMime[mime]) return byMime[mime];

  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "jpeg") return "jpg";
  if (ext && ["jpg", "png", "webp", "gif"].includes(ext)) return ext;
  return null;
}

/**
 * Obtém o content-type a partir da extensão.
 * @param ext - Extensão do arquivo
 * @returns MIME type correspondente
 */
function contentTypeFromExt(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return map[ext] || "application/octet-stream";
}

/**
 * Salva bytes de imagem no armazenamento ativo e devolve a URL pública.
 * @param buffer - Conteúdo binário da imagem
 * @param ext - Extensão do arquivo (jpg, png, webp, gif)
 * @returns URL pública (Blob) ou caminho local `/uploads/...`
 */
export async function saveImageBuffer(
  buffer: Buffer,
  ext: string,
): Promise<string> {
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  if (shouldUseBlobStorage()) {
    assertBlobConfiguredForWrites();
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: contentTypeFromExt(ext),
      addRandomSuffix: false,
    });
    return blob.url;
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
