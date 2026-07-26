import Image from "next/image";
import {
  BRAND_NAME,
  WHATSAPP_DISPLAY,
  WHATSAPP_NAME,
  buildWhatsAppUrl,
} from "@/lib/constants";

/**
 * Página de contato com WhatsApp do responsável.
 * @returns Conteúdo da área de contato
 */
export default function ContactPage() {
  return (
    <>
      <div className="page-banner">
        <h1>Contato</h1>
        <p>Fale conosco e encomende sua peça artesanal.</p>
      </div>

      <section className="section">
        <div className="contact-panel">
          <div className="contact-card">
            <h2>WhatsApp</h2>
            <p>
              Atendimento direto com {WHATSAPP_NAME}. Tire dúvidas sobre
              medidas, acabamentos e disponibilidade.
            </p>
            <ul className="contact-list">
              <li>
                <strong>Responsável:</strong> {WHATSAPP_NAME}
              </li>
              <li>
                <strong>WhatsApp:</strong> {WHATSAPP_DISPLAY}
              </li>
              <li>
                <strong>Marca:</strong> {BRAND_NAME} — Móveis Rústicos
              </li>
            </ul>
            <a
              href={buildWhatsAppUrl(
                "Olá Marcos Paulo! Vim pelo site da Marco Veyo e gostaria de informações sobre os móveis.",
              )}
              className="btn btn-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir WhatsApp
            </a>
          </div>

          <div className="contact-visual">
            <Image
              src="/images/logo.png"
              alt={BRAND_NAME}
              width={360}
              height={360}
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
}
