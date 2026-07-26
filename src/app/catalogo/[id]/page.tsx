import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductImage } from "@/components/ProductImage";
import { buildWhatsAppUrl } from "@/lib/constants";
import { formatPrice, getProductById } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/types";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

/**
 * Página de detalhe de um produto do catálogo.
 * @param props - Propriedades da página
 * @param props.params - Parâmetros com o ID do produto
 * @returns Detalhes do produto ou 404
 */
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const message = `Olá! Tenho interesse no produto "${product.title}" (${formatPrice(product.price)}).`;

  return (
    <section className="section" style={{ paddingTop: "3rem" }}>
      <p style={{ marginBottom: "1.25rem" }}>
        <Link href="/catalogo" style={{ color: "var(--gold)" }}>
          ← Voltar ao catálogo
        </Link>
      </p>

      <div className="detail-layout">
        <div className="detail-media">
          <ProductImage
            src={product.image}
            alt={product.title}
            width={900}
            height={700}
          />
        </div>
        <div className="detail-info">
          <p className="product-category">
            {CATEGORY_LABELS[product.category]}
          </p>
          <h1>{product.title}</h1>
          <span className="product-price">{formatPrice(product.price)}</span>
          <p>{product.description}</p>
          <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
            <a
              href={buildWhatsAppUrl(message)}
              className="btn btn-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pedir no WhatsApp
            </a>
            <Link href="/catalogo" className="btn btn-outline">
              Mais produtos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
