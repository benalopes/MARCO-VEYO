"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  WHATSAPP_DISPLAY,
  WHATSAPP_NAME,
  buildWhatsAppUrl,
} from "@/lib/constants";

/**
 * Rodapé institucional com links e contato WhatsApp.
 * @returns Rodapé do site ou `null` na área admin
 */
export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Image
            src="/images/logo.png"
            alt={BRAND_NAME}
            width={72}
            height={72}
            className="footer-logo"
          />
          <div>
            <p className="footer-name">{BRAND_NAME}</p>
            <p className="footer-tag">{BRAND_TAGLINE}</p>
          </div>
        </div>

        <div className="footer-links">
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/contato">Contato</Link>
          <Link href="/admin">Área administrativa</Link>
        </div>

        <div className="footer-contact">
          <p>WhatsApp — {WHATSAPP_NAME}</p>
          <a
            href={buildWhatsAppUrl(
              "Olá! Vim pelo site da Marco Veyo e gostaria de mais informações.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} {BRAND_NAME}. Móveis artesanais.
      </p>
    </footer>
  );
}
