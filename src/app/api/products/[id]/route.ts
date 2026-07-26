import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { persistProductImage } from "@/lib/images";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/products";
import { validateProductInput } from "@/lib/product-validation";
import type { ProductInput } from "@/lib/types";

export const runtime = "nodejs";

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
 * Atualiza um produto (somente admin), persistindo nova imagem se enviada.
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
  const validation = validateProductInput(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const imagePath = await persistProductImage(validation.data.image);
    const product = await updateProduct(id, {
      ...validation.data,
      image: imagePath,
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao gravar a imagem.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
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
