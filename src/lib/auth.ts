import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "mv_admin_session";

/**
 * Gera o token de sessão a partir da senha e do segredo.
 * @param password - Senha administrativa
 * @returns Hash hexadecimal da sessão
 */
function createSessionToken(password: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "marco-veyo-fallback";
  return createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

/**
 * Valida a senha do administrador.
 * @param password - Senha informada no login
 * @returns `true` se a senha estiver correta
 */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "marcoveyo2026";
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Cria o cookie de sessão administrativa.
 * @param password - Senha já validada
 */
export async function setAdminSession(password: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Remove o cookie de sessão administrativa.
 */
export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/**
 * Verifica se a requisição atual possui sessão admin válida.
 * @returns `true` quando autenticado
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const password = process.env.ADMIN_PASSWORD || "marcoveyo2026";
  const expected = createSessionToken(password);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
