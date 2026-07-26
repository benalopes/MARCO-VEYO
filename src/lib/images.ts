/**
 * Verifica se o valor é uma data URL de imagem.
 * @param value - String a validar
 * @returns `true` quando for `data:image/...;base64,...`
 */
export function isImageDataUrl(value: string): boolean {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
}

/**
 * Verifica se o valor é um caminho/URL de imagem válido.
 * @param value - String a validar
 * @returns `true` para caminhos locais ou URLs http(s)
 */
export function isPublicImagePath(value: string): boolean {
  return (
    value.startsWith("/uploads/") ||
    value.startsWith("/images/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}
