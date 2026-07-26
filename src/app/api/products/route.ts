import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProduct, getProducts } from "@/lib/products";
import type { ProductCategory, ProductInput } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

/**
 * Lista produtos do catálogo (público).
 * @returns JSON com a lista de produtos
 */
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

/**
 * Cria um novo produto (somente admin).
 * @param request - Corpo com dados do produto
 * @returns Produto criado ou erro
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

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

  if (price < 0) {
    return NextResponse.json(
      { error: "O preço não pode ser negativo." },
      { status: 400 },
    );
  }

  const product = await createProduct({
    title,
    description,
    price,
    image,
    category,
  });

  return NextResponse.json(product, { status: 201 });
}
