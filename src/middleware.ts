import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "mv_admin_session";

/**
 * Gera o token de sessão com Web Crypto (compatível com Edge).
 * @param password - Senha administrativa
 * @param secret - Segredo da sessão
 * @returns Hash hexadecimal SHA-256
 */
async function createSessionToken(
  password: string,
  secret: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${password}:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Protege rotas administrativas exigindo cookie de sessão válido.
 * @param request - Requisição intermediada
 * @returns Continuação ou redirecionamento para login
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const password = process.env.ADMIN_PASSWORD || "marcoveyo2026";
  const secret = process.env.ADMIN_SESSION_SECRET || "marco-veyo-fallback";
  const expected = await createSessionToken(password, secret);

  if (!token || token !== expected) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
