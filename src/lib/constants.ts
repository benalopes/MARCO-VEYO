/** Contato WhatsApp do responsável (apenas dígitos com DDI). */
export const WHATSAPP_NUMBER = "5562999046020";

/** Nome do contato exibido no site. */
export const WHATSAPP_NAME = "Marcos Paulo";

/** Telefone formatado para exibição. */
export const WHATSAPP_DISPLAY = "(62) 99904-6020";

/**
 * Monta o link do WhatsApp com mensagem opcional.
 * @param message - Texto pré-preenchido na conversa
 * @returns URL wa.me pronta para abrir
 */
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Nome da marca. */
export const BRAND_NAME = "Marco Veyo";

/** Tagline da marca. */
export const BRAND_TAGLINE = "Requinte e bom gosto";
