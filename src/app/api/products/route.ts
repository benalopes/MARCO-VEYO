import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProduct, getProducts } from "@/lib/products";
import { validateProductInput } from "@/lib/product-validation";
import type { ProductInput } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Lista produtos do catálogo (público).
 * @returns JSON com a lista de produtos
 */
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao listar produtos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Cria um novo produto (somente admin).
 * @param request - Corpo JSON com caminho da imagem já enviada
 * @returns Produto criado ou erro
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<ProductInput>;
    const validation = validateProductInput(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (validation.data.image.startsWith("data:")) {
      return NextResponse.json(
        {
          error:
            "Envie a imagem pelo upload antes de salvar o produto.",
        },
        { status: 400 },
      );
    }

    const product = await createProduct(validation.data);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao salvar o produto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
