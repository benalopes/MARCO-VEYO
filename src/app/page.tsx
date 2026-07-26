import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { BRAND_NAME, BRAND_TAGLINE, buildWhatsAppUrl } from "@/lib/constants";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

/**
 * Página inicial com hero da marca e destaque do catálogo.
 * @returns Conteúdo da home
 */
export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-content">
          <Image
            src="/images/logo.png"
            alt={`${BRAND_NAME} — Móveis Rústicos`}
            width={420}
            height={420}
            className="hero-logo"
            priority
          />
          <h1>{BRAND_NAME}</h1>
          <p className="hero-title">{BRAND_NAME}</p>
          <span className="hero-kicker">Móveis Rústicos</span>
          <p className="hero-lead">
            Peças artesanais em madeira — mesas, tábuas de churrasco, bancos e
            cadeiras com acabamento que une rusticidade e sofisticação.
          </p>
          <div className="hero-actions">
            <Link href="/catalogo" className="btn btn-gold">
              Ver catálogo
            </Link>
            <a
              href={buildWhatsAppUrl(
                "Olá! Gostaria de conhecer os móveis da Marco Veyo.",
              )}
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </div>
          <p className="hero-script">{BRAND_TAGLINE}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Feito à mão, pensado para durar</h2>
          <p>
            Cada peça é produzida artesanalmente, valorizando a madeira natural
            e o acabamento cuidadoso que define a identidade Marco Veyo.
          </p>
        </div>
        <div className="feature-strip">
          <article className="feature-item">
            <h3>Mesas</h3>
            <p>Jantar e convivência com presença marcante na madeira maciça.</p>
          </article>
          <article className="feature-item">
            <h3>Tábuas & bancos</h3>
            <p>Para o churrasco e o dia a dia, com robustez e belo acabamento.</p>
          </article>
          <article className="feature-item">
            <h3>Cadeiras</h3>
            <p>Conforto artesanal que completa ambientes rústicos elegantes.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Destaques do catálogo</h2>
          <p>Confira algumas peças disponíveis e peça pelo WhatsApp.</p>
        </div>
        {featured.length === 0 ? (
          <div className="empty-state">
            <p>Em breve novos móveis no catálogo.</p>
          </div>
        ) : (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/catalogo" className="btn btn-outline">
            Ver catálogo completo
          </Link>
        </div>
      </section>
    </>
  );
}
