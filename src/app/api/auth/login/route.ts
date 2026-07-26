import { NextResponse } from "next/server";
import { setAdminSession, verifyAdminPassword } from "@/lib/auth";

/**
 * Autentica o administrador e cria a sessão.
 * @param request - Requisição com JSON `{ password }`
 * @returns Resposta de sucesso ou erro
 */
export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim() ?? "";

  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json(
      { error: "Senha incorreta." },
      { status: 401 },
    );
  }

  await setAdminSession(password);
  return NextResponse.json({ ok: true });
}
