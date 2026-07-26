import type { Product, ProductInput } from "./types";
import { readProducts, writeProducts } from "./product-store";

/**
 * Lê todos os produtos do armazenamento ativo.
 * @returns Lista de produtos ordenada do mais recente ao mais antigo
 */
export async function getProducts(): Promise<Product[]> {
  return readProducts();
}

/**
 * Busca um produto pelo identificador.
 * @param id - ID do produto
 * @returns Produto encontrado ou `null`
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((item) => item.id === id) ?? null;
}

/**
 * Cria um novo produto no catálogo.
 * @param input - Dados do produto
 * @returns Produto criado
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await getProducts();
  const now = new Date().toISOString();
  const product: Product = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  products.unshift(product);
  await writeProducts(products);
  return product;
}

/**
 * Atualiza um produto existente.
 * @param id - ID do produto
 * @param input - Novos dados
 * @returns Produto atualizado ou `null` se não existir
 */
export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: Product = {
    ...products[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  products[index] = updated;
  await writeProducts(products);
  return updated;
}

/**
 * Remove um produto do catálogo.
 * @param id - ID do produto
 * @returns `true` se removido com sucesso
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const next = products.filter((item) => item.id !== id);
  if (next.length === products.length) return false;
  await writeProducts(next);
  return true;
}

/**
 * Formata valor monetário em Real brasileiro.
 * @param value - Preço numérico
 * @returns String formatada (ex.: R$ 1.200,00)
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
