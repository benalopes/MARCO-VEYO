import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/constants";

type ProductCardProps = {
  product: Product;
};

/**
 * Card de produto para listagens do catálogo.
 * @param props - Propriedades do componente
 * @param props.product - Dados do produto a exibir
 * @returns Bloco interativo do produto
 */
export function ProductCard({ product }: ProductCardProps) {
  const message = `Olá! Tenho interesse no produto "${product.title}" (${formatPrice(product.price)}).`;

  return (
    <article className="product-card">
      <Link href={`/catalogo/${product.id}`} className="product-media">
        <Image
          src={product.image}
          alt={product.title}
          width={640}
          height={480}
          className="product-image"
        />
      </Link>
      <div className="product-body">
        <p className="product-category">{CATEGORY_LABELS[product.category]}</p>
        <h3>
          <Link href={`/catalogo/${product.id}`}>{product.title}</Link>
        </h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-meta">
          <span className="product-price">{formatPrice(product.price)}</span>
          <a
            href={buildWhatsAppUrl(message)}
            className="btn btn-gold btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pedir no WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
