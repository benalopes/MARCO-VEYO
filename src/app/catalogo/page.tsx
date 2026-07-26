import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import type { ProductCategory } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

type CatalogPageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

/**
 * Página do catálogo com filtros por categoria.
 * @param props - Propriedades da página
 * @param props.searchParams - Query string com categoria opcional
 * @returns Listagem filtrada de produtos
 */
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const raw = params.categoria;
  const active =
    raw && CATEGORIES.includes(raw as ProductCategory)
      ? (raw as ProductCategory)
      : "todos";

  const products = await getProducts();
  const filtered =
    active === "todos"
      ? products
      : products.filter((item) => item.category === active);

  const title =
    active === "todos" ? "Catálogo" : CATEGORY_LABELS[active];

  return (
    <>
      <div className="page-banner">
        <h1>{title}</h1>
        <p>
          Móveis rústicos artesanais — explore mesas, tábuas de churrasco,
          bancos e cadeiras.
        </p>
      </div>

      <section className="section">
        <CatalogFilters active={active} />

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>
              {products.length === 0
                ? "Nenhum produto cadastrado ainda. Use a área administrativa para incluir as peças."
                : "Nenhum produto nesta categoria no momento."}
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
