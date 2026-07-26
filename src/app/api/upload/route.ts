import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  resolveImageExtension,
  saveImageBuffer,
} from "@/lib/image-store";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024;

/**
 * Faz upload multipart de imagem de produto (somente admin).
 * Em produção (Vercel) grava no Blob; em desenvolvimento, em `public/uploads`.
 * @param request - FormData com campo `file`
 * @returns URL pública da imagem salva
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    }

    const blob = file as Blob & { name?: string };
    if (blob.size <= 0) {
      return NextResponse.json({ error: "Arquivo vazio." }, { status: 400 });
    }
    if (blob.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "A imagem deve ter no máximo 8 MB." },
        { status: 400 },
      );
    }

    const filename = typeof blob.name === "string" ? blob.name : "produto.jpg";
    const ext = resolveImageExtension(blob.type || "", filename);
    if (!ext) {
      return NextResponse.json(
        { error: "Use imagens JPG, PNG, WEBP ou GIF." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await blob.arrayBuffer());
    const url = await saveImageBuffer(buffer, ext);
    return NextResponse.json({ url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha no upload da imagem.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
