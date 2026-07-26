import type { ProductCategory, ProductInput } from "./types";
import { CATEGORIES } from "./types";
import { isImageDataUrl, isPublicImagePath } from "./images";

type ValidationResult =
  | { ok: true; data: ProductInput }
  | { ok: false; error: string };

/**
 * Valida o payload de criação/edição de produto.
 * @param body - Corpo parcialmente tipado da requisição
 * @returns Dados limpos ou mensagem de erro
 */
export function validateProductInput(body: Partial<ProductInput>): ValidationResult {
  const title = body.title?.trim() ?? "";
  const description = body.description?.trim() ?? "";
  const image = body.image?.trim() ?? "";
  const category = body.category as ProductCategory | undefined;
  const price = Number(body.price);

  if (!title || !description || !image || !category || Number.isNaN(price)) {
    return {
      ok: false,
      error: "Preencha título, descrição, preço, categoria e imagem.",
    };
  }

  if (!CATEGORIES.includes(category)) {
    return { ok: false, error: "Categoria inválida." };
  }

  if (price < 0) {
    return { ok: false, error: "O preço não pode ser negativo." };
  }

  if (!isImageDataUrl(image) && !isPublicImagePath(image)) {
    return { ok: false, error: "Imagem inválida. Envie uma foto do produto." };
  }

  return {
    ok: true,
    data: { title, description, price, image, category },
  };
}
