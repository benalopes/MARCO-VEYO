import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_DATA_URL_CHARS = 8_000_000;

/**
 * Verifica se o valor é uma data URL de imagem.
 * @param value - String a validar
 * @returns `true` quando for `data:image/...;base64,...`
 */
export function isImageDataUrl(value: string): boolean {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
}

/**
 * Verifica se o valor é um caminho público de imagem válido.
 * @param value - String a validar
 * @returns `true` para caminhos locais conhecidos
 */
export function isPublicImagePath(value: string): boolean {
  return (
    value.startsWith("/uploads/") ||
    value.startsWith("/images/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

/**
 * Persiste uma imagem recebida como data URL ou caminho.
 * Data URLs são gravadas em `public/uploads` e o caminho público é retornado.
 * @param image - Data URL base64 ou caminho já público
 * @returns Caminho público da imagem para salvar no JSON
 */
export async function persistProductImage(image: string): Promise<string> {
  const value = image.trim();
  if (!value) {
    throw new Error("Imagem obrigatória.");
  }

  if (isPublicImagePath(value) && !isImageDataUrl(value)) {
    return value;
  }

  if (!isImageDataUrl(value)) {
    throw new Error("Formato de imagem inválido.");
  }

  if (value.length > MAX_DATA_URL_CHARS) {
    throw new Error("A imagem é muito grande. Use até cerca de 5 MB.");
  }

  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Não foi possível ler a imagem enviada.");
  }

  const mime = match[1].toLowerCase();
  const base64 = match[2];
  const extByMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const ext = extByMime[mime];
  if (!ext) {
    throw new Error("Use imagens JPG, PNG, WEBP ou GIF.");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const buffer = Buffer.from(base64, "base64");
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}
