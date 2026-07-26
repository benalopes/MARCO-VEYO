/**
 * Lê o corpo da Response como JSON com fallback seguro.
 * @param response - Resposta HTTP do `fetch`
 * @returns Objeto tipado ou `{}` se o corpo estiver vazio/inválido
 */
export async function readJsonSafe<T extends Record<string, unknown>>(
  response: Response,
): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return {
      error: text.slice(0, 180) || "Resposta inválida do servidor.",
    } as unknown as T;
  }
}
