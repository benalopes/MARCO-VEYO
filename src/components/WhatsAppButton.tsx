"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP_NAME, buildWhatsAppUrl } from "@/lib/constants";

/**
 * Botão flutuante de contato via WhatsApp.
 * @returns Botão fixo ou `null` na área admin
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={buildWhatsAppUrl(
        "Olá Marcos Paulo! Vi o site da Marco Veyo e quero saber mais sobre os móveis.",
      )}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar com ${WHATSAPP_NAME} no WhatsApp`}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.04 3C9.37 3 3.96 8.4 3.96 15.05c0 2.12.56 4.18 1.62 6L3 29l8.15-2.13a12.1 12.1 0 0 0 4.89 1.04h.01c6.67 0 12.08-5.4 12.08-12.06C28.13 8.4 22.71 3 16.04 3zm0 21.96h-.01a10.1 10.1 0 0 1-5.14-1.4l-.37-.22-4.84 1.27 1.29-4.71-.24-.39a10 10 0 0 1-1.54-5.36c0-5.55 4.53-10.06 10.1-10.06 5.56 0 10.09 4.51 10.09 10.06 0 5.55-4.53 10.05-10.09 10.05zm5.54-7.54c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.44.25-.7.25-1.31.18-1.44-.07-.13-.27-.2-.57-.35z"
        />
      </svg>
      <span>WhatsApp</span>
    </a>
  );
}
