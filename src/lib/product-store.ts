import { list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Product } from "./types";
import {
  assertBlobConfiguredForWrites,
  hasBlobStorage,
  shouldUseBlobStorage,
} from "./storage-mode";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");
const BLOB_PRODUCTS_PATH = "catalog/products.json";

/**
 * Ordena produtos do mais recente para o mais antigo.
 * @param products - Lista de produtos
 * @returns Lista ordenada
 */
function sortProducts(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * Lê o arquivo seed/local de produtos do bundle da aplicação.
 * @returns Lista de produtos do JSON versionado
 */
async function readBundledProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

/**
 * Busca a URL pública do catálogo no Vercel Blob.
 * @returns URL do JSON ou `null` se ainda não existir
 */
async function findProductsBlobUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: BLOB_PRODUCTS_PATH, limit: 10 });
  const match = blobs.find(
    (item) =>
      item.pathname === BLOB_PRODUCTS_PATH ||
      item.pathname.startsWith("catalog/products"),
  );
  return match?.url ?? null;
}

/**
 * Lê produtos persistidos no Vercel Blob.
 * @returns Lista de produtos (seed local se Blob ainda estiver vazio)
 */
async function readProductsFromBlob(): Promise<Product[]> {
  const url = await findProductsBlobUrl();
  if (!url) {
    return sortProducts(await readBundledProducts());
  }

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    return sortProducts(await readBundledProducts());
  }

  const products = (await response.json()) as Product[];
  return sortProducts(products);
}

/**
 * Grava produtos no Vercel Blob.
 * @param products - Coleção a persistir
 */
async function saveProductsToBlob(products: Product[]): Promise<void> {
  assertBlobConfiguredForWrites();
  await put(BLOB_PRODUCTS_PATH, JSON.stringify(products, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

/**
 * Garante que o arquivo local de produtos exista.
 */
async function ensureLocalDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

/**
 * Lê produtos do armazenamento ativo (Blob em produção, arquivo local em dev).
 * @returns Lista de produtos ordenada
 */
export async function readProducts(): Promise<Product[]> {
  if (shouldUseBlobStorage() && hasBlobStorage()) {
    return readProductsFromBlob();
  }

  if (shouldUseBlobStorage() && !hasBlobStorage()) {
    // Em serverless sem Blob, ainda é possível ler o seed do deploy.
    return sortProducts(await readBundledProducts());
  }

  await ensureLocalDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return sortProducts(JSON.parse(raw) as Product[]);
}

/**
 * Persiste produtos no armazenamento ativo.
 * @param products - Coleção a gravar
 */
export async function writeProducts(products: Product[]): Promise<void> {
  if (shouldUseBlobStorage()) {
    await saveProductsToBlob(products);
    return;
  }

  await ensureLocalDataFile();
  const payload = JSON.stringify(products, null, 2);
  const tempFile = `${DATA_FILE}.tmp`;
  await fs.writeFile(tempFile, payload, "utf-8");
  await fs.copyFile(tempFile, DATA_FILE);
  await fs.unlink(tempFile).catch(() => undefined);
}
