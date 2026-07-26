import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { persistProductImage } from "@/lib/images";

export const runtime = "nodejs";

/**
 * Faz upload de imagem de produto (somente admin).
 * Aceita arquivo multipart ou data URL em JSON.
 * @param request - FormData (`file`) ou JSON `{ dataUrl }`
 * @returns Caminho público da imagem salva
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { dataUrl?: string };
      if (!body.dataUrl) {
        return NextResponse.json({ error: "Imagem não enviada." }, { status: 400 });
      }
      const url = await persistProductImage(body.dataUrl);
      return NextResponse.json({ url });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    }

    const blob = file as Blob;
    const buffer = Buffer.from(await blob.arrayBuffer());
    const mime = blob.type || "image/jpeg";
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    const url = await persistProductImage(dataUrl);
    return NextResponse.json({ url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha no upload da imagem.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
