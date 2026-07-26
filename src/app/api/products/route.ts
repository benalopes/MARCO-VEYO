import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { persistProductImage } from "@/lib/images";
import { createProduct, getProducts } from "@/lib/products";
import { validateProductInput } from "@/lib/product-validation";
import type { ProductInput } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Lista produtos do catálogo (público).
 * @returns JSON com a lista de produtos
 */
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

/**
 * Cria um novo produto (somente admin), gravando a imagem em disco e o caminho no JSON.
 * @param request - Corpo com dados do produto (imagem como data URL ou caminho)
 * @returns Produto criado ou erro
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as Partial<ProductInput>;
  const validation = validateProductInput(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const imagePath = await persistProductImage(validation.data.image);
    const product = await createProduct({
      ...validation.data,
      image: imagePath,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao gravar a imagem.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
