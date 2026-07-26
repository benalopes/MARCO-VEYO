import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/products";
import type { ProductCategory, ProductInput } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Retorna um produto específico (público).
 * @param _request - Requisição HTTP
 * @param context - Parâmetros da rota com `id`
 * @returns Produto ou 404
 */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }
  return NextResponse.json(product);
}

/**
 * Atualiza um produto (somente admin).
 * @param request - Corpo com dados atualizados
 * @param context - Parâmetros da rota com `id`
 * @returns Produto atualizado ou erro
 */
export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Partial<ProductInput>;
  const title = body.title?.trim() ?? "";
  const description = body.description?.trim() ?? "";
  const image = body.image?.trim() ?? "";
  const category = body.category as ProductCategory | undefined;
  const price = Number(body.price);

  if (!title || !description || !image || !category || Number.isNaN(price)) {
    return NextResponse.json(
      { error: "Preencha título, descrição, preço, categoria e imagem." },
      { status: 400 },
    );
  }

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
  }

  const product = await updateProduct(id, {
    title,
    description,
    price,
    image,
    category,
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  return NextResponse.json(product);
}

/**
 * Remove um produto (somente admin).
 * @param _request - Requisição HTTP
 * @param context - Parâmetros da rota com `id`
 * @returns Confirmação ou erro
 */
export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const removed = await deleteProduct(id);
  if (!removed) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
