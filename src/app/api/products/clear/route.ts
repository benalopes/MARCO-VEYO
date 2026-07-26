import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { writeProducts } from "@/lib/product-store";

export const runtime = "nodejs";

/**
 * Esvazia o catálogo (somente admin), deixando a base pronta para novos cadastros.
 * @returns Confirmação de limpeza
 */
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    await writeProducts([]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao limpar o catálogo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
