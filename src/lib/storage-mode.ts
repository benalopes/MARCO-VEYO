/**
 * Indica se o ambiente é serverless (ex.: Vercel), onde o disco é somente leitura.
 * @returns `true` em ambientes serverless
 */
export function isServerlessRuntime(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

/**
 * Indica se o armazenamento persistente via Vercel Blob está disponível.
 * @returns `true` quando o token de Blob está configurado
 */
export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Define se gravações devem usar Vercel Blob em vez do sistema de arquivos.
 * @returns `true` para usar Blob
 */
export function shouldUseBlobStorage(): boolean {
  return hasBlobStorage() || isServerlessRuntime();
}

/**
 * Garante que o Blob esteja configurado quando obrigatório.
 * @throws Error com instrução clara se estiver em serverless sem token
 */
export function assertBlobConfiguredForWrites(): void {
  if (isServerlessRuntime() && !hasBlobStorage()) {
    throw new Error(
      "Configure BLOB_READ_WRITE_TOKEN na Vercel (Storage → Blob) para salvar produtos e imagens.",
    );
  }
}
