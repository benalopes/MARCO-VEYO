import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
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
  try {
    const { id } = await context.params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao buscar produto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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

  try {
    const { id } = await context.params;
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

    const product = await updateProduct(id, validation.data);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao atualizar o produto.";
    return NextResponse.json({ error: message }, { status: 500 });
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

  try {
    const { id } = await context.params;
    const removed = await deleteProduct(id);
    if (!removed) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao excluir o produto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
